import { NextRequest, NextResponse } from "next/server";

// --------------------------------------------------------------------------
// IAM Token Cache — avoids hammering IBM IAM on every request
// --------------------------------------------------------------------------
interface TokenCache {
  token: string;
  expiresAt: number; // epoch ms — we treat IBM's 1h token as 55 min valid
}

let tokenCache: TokenCache | null = null;

async function getIAMToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  // Strip any accidental whitespace or semicolons (common copy-paste issue)
  const apiKey = (process.env.IBM_WATSONX_API_KEY ?? "").split(";")[0].trim();
  if (!apiKey) throw new Error("IBM_WATSONX_API_KEY env var is not set");

  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IAM token fetch failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  tokenCache = {
    token: data.access_token as string,
    expiresAt: now + 55 * 60 * 1000, // 55 minutes
  };
  return tokenCache.token;
}

// --------------------------------------------------------------------------
// watsonx.ai inference proxy
// --------------------------------------------------------------------------
const WATSONX_URL =
  "https://eu-gb.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
const PROJECT_ID =
  process.env.IBM_PROJECT_ID ?? "bd20be8b-bbee-4a91-a1c7-4aaf7f995879";
const MODEL_ID = "mistralai/mistral-small-3-1-24b-instruct-2503";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, max_new_tokens = 900 } = body as {
      prompt: string;
      max_new_tokens?: number;
    };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'prompt' field" },
        { status: 400 }
      );
    }

    const iamToken = await getIAMToken();

    const payload = {
      input: prompt,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens,
        min_new_tokens: 1,
        stop_sequences: [],
        repetition_penalty: 1.05,
      },
      model_id: MODEL_ID,
      project_id: PROJECT_ID,
    };

    const watsonRes = await fetch(WATSONX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${iamToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!watsonRes.ok) {
      const errText = await watsonRes.text();
      // If 401 Unauthorized, invalidate cached token so next request re-fetches
      if (watsonRes.status === 401) tokenCache = null;
      return NextResponse.json(
        { error: `watsonx.ai error (${watsonRes.status}): ${errText}` },
        { status: watsonRes.status }
      );
    }

    const watsonData = await watsonRes.json();
    const generatedText: string =
      watsonData?.results?.[0]?.generated_text ?? "";

    return NextResponse.json({ text: generatedText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/chat] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

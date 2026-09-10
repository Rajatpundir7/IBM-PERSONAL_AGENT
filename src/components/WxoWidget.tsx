"use client";
import Script from "next/script";

/**
 * Watson Orchestrate chat widget loader.
 * Must be a Client Component because <Script onLoad> is a function prop.
 */
export default function WxoWidget() {
  return (
    <>
      {/* 1. Inline config — sets window.wxOConfiguration before loader fires */}
      <Script id="wxo-config" strategy="afterInteractive">{`
        window.wxOConfiguration = {
          orchestrationID: "undefined",
          hostURL: "https://eu-de.watson-orchestrate.cloud.ibm.com",
          rootElementID: "root",
          deploymentPlatform: "ibmcloud",
          crn: "crn:v1:bluemix:public:watsonx-orchestrate:eu-de:a/f7a6287395e74d61882155ee42cac51b:809423ab-2347-4801-8b4b-a49f50f5e428::",
          chatOptions: {
            agentId: "8fde986c-e1a2-46d5-a4bc-949d6af6b4ce"
          }
        };
      `}</Script>

      {/* 2. External loader — initialised after load */}
      <Script
        id="wxo-loader"
        strategy="lazyOnload"
        src="https://eu-de.watson-orchestrate.cloud.ibm.com/wxochat/wxoLoader.js?embed=true"
        onLoad={() => {
          const w = window as Window & { wxoLoader?: { init: () => void } };
          w.wxoLoader?.init();
        }}
      />
    </>
  );
}

# 🚀 LearnMate AI — Desi SDE Pathway Orchestrator

> **Problem Statement #12 · Agentic AI for Personalized Course Pathways**  
> Built with IBM watsonx.ai (Mistral 24B) · Next.js 14 · Desi Cyberpunk 🤖🇮🇳

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ibmpersonagent--gamma.vercel.app-black?style=for-the-badge&logo=vercel)](https://ibmpersonagent-gamma.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-IBM--PERSONAL__AGENT-181717?style=for-the-badge&logo=github)](https://github.com/Rajatpundir7/IBM-PERSONAL_AGENT)
[![Powered by watsonx.ai](https://img.shields.io/badge/Powered%20by-IBM%20watsonx.ai-0F62FE?style=for-the-badge&logo=ibm)](https://eu-gb.ml.cloud.ibm.com)

---

## 🎯 What is LearnMate AI?

LearnMate AI is a **fully agentic, personalized learning pathway orchestrator** for aspiring software engineers. It combines:

- 🎓 **Jeetu Bhaiya–style coaching** — disciplined, motivational Kota energy
- 💡 **Rancho's first-principles thinking** — deep conceptual clarity over rote learning  
- 😎 **Gaitonde's interview swagger** — MNC-ready system design and negotiation tactics
- 😅 **Babu Rao's chaos debugging** — remediation nodes, jugaad, and budget cloud tips

The AI mentor speaks **Hinglish**, understands your skill level, and adapts the roadmap in real-time via **IBM watsonx.ai (Mistral Small 3.1 24B Instruct)**.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🧙 **Desi Diagnostic Wizard** | 3-step intake: target role → 3 graded MCQs → weekly commitment slider |
| 🗺️ **Adaptive Meme Roadmap** | 3-phase timeline (Foundations → SDE-1 → Scale) with live AI node injection |
| 💬 **watsonx Chat Drawer** | Sliding chat with Jeetu / Rancho / Gaitonde personas, full conversation context |
| 🤖 **Watson Orchestrate Widget** | Embedded IBM Watson Orchestrate chat widget (eu-de region) |
| 🔐 **Secure Backend Proxy** | IAM token caching (55 min) — API key never exposed to client |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ DesiWizard   │  │ MemeRoadmap  │  │  ChatDrawer   │  │
│  │ (Intake)     │  │ (Timeline)   │  │  (AI Mentor)  │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         └─────────────────┴──────────────────┘           │
│                           │ POST /api/chat               │
└───────────────────────────┼─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│              Next.js API Route (Server-side)             │
│                    /app/api/chat/route.ts                │
│  ┌─────────────────────────────────────────────────┐     │
│  │  IAM Token Cache (55-min window, auto-refresh)  │     │
│  │  Key sanitisation (strips ; and whitespace)     │     │
│  │  401 auto-invalidation                          │     │
│  └──────────────────┬──────────────────────────────┘     │
└─────────────────────┼───────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
┌────────▼────────┐     ┌──────────▼──────────────────┐
│  IBM IAM Cloud  │     │  IBM watsonx.ai (eu-gb)       │
│  Token endpoint │     │  Mistral Small 3.1 24B        │
│  iam.cloud.ibm  │     │  Project: bd20be8b-...        │
└─────────────────┘     └─────────────────────────────-─┘
```
![Uploading img_1789123405265.png…]()

**Key design decisions:**
- The IBM API key is **never sent to the browser** — all inference calls go through the Next.js API route
- IAM tokens are **cached server-side** for 55 minutes to avoid rate limits
- A `401` response auto-invalidates the cache and forces a fresh token

---

## 🎨 Design System — Desi Cyberpunk

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0B0F19` | Page background |
| `surface` | `#111827` | Cards, drawers |
| `saffron` | `#FF9933` | Primary accent, CTAs |
| `green` | `#00FF66` | Success, active states |
| `ibm` | `#0F62FE` | IBM Blue, Phase 2 |
| `border` | `#1E2A3D` | Sharp 4px industrial cards |

---

## 🧑‍💻 Character Coaches

### 🎓 Jeetu Bhaiya (Kota Coach)
> *"Tum log samjhe? Consistency is key bhai. DSA phodenge!"*

Handles: Career intake, study consistency, foundational DSA motivation.

### 💡 Rancho (Phunsukh Wangdu)
> *"Simple hai yaar! Machine ko samjhao, marks khud aa jayenge!"*

Handles: First-principles thinking, LLD, distributed systems deep dives.

### 😎 Gaitonde (Sacred Games)
> *"Kabhi kabhi lagta hai apun hi SDE-3 hai is duniya mein."*

Handles: MNC interview prep, system design, offer negotiation, capstone reviews.

### 😅 Babu Rao Ganpatrao Apte (Hera Pheri)
> *"Ek kaam kar. Pehle bata — kitna time dega?"*

Handles: Debugging, emergency remediation sessions, jugaad Cloud Lite tips.

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 20+
- IBM Cloud account with watsonx.ai access
- IBM Cloud API Key (from [cloud.ibm.com/iam/apikeys](https://cloud.ibm.com/iam/apikeys))

### 1. Clone & Install
```bash
git clone https://github.com/Rajatpundir7/IBM-PERSONAL_AGENT.git
cd IBM-PERSONAL_AGENT/learnmate-ai   # or cd learnmate-ai if already inside
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
IBM_WATSONX_API_KEY=<your_ibm_cloud_api_key>
IBM_PROJECT_ID=bd20be8b-bbee-4a91-a1c7-4aaf7f995879
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🌐 Deployment

### Option A — Vercel (Recommended, one command)
```bash
npm i -g vercel
vercel --prod
# Set env vars when prompted:
#   IBM_WATSONX_API_KEY = <your key>
#   IBM_PROJECT_ID      = bd20be8b-bbee-4a91-a1c7-4aaf7f995879
```

Or connect the GitHub repo to Vercel dashboard and set env vars there.

### Option B — Render (Docker)
```bash
# Push to GitHub, then connect repo in Render dashboard
# render.yaml is already configured
# Set IBM_WATSONX_API_KEY in Render environment settings
```

### Option C — Docker (self-hosted)
```bash
docker build -t learnmate-ai .
docker run -p 3000:3000 \
  -e IBM_WATSONX_API_KEY=<your_key> \
  -e IBM_PROJECT_ID=bd20be8b-bbee-4a91-a1c7-4aaf7f995879 \
  learnmate-ai
```

### Option D — One-click script
```bash
chmod +x deploy.sh
./deploy.sh          # Vercel
./deploy.sh --render # Render
```

---

## 📁 Project Structure

```
learnmate-ai/
├── app/
│   ├── layout.tsx              # Root layout + Watson Orchestrate widget
│   ├── page.tsx                # Main app: Hero → Wizard → Roadmap
│   └── api/
│       └── chat/
│           └── route.ts        # ★ watsonx.ai proxy (IAM cache + inference)
├── src/
│   ├── components/
│   │   ├── DesiWizard.tsx      # 3-step diagnostic intake wizard
│   │   ├── MemeRoadmap.tsx     # Adaptive 3-phase roadmap with AI injection
│   │   ├── ChatDrawer.tsx      # Sliding AI mentor chat drawer
│   │   └── WxoWidget.tsx       # Watson Orchestrate loader (client component)
│   └── styles/
│       └── globals.css         # Desi Cyberpunk dark theme
├── .env.example                # Environment template
├── next.config.js              # Next.js config (standalone output)
├── tailwind.config.js          # Custom colour palette
├── vercel.json                 # Vercel v2 deployment config
├── render.yaml                 # Render Blueprint (Docker)
├── Dockerfile                  # Multi-stage Node 20 Alpine
├── Procfile                    # Heroku-compatible
└── deploy.sh                   # One-click Git + GitHub + deploy script
```

---

## 🔌 IBM watsonx.ai API Details

| Parameter | Value |
|-----------|-------|
| **Endpoint** | `https://eu-gb.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29` |
| **Model** | `mistralai/mistral-small-3-1-24b-instruct-2503` |
| **Project ID** | `bd20be8b-bbee-4a91-a1c7-4aaf7f995879` |
| **IAM Endpoint** | `https://iam.cloud.ibm.com/identity/token` |
| **Decoding** | Greedy · max 900 tokens · repetition penalty 1.05 |
| **Token Cache** | 55-minute server-side cache with auto-refresh |

---

## 🤖 Watson Orchestrate Integration

The app embeds the IBM Watson Orchestrate chat widget:

| Config | Value |
|--------|-------|
| **Host** | `eu-de.watson-orchestrate.cloud.ibm.com` |
| **Agent ID** | `8fde986c-e1a2-46d5-a4bc-949d6af6b4ce` |
| **Platform** | IBM Cloud (`ibmcloud`) |
| **Region** | `eu-de` (Frankfurt) |

The widget is loaded as a `"use client"` component ([`WxoWidget.tsx`](src/components/WxoWidget.tsx)) using `next/script` with `afterInteractive` + `lazyOnload` strategies to avoid Server Component serialisation errors.

---

## 🛣️ Roadmap Phases

### Phase 1 🍵 Chai-Samosa Foundations
- Arrays & Strings (two-pointer, sliding window, prefix sum)
- Recursion & Backtracking (memoization, N-Queens)
- Networking & OS Fundamentals (TCP/IP, virtual memory)

### Phase 2 💼 Intern se SDE-1
- Trees & Graphs (BFS/DFS, Dijkstra, Trie, Union-Find)
- Database Design & Indexing (B-Trees, query planner)
- Kafka & Redis Caching (partitions, consumer groups, cache-aside)
- Low-Level Design (SOLID, Factory, Observer, Strategy)

### Phase 3 🚀 Apun Hi Bhagwan Hai — Scale
- High-Level System Design (consistent hashing, CAP theorem, CDN)
- Raft Consensus & Distributed Transactions (2PC, ZooKeeper)
- MNC Interview Capstone (STAR stories, offer negotiation)

---

## 🧪 Adaptive Learning — "Bhai Samajh Nahi Aaya!"

Click the **"Bhai Samajh Nahi Aaya! (Simulate Difficulty)"** button on the roadmap to:
1. Call Mistral 24B with a Babu Rao–persona prompt
2. Get a witty Hinglish explanation of your knowledge gap
3. Automatically inject a **3-day remediation node** ("Babu Rao's Doubt Clearing Session") into Phase 1
4. See recalibrated completion dates

---

## 🔒 Security Notes

- ✅ IBM API key is **server-side only** — never in client bundle
- ✅ IAM tokens are cached and not logged
- ⚠️ Rotate `IBM_WATSONX_API_KEY` before any public deployment
- ⚠️ The key in `.env.example` is a dev key — get your own from [IBM Cloud IAM](https://cloud.ibm.com/iam/apikeys)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS 3, Framer Motion |
| Icons | Lucide React |
| AI Backend | IBM watsonx.ai (Mistral 24B) |
| Auth | IBM IAM token exchange |
| Chat Widget | IBM Watson Orchestrate |
| Deployment | Vercel / Render / Docker |

---

## 📜 License

MIT — DSA phodenge, open source mein contribute karenge! 🚀

---

<p align="center">
  Built with ❤️ and lots of ☕ · Powered by IBM watsonx.ai · <em>Aal iz well!</em>
</p>

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Github, ExternalLink } from "lucide-react";
import DesiWizard, { type WizardResult } from "@/components/DesiWizard";
import MemeRoadmap from "@/components/MemeRoadmap";
import ChatDrawer, { ChatTriggerButton } from "@/components/ChatDrawer";

// ── Meme easter egg quotes cycling in header ───────────────────────────────
const HEADER_QUOTES = [
  "DSA phodenge! 💪",
  "System Design like IRCTC Tatkal scaling 🚂",
  "Babu Rao says: bug nahi, feature hai 😅",
  "Kabhi kabhi lagta hai apun hi SDE-3 hai 😎",
  "Aal iz well… except the merge conflict 🔥",
  "Phunsukh Wangdu approved this architecture 💡",
];

function useRotatingQuote(quotes: string[], interval = 3500) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % quotes.length), interval);
    return () => clearInterval(t);
  }, [quotes, interval]);
  return quotes[idx];
}

// ── Hero / Landing ─────────────────────────────────────────────────────────
function Hero({ onStart }: { onStart: () => void }) {
  const quote = useRotatingQuote(HEADER_QUOTES);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "#FF9933" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "#0F62FE" }}
      />

      <div className="relative z-10 max-w-3xl">
        {/* Badge row */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <span className="badge-saffron">Problem Statement #12</span>
          <span className="badge-ibm">IBM watsonx.ai</span>
          <span className="badge-green">Mistral 24B</span>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl font-black mb-3 leading-tight"
          style={{ color: "#E2E8F0" }}
        >
          Learn<span style={{ color: "#FF9933" }}>Mate</span>{" "}
          <span style={{ color: "#0F62FE" }}>AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl text-[#94A3B8] mb-2 font-medium"
        >
          Desi SDE Pathway Orchestrator
        </motion.p>

        {/* Rotating quote */}
        <AnimatePresence mode="wait">
          <motion.p
            key={quote}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-[#64748B] mb-10 font-mono"
          >
            {quote}
          </motion.p>
        </AnimatePresence>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { emoji: "🎓", text: "Jeetu Bhaiya Coaching" },
            { emoji: "💡", text: "Rancho First-Principles" },
            { emoji: "😎", text: "Gaitonde Interview Prep" },
            { emoji: "😅", text: "Babu Rao Debugging" },
          ].map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#94A3B8]"
              style={{ background: "#161D2F", border: "1px solid #1E2A3D" }}
            >
              <span>{f.emoji}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="btn-saffron text-lg px-10 py-4 shadow-saffron"
        >
          🚀 Start Kota Assessment
        </motion.button>

        <p className="text-xs text-[#64748B] mt-4">
          3 steps · 3 minutes · personalized roadmap taiyaar
        </p>
      </div>
    </div>
  );
}

// ── Header Nav ─────────────────────────────────────────────────────────────
function Header({
  view,
  onViewChange,
  wizardDone,
}: {
  view: "hero" | "wizard" | "roadmap";
  onViewChange: (v: "hero" | "wizard" | "roadmap") => void;
  wizardDone: boolean;
}) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 h-14"
      style={{
        background: "rgba(11,15,25,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1E2A3D",
      }}
    >
      <button
        onClick={() => onViewChange("hero")}
        className="flex items-center gap-2 group"
      >
        <Cpu size={18} className="text-[#FF9933]" />
        <span className="font-black text-sm text-[#E2E8F0] group-hover:text-[#FF9933] transition-colors">
          LearnMate <span className="text-[#0F62FE]">AI</span>
        </span>
      </button>

      <nav className="flex items-center gap-1">
        {view !== "hero" && (
          <>
            <button
              onClick={() => onViewChange("wizard")}
              className={`text-xs px-3 py-1.5 rounded transition-colors ${
                view === "wizard"
                  ? "text-[#FF9933] bg-[rgba(255,153,51,0.1)]"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              Assessment
            </button>
            {wizardDone && (
              <button
                onClick={() => onViewChange("roadmap")}
                className={`text-xs px-3 py-1.5 rounded transition-colors ${
                  view === "roadmap"
                    ? "text-[#FF9933] bg-[rgba(255,153,51,0.1)]"
                    : "text-[#64748B] hover:text-[#94A3B8]"
                }`}
              >
                Roadmap
              </button>
            )}
          </>
        )}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-[#64748B] hover:text-[#E2E8F0] transition-colors"
          aria-label="GitHub"
        >
          <Github size={16} />
        </a>
        <a
          href="https://eu-gb.ml.cloud.ibm.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#64748B] hover:text-[#E2E8F0] transition-colors"
          aria-label="IBM watsonx"
        >
          <ExternalLink size={14} />
        </a>
      </nav>
    </header>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function Home() {
  type View = "hero" | "wizard" | "roadmap";
  const [view, setView] = useState<View>("hero");
  const [wizardResult, setWizardResult] = useState<WizardResult | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  function handleWizardComplete(result: WizardResult) {
    setWizardResult(result);
    setView("roadmap");
  }

  const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  return (
    <>
      {view !== "hero" && (
        <Header
          view={view}
          onViewChange={setView}
          wizardDone={wizardResult !== null}
        />
      )}

      <AnimatePresence mode="wait">
        {view === "hero" && (
          <motion.div
            key="hero"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Hero onStart={() => setView("wizard")} />
          </motion.div>
        )}

        {view === "wizard" && (
          <motion.div
            key="wizard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="min-h-screen pt-24 pb-16 px-4"
          >
            <DesiWizard onComplete={handleWizardComplete} />
          </motion.div>
        )}

        {view === "roadmap" && wizardResult && (
          <motion.div
            key="roadmap"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="min-h-screen pt-24 pb-32 px-4"
          >
            <MemeRoadmap wizardResult={wizardResult} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button — visible after hero */}
      {view !== "hero" && (
        <ChatTriggerButton onClick={() => setChatOpen(true)} />
      )}

      {/* Chat Drawer */}
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

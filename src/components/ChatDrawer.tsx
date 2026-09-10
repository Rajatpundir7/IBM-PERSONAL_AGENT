"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import clsx from "clsx";

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  coach: Coach;
  timestamp: Date;
}

type Coach = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  systemPrompt: string;
};

// ── Coach Personas ─────────────────────────────────────────────────────────
const COACHES: Coach[] = [
  {
    id: "jeetu",
    name: "Jeetu Bhaiya",
    emoji: "🎓",
    color: "#FF9933",
    systemPrompt: `You are Jeetu Bhaiya — the iconic Kota coaching teacher. 
You speak in motivational Hinglish, mixing Hindi and English naturally. 
You are strict but deeply caring. You explain DSA and career concepts with discipline. 
Phrases you use: "Tum log samjhe?", "Baat simple hai", "Consistency is key bhai", "DSA phodenge!".
Keep answers concise, practical, structured. Max 150 words.`,
  },
  {
    id: "rancho",
    name: "Rancho (Phunsukh)",
    emoji: "💡",
    color: "#0F62FE",
    systemPrompt: `You are Rancho (Phunsukh Wangdu) from 3 Idiots.
You explain concepts from first principles with genuine curiosity. 
You challenge rote memorization and encourage deep understanding.
Phrases: "Simple hai yaar!", "Machine ko samjhao, marks khud aa jayenge!", "Why? Not how — WHY?".
Focus on distributed systems, LLD, and conceptual depth. Max 150 words.`,
  },
  {
    id: "gaitonde",
    name: "Gaitonde",
    emoji: "😎",
    color: "#7C3AED",
    systemPrompt: `You are Ganesh Gaitonde from Sacred Games — adapted as an MNC interview coach.
Bold, dramatic, confident. "Kabhi kabhi lagta hai apun hi SDE-3 hai is duniya mein."
You give interview tips, negotiation tactics, and advanced system design with swagger.
Phrases: "Apun bolta hai", "Senior SDE ka kaam hai ye", "Interview loop crack karo".
Max 150 words. High energy.`,
  },
];

// ── Suggested Prompts ──────────────────────────────────────────────────────
const SUGGESTIONS = [
  "Explain consistent hashing in simple terms",
  "How do I crack a FAANG system design round?",
  "Best way to revise Dynamic Programming for interviews",
  "What is the CAP theorem in plain Hindi?",
  "How do I negotiate my SDE-1 offer package?",
];

// ── Single Message Bubble ──────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={clsx("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm border"
        style={
          isUser
            ? { borderColor: "#1E2A3D", background: "#111827" }
            : { borderColor: msg.coach.color + "44", background: msg.coach.color + "15" }
        }
      >
        {isUser ? <User size={14} className="text-[#64748B]" /> : msg.coach.emoji}
      </div>

      {/* Bubble */}
      <div className={clsx("max-w-[80%]", isUser ? "bubble-user" : "bubble-ai", "p-3 rounded text-sm leading-relaxed")}>
        {!isUser && (
          <p
            className="text-xs font-bold mb-1 uppercase tracking-wider"
            style={{ color: msg.coach.color }}
          >
            {msg.coach.name}
          </p>
        )}
        <p className="text-[#E2E8F0] whitespace-pre-wrap">{msg.text}</p>
        <p className="text-[10px] text-[#64748B] mt-1.5 text-right">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

// ── Typing Indicator ───────────────────────────────────────────────────────
function TypingIndicator({ coach }: { coach: Coach }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 mb-4"
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm border flex-shrink-0"
        style={{ borderColor: coach.color + "44", background: coach.color + "15" }}
      >
        {coach.emoji}
      </div>
      <div className="bubble-ai p-3 rounded flex items-center gap-1.5">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: coach.color }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.9, delay }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Coach Selector ─────────────────────────────────────────────────────────
function CoachSelector({
  active,
  onChange,
}: {
  active: Coach;
  onChange: (c: Coach) => void;
}) {
  return (
    <div className="flex gap-2 p-3 border-b border-[#1E2A3D]">
      {COACHES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c)}
          className={clsx(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border transition-all",
            active.id === c.id
              ? "text-[#0B0F19] font-bold"
              : "border-[#1E2A3D] text-[#64748B] hover:border-[#2E3D55]"
          )}
          style={
            active.id === c.id
              ? { background: c.color, borderColor: c.color }
              : {}
          }
        >
          <span>{c.emoji}</span>
          <span className="hidden sm:inline">{c.name}</span>
        </button>
      ))}
    </div>
  );
}

// ── Main ChatDrawer ────────────────────────────────────────────────────────
interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [coach, setCoach] = useState<Coach>(COACHES[0]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "ai",
          text: `${coach.emoji} Jai ho! Main hun ${coach.name}. Kya doubt hai aaj? DSA, System Design, ya career advice — sab batao, bilkul seedha jawab dunga. Chalo shuru karte hain! 🚀`,
          coach,
          timestamp: new Date(),
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
        coach,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      const conversationContext = messages
        .slice(-6)
        .map((m) => `${m.role === "user" ? "User" : m.coach.name}: ${m.text}`)
        .join("\n");

      const prompt = `${coach.systemPrompt}

Previous conversation:
${conversationContext}

User: ${text.trim()}
${coach.name}:`;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, max_new_tokens: 250 }),
        });
        const data = await res.json();
        const aiText: string =
          data.text?.trim() ||
          "Yaar, server thoda busy hai abhi. Thodi der baad try karo!";

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "_ai",
            role: "ai",
            text: aiText,
            coach,
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "_err",
            role: "ai",
            text: "Arre yaar! Network issue lag raha hai. Backend check karo — IBM watsonx.ai se connection timeout ho gaya.",
            coach,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [coach, loading, messages]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleCoachChange(newCoach: Coach) {
    setCoach(newCoach);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + "_switch",
        role: "ai",
        text: `${newCoach.emoji} Ha! ${newCoach.name} aa gaya scene mein. Bol, kya poochna hai?`,
        coach: newCoach,
        timestamp: new Date(),
      },
    ]);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 flex flex-col"
            style={{ background: "#111827", borderLeft: "1px solid #1E2A3D" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2A3D] flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-[#FF9933]" />
                <span className="font-bold text-[#E2E8F0] text-sm">
                  AI Mentor Chat
                </span>
                <span className="badge-green">Powered by watsonx.ai</span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#1E2A3D] transition-colors"
              >
                <X size={16} className="text-[#64748B]" />
              </button>
            </div>

            {/* Coach selector */}
            <CoachSelector active={coach} onChange={handleCoachChange} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <AnimatePresence>
                {loading && <TypingIndicator coach={coach} />}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-xs text-[#64748B] mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-2.5 py-1 rounded border border-[#1E2A3D] text-[#94A3B8] hover:border-[#FF9933] hover:text-[#FF9933] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-[#1E2A3D] flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Apna doubt likho… (Enter to send)"
                  disabled={loading}
                  className="flex-1 bg-[#161D2F] border border-[#1E2A3D] rounded px-3 py-2.5 text-sm text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#FF9933] transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="btn-saffron px-3 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-[#64748B] mt-1.5 text-center">
                Mistral 24B via IBM watsonx.ai · eu-gb region
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Trigger Button (exported separately) ──────────────────────────────────
export function ChatTriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 btn-saffron shadow-saffron"
      title="Open AI Mentor"
    >
      <MessageSquare size={18} />
      <span className="hidden sm:inline font-bold">Ask Mentor</span>
    </motion.button>
  );
}

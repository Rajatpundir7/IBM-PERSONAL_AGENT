"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, MessageSquare, Sparkles, RotateCcw } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn, Button, Badge, ScrollArea, Avatar, AvatarFallback, Separator, Input } from "./ui";

// ── Types ─────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  coachId: string;
  ts: Date;
}

interface Coach {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  bgColor: string;
  systemPrompt: string;
  greeting: string;
}

// ── Coaches ───────────────────────────────────────────────────────────────
const COACHES: Coach[] = [
  {
    id: "mentor",
    name: "Alex",
    title: "AI Learning Mentor",
    avatar: "AL",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    greeting: "Hello! I'm your AI learning mentor. Ask me anything about algorithms, system design, or your career path. I'll give you clear, practical answers.",
    systemPrompt: "You are a senior software engineering mentor with 10+ years at top tech companies. Provide clear, structured, practical advice about algorithms, data structures, system design, and software engineering careers. Be direct and concise. Use examples. Max 150 words per response.",
  },
  {
    id: "dsa",
    name: "Dev",
    title: "DSA Specialist",
    avatar: "DS",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
    greeting: "Hi! I specialise in data structures and algorithms. Share your problem and I'll walk you through the optimal approach, complexity analysis, and edge cases.",
    systemPrompt: "You are a competitive programming expert who has solved 2000+ LeetCode problems. Focus on algorithms, data structures, time/space complexity, optimal approaches, and common patterns. Always explain the 'why' behind the solution. Be systematic. Max 150 words.",
  },
  {
    id: "sysdesign",
    name: "Sam",
    title: "System Design Expert",
    avatar: "SD",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    greeting: "Hey! System design is my expertise. Whether it's scalability, distributed systems, or architecture patterns — let's break it down step by step.",
    systemPrompt: "You are a principal engineer at a top tech company specialising in distributed systems and system design. Explain architectural decisions, trade-offs, scalability patterns, and real-world implementations clearly. Structure your answers logically. Max 150 words.",
  },
];

const SUGGESTED_QUESTIONS = [
  "Explain consistent hashing with a real example",
  "How do I approach a dynamic programming problem?",
  "What is the CAP theorem?",
  "How to prepare for a FAANG system design interview?",
  "Difference between BFS and DFS — when to use each?",
];

// ── Message bubble ────────────────────────────────────────────────────────
function Bubble({ msg, coach }: { msg: Message; coach: Coach }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("flex gap-3 mb-5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className={cn("text-xs font-bold", coach.bgColor, coach.color)}>
            {coach.avatar}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[82%] space-y-1")}>
        {!isUser && (
          <p className={cn("text-xs font-semibold", coach.color)}>{coach.name}</p>
        )}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm ml-auto"
              : "bg-secondary text-secondary-foreground rounded-tl-sm"
          )}
        >
          <p className="whitespace-pre-wrap">{msg.text}</p>
        </div>
        <p className={cn("text-[10px] text-muted-foreground", isUser ? "text-right" : "text-left")}>
          {msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">You</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────
function Typing({ coach }: { coach: Coach }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3 mb-4"
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={cn("text-xs font-bold", coach.bgColor, coach.color)}>
          {coach.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 0.15, 0.3].map((d, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: d }}
          />
        ))}
      </div>
    </motion.div>
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Greet on open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: "g0", role: "ai", coachId: coach.id,
        text: coach.greeting, ts: new Date(),
      }]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", coachId: coach.id, text: text.trim(), ts: new Date() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    const ctx = messages.slice(-6).map((m) => `${m.role === "user" ? "User" : coach.name}: ${m.text}`).join("\n");
    const prompt = `${coach.systemPrompt}\n\nConversation so far:\n${ctx}\n\nUser: ${text.trim()}\n${coach.name}:`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, max_new_tokens: 250 }),
      });
      const data = await res.json();
      setMessages((p) => [...p, {
        id: Date.now() + "_ai", role: "ai", coachId: coach.id,
        text: data.text?.trim() || "I'm having trouble connecting right now. Please try again in a moment.",
        ts: new Date(),
      }]);
    } catch {
      setMessages((p) => [...p, {
        id: Date.now() + "_err", role: "ai", coachId: coach.id,
        text: "Connection error. Please check your network and try again.",
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [coach, loading, messages]);

  function switchCoach(c: Coach) {
    setCoach(c);
    setMessages((p) => [...p, {
      id: Date.now() + "_sw", role: "ai", coachId: c.id,
      text: `Hi! I'm ${c.name}, ${c.title}. How can I help you?`,
      ts: new Date(),
    }]);
  }

  function clearChat() {
    setMessages([{
      id: "g_new", role: "ai", coachId: coach.id,
      text: coach.greeting, ts: new Date(),
    }]);
  }

  const currentCoachForMsg = (msg: Message) => COACHES.find((c) => c.id === msg.coachId) ?? coach;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] flex flex-col",
            "bg-background border-l border-border shadow-2xl",
            "data-[state=open]:animate-slide-in-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
            "focus-visible:outline-none"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Learning Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Powered by IBM watsonx.ai</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearChat} title="Clear chat">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <DialogPrimitive.Close asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Coach switcher */}
          <div className="flex gap-2 px-4 py-3 border-b border-border flex-shrink-0 overflow-x-auto">
            {COACHES.map((c) => (
              <button
                key={c.id}
                onClick={() => coach.id !== c.id && switchCoach(c)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                  coach.id === c.id
                    ? cn("text-foreground bg-secondary border border-border")
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <span className={cn("w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center", c.bgColor, c.color)}>{c.avatar}</span>
                {c.name}
              </button>
            ))}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 pt-4">
            {messages.map((msg) => (
              <Bubble key={msg.id} msg={msg} coach={currentCoachForMsg(msg)} />
            ))}
            <AnimatePresence>{loading && <Typing coach={coach} />}</AnimatePresence>
            <div ref={bottomRef} />
          </ScrollArea>

          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-border flex-shrink-0">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested questions</p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Input */}
          <div className="p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask anything…"
                disabled={loading}
                className="flex-1 bg-secondary border-transparent focus-visible:border-primary/40 focus-visible:bg-background"
              />
              <Button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Mistral Small 3.1 24B · IBM watsonx.ai · eu-gb
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ── Trigger button ─────────────────────────────────────────────────────────
export function ChatTriggerButton({ onClick, unread = false }: { onClick: () => void; unread?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 h-12 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:bg-primary/90 transition-colors"
    >
      <MessageSquare className="w-4 h-4" />
      Ask AI Mentor
      {unread && <span className="w-2 h-2 rounded-full bg-red-400 absolute -top-0.5 -right-0.5" />}
    </motion.button>
  );
}

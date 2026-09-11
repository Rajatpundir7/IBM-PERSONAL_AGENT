"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, Lock, ChevronDown, ChevronUp,
  AlertCircle, RefreshCw, CheckCheck, BookOpen, Layers, Zap
} from "lucide-react";
import { cn, Button, Badge, Card, CardContent, CardHeader, CardTitle, CardDescription, Progress } from "./ui";
import type { WizardResult } from "./DesiWizard";

type NodeStatus = "completed" | "active" | "locked" | "remediation";

interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  topics: string[];
  mentor: string;
  mentorEmoji: string;
  status: NodeStatus;
  isRemediation?: boolean;
  days: number;
  resources?: { label: string; type: "video" | "article" | "practice" }[];
}

interface Phase {
  id: string;
  phase: string;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  nodes: RoadmapNode[];
}

function buildRoadmap(result: WizardResult): Phase[] {
  const speed = result.weeklyHours >= 25 ? 0.65 : result.weeklyHours >= 15 ? 1 : 1.4;
  const isBeginner = result.score === 0;
  const isAdvanced = result.score === 3;

  return [
    {
      id: "p1", phase: "Phase 1", title: "Foundations",
      desc: "Core data structures, algorithms, and computer science fundamentals.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/8",
      borderColor: "border-blue-500/20",
      icon: <BookOpen className="w-4 h-4" />,
      nodes: [
        {
          id: "p1n1", title: "Arrays, Strings & Hashing", subtitle: "Two-pointer, sliding window, prefix sums",
          topics: ["Two-pointer technique", "Sliding window", "Prefix sum arrays", "HashMap patterns", "Binary search variants"],
          mentor: "Core Algorithms", mentorEmoji: "📐",
          status: "completed", days: Math.round(7 * speed),
          resources: [{ label: "NeetCode 150 – Arrays", type: "practice" }, { label: "MIT 6.006 Lecture 1", type: "video" }],
        },
        {
          id: "p1n2", title: "Recursion & Dynamic Programming", subtitle: "Memoisation, tabulation, space optimisation",
          topics: ["Tree recursion", "Memoisation", "Bottom-up DP", "Knapsack variants", "LCS / LIS"],
          mentor: "Core Algorithms", mentorEmoji: "📐",
          status: isAdvanced ? "completed" : "active", days: Math.round(12 * speed),
          resources: [{ label: "DP Patterns – Leetcode", type: "practice" }, { label: "Striver DP Playlist", type: "video" }],
        },
        ...(isBeginner ? [{
          id: "p1n_rem", title: "Foundations Remediation", subtitle: "Big-O, memory model, call stack",
          topics: ["Time complexity", "Space complexity", "Stack vs heap", "Pointer arithmetic"],
          mentor: "Foundations", mentorEmoji: "🔧",
          status: "active" as NodeStatus, isRemediation: true, days: Math.round(4 * speed),
          resources: [{ label: "CS50 Week 0–1", type: "video" as const }],
        }] : []),
        {
          id: "p1n3", title: "Trees, Graphs & BFS/DFS", subtitle: "Traversals, shortest paths, Union-Find, Trie",
          topics: ["BFS & DFS", "Dijkstra", "Bellman-Ford", "Union-Find", "Trie / prefix tree", "Topological sort"],
          mentor: "Core Algorithms", mentorEmoji: "📐",
          status: "locked", days: Math.round(14 * speed),
        },
        {
          id: "p1n4", title: "OS & Networking Fundamentals", subtitle: "Processes, TCP/IP, virtual memory, concurrency",
          topics: ["Processes vs threads", "TCP vs UDP", "HTTP/2 & HTTP/3", "Virtual memory", "Mutex & semaphores"],
          mentor: "Systems", mentorEmoji: "⚙️",
          status: "locked", days: Math.round(8 * speed),
        },
      ],
    },
    {
      id: "p2", phase: "Phase 2", title: "Engineering",
      desc: "Database internals, distributed messaging, low-level design patterns.",
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-500/8",
      borderColor: "border-violet-500/20",
      icon: <Layers className="w-4 h-4" />,
      nodes: [
        {
          id: "p2n1", title: "Database Design & Indexing", subtitle: "B-Trees, query optimisation, transactions",
          topics: ["B-Tree indexes", "Query planner", "ACID properties", "Normalisation", "Sharding strategies"],
          mentor: "Data Engineering", mentorEmoji: "🗄️",
          status: "locked", days: Math.round(10 * speed),
        },
        {
          id: "p2n2", title: "Kafka & Event-Driven Architecture", subtitle: "Partitions, consumer groups, stream processing",
          topics: ["Kafka partitions", "Consumer groups", "Exactly-once semantics", "Schema Registry", "Kafka Streams"],
          mentor: "Distributed Systems", mentorEmoji: "📡",
          status: "locked", days: Math.round(10 * speed),
        },
        {
          id: "p2n3", title: "Redis & Caching Strategies", subtitle: "Cache-aside, write-through, eviction policies",
          topics: ["Cache-aside pattern", "Write-through / write-back", "LRU eviction", "Redis data types", "Rate limiting"],
          mentor: "Infrastructure", mentorEmoji: "⚡",
          status: "locked", days: Math.round(7 * speed),
        },
        {
          id: "p2n4", title: "Low-Level Design (SOLID & Patterns)", subtitle: "SOLID, GoF patterns, object modelling",
          topics: ["SOLID principles", "Factory / Abstract Factory", "Observer pattern", "Strategy pattern", "Repository pattern"],
          mentor: "Software Design", mentorEmoji: "🏗️",
          status: "locked", days: Math.round(10 * speed),
        },
      ],
    },
    {
      id: "p3", phase: "Phase 3", title: "Scale",
      desc: "High-level system design, distributed consensus, and interview mastery.",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/8",
      borderColor: "border-emerald-500/20",
      icon: <Zap className="w-4 h-4" />,
      nodes: [
        {
          id: "p3n1", title: "High-Level System Design", subtitle: "URL shortener → social graph → video streaming",
          topics: ["Consistent hashing", "CAP theorem", "CDN architecture", "Load balancing", "API gateways"],
          mentor: "System Design", mentorEmoji: "🏛️",
          status: "locked", days: Math.round(14 * speed),
          resources: [{ label: "System Design Interview Vol. 1", type: "article" }],
        },
        {
          id: "p3n2", title: "Consensus & Distributed Transactions", subtitle: "Raft, 2PC, distributed locks",
          topics: ["Raft log replication", "Leader election", "2-Phase commit", "Distributed locks (Redlock)", "ZooKeeper"],
          mentor: "Distributed Systems", mentorEmoji: "📡",
          status: "locked", days: Math.round(12 * speed),
        },
        {
          id: "p3n3", title: "Interview Preparation Capstone", subtitle: "Mock loops, behavioural prep, offer negotiation",
          topics: ["STAR method stories", "SDE-2 / L5 rubric", "Mock system design", "Compensation negotiation", "Competing offers"],
          mentor: "Career Strategy", mentorEmoji: "🎯",
          status: "locked", days: Math.round(10 * speed),
        },
      ],
    },
  ];
}

// ── Node card ─────────────────────────────────────────────────────────────
function NodeCard({ node, phaseColor, phaseBg, phaseBorder }: {
  node: RoadmapNode; phaseColor: string; phaseBg: string; phaseBorder: string
}) {
  const [open, setOpen] = useState(false);

  const statusEl =
    node.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
    node.status === "active" ? (
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}>
        <Circle className={cn("w-4 h-4", phaseColor)} />
      </motion.div>
    ) : <Lock className="w-3.5 h-3.5 text-muted-foreground/50" />;

  const typeColor = (t: string) =>
    t === "video" ? "bg-red-500/10 text-red-500" :
    t === "practice" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
    "bg-blue-500/10 text-blue-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-xl border transition-all duration-200",
        node.isRemediation ? "border-amber-500/30 bg-amber-500/5" :
        node.status === "active" ? cn("border-border", phaseBorder, phaseBg) :
        node.status === "completed" ? "border-border bg-card" :
        "border-border/50 bg-card/50 opacity-60"
      )}
    >
      <button
        onClick={() => node.status !== "locked" && setOpen((o) => !o)}
        disabled={node.status === "locked"}
        className="w-full text-left p-4 flex items-start gap-3 focus-visible:outline-none"
      >
        <div className="mt-0.5 flex-shrink-0">{statusEl}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-foreground">{node.title}</span>
            {node.isRemediation && <Badge variant="warning" className="text-[10px]">Remediation</Badge>}
            {node.status === "active" && !node.isRemediation && <Badge variant="success" className="text-[10px]">In Progress</Badge>}
            {node.status === "completed" && <Badge variant="outline" className="text-[10px]">Completed</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{node.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          <span className="text-xs text-muted-foreground font-mono hidden sm:block">{node.days}d</span>
          {node.status !== "locked" && (
            open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && node.status !== "locked" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {node.topics.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">{t}</span>
                  ))}
                </div>
              </div>
              {node.resources && node.resources.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resources</p>
                  <div className="flex flex-wrap gap-1.5">
                    {node.resources.map((r) => (
                      <span key={r.label} className={cn("text-xs px-2 py-0.5 rounded-md font-medium", typeColor(r.type))}>
                        {r.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function MemeRoadmap({ wizardResult }: { wizardResult: WizardResult }) {
  const [phases, setPhases] = useState<Phase[]>(() => buildRoadmap(wizardResult));
  const [loading, setLoading] = useState(false);
  const [remInserted, setRemInserted] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const totalDays = phases.flatMap((p) => p.nodes).reduce((a, n) => a + n.days, 0);
  const completedNodes = phases.flatMap((p) => p.nodes).filter((n) => n.status === "completed").length;
  const totalNodes = phases.flatMap((p) => p.nodes).length;
  const progressPct = Math.round((completedNodes / totalNodes) * 100);

  const handleDifficulty = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a professional software engineering mentor. A student targeting "${wizardResult.role.label}" has hit a knowledge gap in recursion fundamentals. In 2 concise sentences, describe a targeted 3-day remediation plan covering: Big-O analysis, call stack visualisation, and simple recursion drills. Be direct and practical.`,
          max_new_tokens: 150,
        }),
      });
      const data = await res.json();
      setAiNote(data.text?.trim() ?? null);
    } catch {
      setAiNote("Remediation plan: Review Big-O complexity, trace call stacks manually for 5 recursion problems, then complete 10 LeetCode Easy recursion problems with full memoisation.");
    } finally {
      setLoading(false);
    }

    setPhases((prev) => prev.map((ph) => {
      if (ph.id !== "p1") return ph;
      if (ph.nodes.some((n) => n.id === "rem_injected")) return ph;
      const rem: RoadmapNode = {
        id: "rem_injected", title: "Prerequisite Remediation Session",
        subtitle: "3-day targeted gap-fill — AI-generated plan",
        topics: ["Big-O mastery", "Call stack tracing", "Simple recursion drills", "Complexity tables"],
        mentor: "AI Mentor", mentorEmoji: "🤖",
        status: "active", isRemediation: true, days: 3,
      };
      return { ...ph, nodes: [ph.nodes[0], rem, ...ph.nodes.slice(1)] };
    }));
    setRemInserted(true);
  }, [wizardResult.role.label]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="default">{wizardResult.role.icon} {wizardResult.role.label}</Badge>
          <Badge variant="outline">Score {wizardResult.score}/3</Badge>
          <Badge variant="outline">{wizardResult.weeklyHours} hrs/week</Badge>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Your Learning Pathway</h2>
        <p className="text-sm text-muted-foreground">
          Estimated duration: <span className="text-foreground font-medium">{totalDays} days</span> · {totalNodes} modules across 3 phases
        </p>
      </div>

      {/* Overall progress */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm font-semibold text-primary">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{completedNodes} of {totalNodes} modules completed</span>
            <span className="text-xs text-muted-foreground">{totalDays - phases.flatMap(p=>p.nodes).filter(n=>n.status==="completed").reduce((a,n)=>a+n.days,0)} days remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive difficulty banner */}
      <Card className={cn("border-dashed", remInserted ? "border-emerald-500/40" : "border-amber-500/30")}>
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <p className="text-sm font-semibold text-foreground">Adaptive Difficulty Engine</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Simulate a knowledge gap. The AI will analyse your weak areas and inject a targeted remediation module into your roadmap.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDifficulty}
              disabled={loading || remInserted}
              className={cn("flex-shrink-0", remInserted && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400")}
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> :
               remInserted ? <CheckCheck className="w-3.5 h-3.5" /> :
               <Zap className="w-3.5 h-3.5" />}
              {remInserted ? "Remediation Added" : loading ? "Analysing…" : "Simulate Knowledge Gap"}
            </Button>
          </div>

          <AnimatePresence>
            {aiNote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-border"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">AI Mentor Response</p>
                <p className="text-sm text-foreground leading-relaxed">{aiNote}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Phases */}
      {phases.map((phase) => (
        <div key={phase.id}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", phase.bgColor, phase.color)}>
              {phase.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{phase.phase}</Badge>
                <h3 className="text-base font-semibold text-foreground">{phase.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{phase.desc}</p>
            </div>
          </div>

          <div className="ml-4 pl-6 border-l-2 border-border space-y-3">
            {phase.nodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                phaseColor={phase.color}
                phaseBg={phase.bgColor}
                phaseBorder={phase.borderColor}
              />
            ))}
          </div>
        </div>
      ))}

      <Card className="bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Click any unlocked module to expand topics and resources. Your roadmap adapts in real-time via IBM watsonx.ai.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

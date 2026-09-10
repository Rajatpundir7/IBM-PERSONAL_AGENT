"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Plus, RefreshCw, CheckCircle2, Circle, Lock } from "lucide-react";
import clsx from "clsx";
import type { WizardResult } from "./DesiWizard";

// ── Types ──────────────────────────────────────────────────────────────────
type NodeStatus = "completed" | "active" | "locked" | "remediation";

interface RoadmapNode {
  id: string;
  title: string;
  subtitle: string;
  topics: string[];
  coach: string;
  coachEmoji: string;
  status: NodeStatus;
  isRemediation?: boolean;
  daysEstimate: number;
}

interface Phase {
  id: string;
  label: string;
  emoji: string;
  tagline: string;
  color: string;
  nodes: RoadmapNode[];
}

// ── Roadmap factory ────────────────────────────────────────────────────────
function buildRoadmap(result: WizardResult): Phase[] {
  const isAdvanced = result.score === 3;
  const isBeginner = result.score === 0;
  const speed = result.weeklyHours >= 25 ? 0.65 : result.weeklyHours >= 15 ? 1 : 1.4;

  return [
    {
      id: "phase1",
      label: "Phase 1",
      emoji: "🍵",
      tagline: "Chai-Samosa Foundations",
      color: "#FF9933",
      nodes: [
        {
          id: "p1n1",
          title: "Arrays & Strings Bootcamp",
          subtitle: "Sliding window, two-pointer, prefix sums",
          topics: ["Two-pointer", "Sliding Window", "Prefix Sum", "Binary Search"],
          coach: "Jeetu Bhaiya",
          coachEmoji: "🎓",
          status: "completed",
          daysEstimate: Math.round(7 * speed),
        },
        {
          id: "p1n2",
          title: "Recursion & Backtracking",
          subtitle: "Sub-sets, permutations, N-Queens",
          topics: ["Tree Recursion", "Memoization", "Backtracking", "Call Stack"],
          coach: "Rancho",
          coachEmoji: "💡",
          status: isAdvanced ? "completed" : "active",
          daysEstimate: Math.round(10 * speed),
        },
        ...(isBeginner
          ? [
              {
                id: "p1n3_remediation",
                title: "Babu Rao's Basics Capsule",
                subtitle: "Big-O, pointers, memory model",
                topics: ["Time Complexity", "Space Complexity", "Pointers", "Stack vs Heap"],
                coach: "Babu Rao",
                coachEmoji: "😅",
                status: "active" as NodeStatus,
                isRemediation: true,
                daysEstimate: Math.round(5 * speed),
              },
            ]
          : []),
        {
          id: "p1n4",
          title: "Networking & OS Fundamentals",
          subtitle: "TCP/IP, virtual memory, processes",
          topics: ["TCP vs UDP", "HTTP/2", "Virtual Memory", "Threads vs Processes"],
          coach: "Rancho",
          coachEmoji: "💡",
          status: "locked",
          daysEstimate: Math.round(8 * speed),
        },
      ],
    },
    {
      id: "phase2",
      label: "Phase 2",
      emoji: "💼",
      tagline: "Intern se SDE-1",
      color: "#0F62FE",
      nodes: [
        {
          id: "p2n1",
          title: "Trees & Graphs Masterclass",
          subtitle: "BFS/DFS, Dijkstra, Union-Find, Trie",
          topics: ["BFS/DFS", "Dijkstra", "Bellman-Ford", "Union-Find", "Trie"],
          coach: "Rancho",
          coachEmoji: "💡",
          status: "locked",
          daysEstimate: Math.round(14 * speed),
        },
        {
          id: "p2n2",
          title: "Database Design & Indexing",
          subtitle: "B-Trees, query optimization, sharding basics",
          topics: ["B-Tree Index", "Query Planner", "Normalization", "Sharding 101"],
          coach: "Chatur",
          coachEmoji: "📊",
          status: "locked",
          daysEstimate: Math.round(10 * speed),
        },
        {
          id: "p2n3",
          title: "Kafka & Redis Caching",
          subtitle: "Event streaming, pub/sub, cache eviction",
          topics: ["Kafka Partitions", "Consumer Groups", "Redis TTL", "Cache Aside Pattern"],
          coach: "Gaitonde",
          coachEmoji: "😎",
          status: "locked",
          daysEstimate: Math.round(12 * speed),
        },
        {
          id: "p2n4",
          title: "Low-Level Design (LLD) Sprint",
          subtitle: "SOLID, design patterns, object modelling",
          topics: ["SOLID", "Factory", "Observer", "Strategy", "OOP Pillars"],
          coach: "Rancho",
          coachEmoji: "💡",
          status: "locked",
          daysEstimate: Math.round(10 * speed),
        },
      ],
    },
    {
      id: "phase3",
      label: "Phase 3",
      emoji: "🚀",
      tagline: "Apun Hi Bhagwan Hai — Scale",
      color: "#00FF66",
      nodes: [
        {
          id: "p3n1",
          title: "High-Level System Design",
          subtitle: "URL shortener → Twitter → WhatsApp",
          topics: ["Consistent Hashing", "CAP Theorem", "CDN", "Load Balancing"],
          coach: "Gaitonde",
          coachEmoji: "😎",
          status: "locked",
          daysEstimate: Math.round(14 * speed),
        },
        {
          id: "p3n2",
          title: "Raft Consensus & Distributed Txns",
          subtitle: "Leader election, 2PC, distributed locks",
          topics: ["Raft Log", "2-Phase Commit", "Paxos concepts", "ZooKeeper"],
          coach: "Rancho",
          coachEmoji: "💡",
          status: "locked",
          daysEstimate: Math.round(12 * speed),
        },
        {
          id: "p3n3",
          title: "MNC Interview Capstone",
          subtitle: "Mock loops, system design reviews, HR mastery",
          topics: ["STAR Stories", "L5/SDE-2 Rubric", "Offer Negotiation", "Post-Offer Checklist"],
          coach: "Gaitonde",
          coachEmoji: "😎",
          status: "locked",
          daysEstimate: Math.round(10 * speed),
        },
      ],
    },
  ];
}

// ── Node Card ──────────────────────────────────────────────────────────────
function NodeCard({
  node,
  phaseColor,
  index,
}: {
  node: RoadmapNode;
  phaseColor: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const statusIcon =
    node.status === "completed" ? (
      <CheckCircle2 size={16} className="text-[#00FF66]" />
    ) : node.status === "active" ? (
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        <Circle size={16} style={{ color: phaseColor }} />
      </motion.div>
    ) : (
      <Lock size={14} className="text-[#64748B]" />
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={clsx(
        "card cursor-pointer select-none transition-all duration-200",
        node.isRemediation &&
          "border-yellow-600/40 bg-[rgba(234,179,8,0.04)]",
        node.status === "active" && "border-opacity-60",
        node.status === "locked" && "opacity-50"
      )}
      style={
        node.status === "active"
          ? { borderColor: phaseColor + "66" }
          : undefined
      }
      onClick={() => node.status !== "locked" && setOpen((o) => !o)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{statusIcon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-[#E2E8F0]">
              {node.title}
            </span>
            {node.isRemediation && (
              <span className="badge-saffron">Remediation</span>
            )}
            {node.status === "active" && (
              <span className="badge-green">In Progress</span>
            )}
          </div>
          <p className="text-xs text-[#64748B]">{node.subtitle}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#64748B] flex-shrink-0">
          <span>{node.coachEmoji}</span>
          <span className="hidden sm:inline">{node.coach}</span>
          <span className="ml-2 font-mono" style={{ color: phaseColor + "CC" }}>
            {node.daysEstimate}d
          </span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-[#1E2A3D]">
              <p className="text-xs text-[#64748B] mb-2 font-semibold uppercase tracking-wider">
                Topics covered
              </p>
              <div className="flex flex-wrap gap-2">
                {node.topics.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-[#111827] border border-[#1E2A3D] text-[#94A3B8]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Phase Block ────────────────────────────────────────────────────────────
function PhaseBlock({ phase }: { phase: Phase }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{phase.emoji}</span>
        <div>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: phase.color }}
          >
            {phase.label}
          </span>
          <h3 className="text-lg font-bold text-[#E2E8F0]">
            {phase.tagline}
          </h3>
        </div>
      </div>

      {/* vertical connector + nodes */}
      <div className="ml-3 pl-6 border-l-2" style={{ borderColor: phase.color + "40" }}>
        <div className="space-y-3">
          {phase.nodes.map((node, i) => (
            <NodeCard
              key={node.id}
              node={node}
              phaseColor={phase.color}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Difficulty Simulation ──────────────────────────────────────────────────
function RemediationBanner({
  loading,
  inserted,
  onClick,
}: {
  loading: boolean;
  inserted: boolean;
  onClick: () => void;
}) {
  return (
    <div className="card border-yellow-600/30 bg-[rgba(234,179,8,0.04)] flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
      <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#E2E8F0]">
          Simulate a Knowledge Gap
        </p>
        <p className="text-xs text-[#64748B] mt-0.5">
          Babu Rao will inject a 3-day prerequisite remediation node and recalibrate your timeline via Mistral 24B.
        </p>
      </div>
      <button
        onClick={onClick}
        disabled={loading || inserted}
        className={clsx(
          "btn-outline flex items-center gap-2 flex-shrink-0 text-sm",
          inserted && "border-[#00FF66] text-[#00FF66]",
          loading && "opacity-60 cursor-not-allowed"
        )}
      >
        {loading ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : inserted ? (
          <CheckCircle2 size={14} />
        ) : (
          <Plus size={14} />
        )}
        {inserted
          ? "Node Injected!"
          : loading
          ? "Calling Mistral…"
          : "Bhai Samajh Nahi Aaya! (Simulate Difficulty)"}
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
interface MemeRoadmapProps {
  wizardResult: WizardResult;
}

export default function MemeRoadmap({ wizardResult }: MemeRoadmapProps) {
  const [phases, setPhases] = useState<Phase[]>(() =>
    buildRoadmap(wizardResult)
  );
  const [loading, setLoading] = useState(false);
  const [remediationInserted, setRemediationInserted] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const totalDays = phases.flatMap((p) => p.nodes).reduce(
    (acc, n) => acc + n.daysEstimate,
    0
  );

  const handleDifficulty = useCallback(async () => {
    setLoading(true);
    setAiNote(null);
    try {
      const prompt = `You are Babu Rao, a quirky but helpful tech mentor from Hera Pheri. 
A student is learning "${wizardResult.role.label}" and hit a knowledge gap in Phase 1 recursion topics.
In 2-3 sentences of witty Hinglish, explain what 3-day prerequisite remediation plan you are injecting into their roadmap (cover: Big-O analysis, Call Stack visualisation, and simple recursion drills). 
End with an encouraging one-liner.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, max_new_tokens: 200 }),
      });
      const data = await res.json();
      setAiNote(data.text ?? null);
    } catch {
      setAiNote("Babu Rao abhi busy hai… but remediation node inject ho gaya!");
    } finally {
      setLoading(false);
    }

    // Inject remediation node into Phase 1
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== "phase1") return phase;
        const already = phase.nodes.find((n) => n.id === "remediation_injected");
        if (already) return phase;
        const newNode: RoadmapNode = {
          id: "remediation_injected",
          title: "Babu Rao's Doubt Clearing Session",
          subtitle: "Emergency 3-day prerequisite capsule — injected by AI",
          topics: ["Big-O Drills", "Call Stack Viz", "Simple Recursion", "Complexity Tables"],
          coach: "Babu Rao",
          coachEmoji: "😅",
          status: "active",
          isRemediation: true,
          daysEstimate: 3,
        };
        const insertAt = 1; // after first node
        return {
          ...phase,
          nodes: [
            ...phase.nodes.slice(0, insertAt),
            newNode,
            ...phase.nodes.slice(insertAt),
          ],
        };
      })
    );
    setRemediationInserted(true);
  }, [wizardResult.role.label]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-2">
        <span className="badge-ibm">Adaptive Roadmap</span>
      </div>
      <h2 className="text-2xl font-bold text-[#E2E8F0] mb-1">
        Your Desi SDE Pathway
      </h2>
      <p className="text-sm text-[#64748B] mb-6">
        Role:{" "}
        <span className="text-[#FF9933] font-medium">
          {wizardResult.role.emoji} {wizardResult.role.label}
        </span>{" "}
        · Score:{" "}
        <span className="text-[#E2E8F0] font-medium">{wizardResult.score}/3</span>{" "}
        · Commitment:{" "}
        <span className="text-[#E2E8F0] font-medium">
          {wizardResult.weeklyHours} hrs/week
        </span>{" "}
        · Est. total:{" "}
        <span className="text-[#00FF66] font-semibold">{totalDays} days</span>
      </p>

      {/* Simulate difficulty banner */}
      <RemediationBanner
        loading={loading}
        inserted={remediationInserted}
        onClick={handleDifficulty}
      />

      {/* AI note from Babu Rao */}
      <AnimatePresence>
        {aiNote && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card border-yellow-600/30 bg-[rgba(234,179,8,0.05)] mb-8"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">😅</span>
              <div>
                <p className="text-xs font-bold text-yellow-500 mb-1 uppercase tracking-wider">
                  Babu Rao says:
                </p>
                <p className="text-sm text-[#94A3B8] italic leading-relaxed">
                  {aiNote}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phases */}
      {phases.map((phase) => (
        <PhaseBlock key={phase.id} phase={phase} />
      ))}

      {/* Footer note */}
      <div className="card border-[#1E2A3D] bg-[#111827]">
        <p className="text-xs text-[#64748B] leading-relaxed">
          💡 <span className="text-[#E2E8F0] font-medium">Click any unlocked node</span> to expand topics. 
          Roadmap adapts in real-time via IBM watsonx.ai (Mistral 24B). 
          <span className="text-[#FF9933]"> Consistency &gt; Intensity.</span>
        </p>
      </div>
    </div>
  );
}

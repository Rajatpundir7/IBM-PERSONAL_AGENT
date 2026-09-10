"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Zap } from "lucide-react";
import clsx from "clsx";

// ── Types ──────────────────────────────────────────────────────────────────
export type Role = {
  id: string;
  label: string;
  emoji: string;
  desc: string;
};

export type DiagnosticQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type WizardResult = {
  role: Role;
  score: number; // 0-3
  weeklyHours: number;
};

// ── Data ───────────────────────────────────────────────────────────────────
const ROLES: Role[] = [
  {
    id: "faang",
    label: "Tier-1 MNC SDE (FAANG/MAANG)",
    emoji: "🏆",
    desc: "Amazon, Google, Meta ka sapna. DSA grind + System Design.",
  },
  {
    id: "distributed",
    label: "Tatkal-scale Distributed Systems Engineer",
    emoji: "🚂",
    desc: "Build systems that survive IRCTC booking rushes. Kafka, Raft, Paxos.",
  },
  {
    id: "aiml",
    label: "AI/ML Engineer with Desi Jugaad",
    emoji: "🤖",
    desc: "LLMs, fine-tuning, watsonx.ai — jugaad meets gradient descent.",
  },
  {
    id: "startup",
    label: "Startup SDE (Move Fast, Break Prod)",
    emoji: "🔥",
    desc: "Zero to prod in 2 sprints. Full-stack, microservices, vibes.",
  },
];

const QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "q1",
    question:
      "Jeetu Bhaiya is asking: What is the time complexity of finding the k-th largest element using a min-heap of size k?",
    options: ["O(n)", "O(n log k)", "O(k log n)", "O(n log n)"],
    correct: 1,
    explanation:
      "O(n log k) — har element ke liye heap push/pop O(log k). Classic FAANG question, bhai!",
  },
  {
    id: "q2",
    question:
      'Rancho challenges you: In a distributed system, what does "exactly-once" delivery semantics require?',
    options: [
      "Just at-least-once + fast network",
      "Idempotent consumers + deduplication at broker",
      "Only at-most-once with ACK",
      "TCP guarantees it automatically",
    ],
    correct: 1,
    explanation:
      "Idempotent producers + consumer-side deduplication — Kafka does this with producer IDs. Exactly-once is NOT free!",
  },
  {
    id: "q3",
    question:
      'Chatur tests your memory: Which algorithm guarantees O(1) amortized insertion for a dynamic array (like C++ vector)?',
    options: [
      "Linear growth (add 1 slot)",
      "Fibonacci growth",
      "Doubling (geometric growth)",
      "Prime-number growth",
    ],
    correct: 2,
    explanation:
      "Doubling (2x) ensures amortized O(1). Chatur ratta maar sakta hai but ye concept samajhna zaroori hai!",
  },
];

const HOURS_MAP: Record<number, string> = {
  5:  "🍜 Maggi Developer (5 hrs/week)",
  10: "☕ Chai-Break Coder (10 hrs/week)",
  15: "💻 Office Hours Grinder (15 hrs/week)",
  20: "🌙 Night-Owl SDE (20 hrs/week)",
  25: "💪 Weekend Warrior (25 hrs/week)",
  30: "🔥 Pre-Placement Panic (30 hrs/week)",
  35: "🏫 Kota Hostel Grind (35 hrs/week)",
};

// ── Sub-components ─────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={clsx(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300",
              i < current
                ? "bg-[#FF9933] border-[#FF9933] text-[#0B0F19]"
                : i === current
                ? "bg-transparent border-[#FF9933] text-[#FF9933]"
                : "bg-transparent border-[#1E2A3D] text-[#64748B]"
            )}
          >
            {i < current ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={clsx(
                "flex-1 h-px transition-all duration-500",
                i < current ? "bg-[#FF9933]" : "bg-[#1E2A3D]"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function CharacterQuote({
  character,
  quote,
}: {
  character: string;
  quote: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded bg-[#111827] border border-[#1E2A3D] mb-6">
      <span className="text-2xl flex-shrink-0">{character}</span>
      <p className="text-sm text-[#94A3B8] italic leading-relaxed">{quote}</p>
    </div>
  );
}

// ── Step 1: Role Selection ─────────────────────────────────────────────────
function RoleStep({
  selected,
  onSelect,
}: {
  selected: Role | null;
  onSelect: (r: Role) => void;
}) {
  return (
    <div>
      <CharacterQuote
        character="🎓"
        quote="Jeetu Bhaiya: 'Pehle decide karo — kahan jaana hai. Bina target ke koi IIT nahi pahuncha.' Apna role chuno, phir roadmap banayenge!"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role)}
            className={clsx(
              "text-left p-4 rounded border transition-all duration-200 cursor-pointer",
              selected?.id === role.id
                ? "border-[#FF9933] bg-[rgba(255,153,51,0.08)]"
                : "border-[#1E2A3D] bg-[#111827] hover:border-[#2E3D55]"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{role.emoji}</span>
              <span
                className={clsx(
                  "font-semibold text-sm",
                  selected?.id === role.id ? "text-[#FF9933]" : "text-[#E2E8F0]"
                )}
              >
                {role.label}
              </span>
            </div>
            <p className="text-xs text-[#64748B]">{role.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: Diagnostic Quiz ────────────────────────────────────────────────
function DiagnosticStep({
  answers,
  onAnswer,
  revealed,
}: {
  answers: Record<string, number>;
  onAnswer: (qId: string, idx: number) => void;
  revealed: boolean;
}) {
  return (
    <div>
      <CharacterQuote
        character="📚"
        quote="Jeetu Bhaiya: 'Teen sawal, teen chance. Galat answer pe rona mat — ye diagnostic hai, judgment nahi. Dil se jawab do!'"
      />
      <div className="space-y-6">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id} className="card">
            <p className="text-sm font-semibold text-[#E2E8F0] mb-3">
              <span className="badge-saffron mr-2">Q{qi + 1}</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[q.id] === oi;
                const correct = oi === q.correct;
                let cls =
                  "w-full text-left p-3 rounded border text-sm transition-all duration-150 cursor-pointer ";
                if (!revealed) {
                  cls += chosen
                    ? "border-[#FF9933] bg-[rgba(255,153,51,0.1)] text-[#FF9933]"
                    : "border-[#1E2A3D] bg-[#111827] text-[#94A3B8] hover:border-[#2E3D55]";
                } else {
                  if (correct)
                    cls +=
                      "border-[#00FF66] bg-[rgba(0,255,102,0.08)] text-[#00FF66]";
                  else if (chosen && !correct)
                    cls +=
                      "border-red-500 bg-[rgba(239,68,68,0.08)] text-red-400";
                  else
                    cls += "border-[#1E2A3D] bg-[#111827] text-[#64748B]";
                }
                return (
                  <button
                    key={oi}
                    className={cls}
                    onClick={() => !revealed && onAnswer(q.id, oi)}
                    disabled={revealed}
                  >
                    <span className="font-mono mr-2 text-xs opacity-60">
                      {String.fromCharCode(65 + oi)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <p className="text-xs text-[#64748B] mt-3 italic border-t border-[#1E2A3D] pt-3">
                💡 {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 3: Hours Slider ───────────────────────────────────────────────────
function HoursStep({
  hours,
  onChange,
}: {
  hours: number;
  onChange: (h: number) => void;
}) {
  return (
    <div>
      <CharacterQuote
        character="⏱️"
        quote="Babu Rao: 'Ek kaam kar. Pehle bata — kitna time dega? Uske hisaab se plan banayenge. Bhai, shortcuts nahi chalte yahan!'"
      />
      <div className="card">
        <div className="text-center mb-6">
          <p className="text-3xl font-bold text-[#FF9933]">{hours}</p>
          <p className="text-sm text-[#64748B]">hours per week</p>
        </div>
        <p className="text-sm text-center text-[#94A3B8] mb-6 font-medium">
          {HOURS_MAP[hours] ?? `${hours} hrs/week`}
        </p>
        <input
          type="range"
          min={5}
          max={35}
          step={5}
          value={hours}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[#FF9933] cursor-pointer"
        />
        <div className="flex justify-between text-xs text-[#64748B] mt-2">
          <span>5 hrs</span>
          <span>35 hrs</span>
        </div>
        <div className="mt-6 p-3 rounded bg-[#111827] border border-[#1E2A3D]">
          <p className="text-xs text-[#64748B]">
            Estimated completion for a full roadmap at{" "}
            <span className="text-[#FF9933] font-semibold">{hours} hrs/week</span>:{" "}
            <span className="text-[#E2E8F0] font-semibold">
              {hours <= 10
                ? "~28 weeks"
                : hours <= 20
                ? "~16 weeks"
                : hours <= 30
                ? "~10 weeks"
                : "~7 weeks"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Wizard ────────────────────────────────────────────────────────────
interface DesiWizardProps {
  onComplete: (result: WizardResult) => void;
}

export default function DesiWizard({ onComplete }: DesiWizardProps) {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [hours, setHours] = useState(15);
  const [direction, setDirection] = useState(1);

  const STEPS = ["Choose Role", "Kota Diagnostic", "Weekly Commitment"];

  function handleAnswer(qId: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  }

  function revealAndScore() {
    setRevealed(true);
  }

  const allAnswered = QUESTIONS.every((q) => q.id in answers);
  const score = QUESTIONS.filter(
    (q) => answers[q.id] === q.correct
  ).length;

  function next() {
    if (step === 1 && !revealed) {
      revealAndScore();
      return;
    }
    setDirection(1);
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else {
      if (selectedRole) {
        onComplete({ role: selectedRole, score, weeklyHours: hours });
      }
    }
  }

  function back() {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    if (step === 2) setRevealed(false);
  }

  const canNext =
    (step === 0 && selectedRole !== null) ||
    (step === 1 && (allAnswered || revealed)) ||
    step === 2;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-2">
        <span className="badge-saffron">Diagnostic Wizard</span>
      </div>
      <h2 className="text-2xl font-bold text-[#E2E8F0] mb-1">
        Kota Skill Assessment
      </h2>
      <p className="text-sm text-[#64748B] mb-6">
        3 steps — 3 minutes — personalized roadmap ready ho jayega.
      </p>

      <StepIndicator current={step} total={STEPS.length} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {step === 0 && (
            <RoleStep selected={selectedRole} onSelect={setSelectedRole} />
          )}
          {step === 1 && (
            <DiagnosticStep
              answers={answers}
              onAnswer={handleAnswer}
              revealed={revealed}
            />
          )}
          {step === 2 && (
            <HoursStep hours={hours} onChange={setHours} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Score reveal after quiz */}
      {step === 1 && revealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded border border-[#1E2A3D] bg-[#111827] flex items-center gap-4"
        >
          <Zap size={20} className="text-[#FF9933] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#E2E8F0]">
              Score: {score}/{QUESTIONS.length}
            </p>
            <p className="text-xs text-[#64748B]">
              {score === 3
                ? "🏆 Perfect! Rancho level hai tu! Advanced track unlocked."
                : score === 2
                ? "💪 Solid! Kuch gaps hain — foundation track added."
                : "📖 Beginner track se shuru karenge. Tension mat le!"}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={back}
          disabled={step === 0}
          className="btn-outline flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={next}
          disabled={!canNext}
          className="btn-saffron flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === STEPS.length - 1
            ? "Generate Roadmap 🚀"
            : step === 1 && !revealed
            ? "Check Answers"
            : "Next"}
          {step < STEPS.length - 1 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Zap, Target, Clock } from "lucide-react";
import { cn, Button, Badge, Card, CardContent, Progress } from "./ui";

export type Role = { id: string; label: string; icon: string; desc: string; level: string };
export type WizardResult = { role: Role; score: number; weeklyHours: number };

const ROLES: Role[] = [
  { id: "faang", label: "FAANG / MAANG Engineer", icon: "🏆", desc: "Google, Meta, Amazon — elite algorithms and system design at scale.", level: "Advanced" },
  { id: "distributed", label: "Distributed Systems Engineer", icon: "⚙️", desc: "Kafka, Raft, Paxos — build systems that handle millions of requests.", level: "Advanced" },
  { id: "aiml", label: "AI / ML Engineer", icon: "🤖", desc: "LLMs, fine-tuning, watsonx.ai — bridge between research and production.", level: "Intermediate" },
  { id: "startup", label: "Full-Stack SDE (Startup)", icon: "🚀", desc: "Ship fast, iterate faster. Full-stack, microservices, product thinking.", level: "Intermediate" },
];

const QUESTIONS = [
  {
    id: "q1",
    question: "What is the time complexity of finding the k-th largest element using a min-heap of size k?",
    options: ["O(n)", "O(n log k)", "O(k log n)", "O(n log n)"],
    correct: 1,
    explanation: "For each of the n elements, we perform a heap push/pop which is O(log k). Total: O(n log k).",
  },
  {
    id: "q2",
    question: "In distributed systems, what does 'exactly-once' delivery semantics require?",
    options: [
      "At-least-once delivery with fast network",
      "Idempotent consumers and deduplication at the broker",
      "At-most-once with acknowledgments",
      "TCP handles it automatically",
    ],
    correct: 1,
    explanation: "Exactly-once requires idempotent producers plus consumer-side deduplication — Kafka achieves this with producer transaction IDs.",
  },
  {
    id: "q3",
    question: "Which growth strategy guarantees O(1) amortised insertion for a dynamic array?",
    options: ["Linear growth (+1 slot)", "Fibonacci growth", "Doubling (2× capacity)", "Prime-number growth"],
    correct: 2,
    explanation: "Doubling capacity ensures that each element is copied at most once on average, giving amortised O(1) per insert.",
  },
];

const HOURS_LABELS: Record<number, { label: string; emoji: string }> = {
  5:  { label: "Casual learner",    emoji: "☕" },
  10: { label: "Part-time focus",   emoji: "📚" },
  15: { label: "Consistent grind",  emoji: "💻" },
  20: { label: "Dedicated learner", emoji: "🌙" },
  25: { label: "Weekend warrior",   emoji: "💪" },
  30: { label: "Pre-offer sprint",  emoji: "🔥" },
  35: { label: "Full immersion",    emoji: "🏋️" },
};

function estimateWeeks(hours: number) {
  if (hours <= 10) return "26–30 weeks";
  if (hours <= 20) return "14–18 weeks";
  if (hours <= 30) return "9–12 weeks";
  return "6–8 weeks";
}

// ── Step indicator ────────────────────────────────────────────────────────
function Stepper({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {labels.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-1.5 min-w-0">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300",
                i < current
                  ? "bg-primary border-primary text-primary-foreground"
                  : i === current
                  ? "bg-background border-primary text-primary"
                  : "bg-background border-border text-muted-foreground"
              )}
            >
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={cn("text-xs hidden sm:block font-medium", i === current ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div className={cn("flex-1 h-0.5 mx-2 transition-colors duration-500", i < current ? "bg-primary" : "bg-border")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Step 1: Role ──────────────────────────────────────────────────────────
function RoleStep({ selected, onSelect }: { selected: Role | null; onSelect: (r: Role) => void }) {
  return (
    <div className="space-y-3">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">Select your target role</h3>
        <p className="text-sm text-muted-foreground">Choose the engineering track that aligns with your career goals.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelect(role)}
            className={cn(
              "group relative text-left p-4 rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected?.id === role.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-border/80 hover:bg-accent/50"
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-2xl">{role.icon}</span>
              <Badge variant={selected?.id === role.id ? "default" : "outline"}>{role.level}</Badge>
            </div>
            <p className={cn("font-semibold text-sm mb-1", selected?.id === role.id ? "text-primary" : "text-foreground")}>
              {role.label}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
            {selected?.id === role.id && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: Diagnostic ────────────────────────────────────────────────────
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
    <div className="space-y-5">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">Skill diagnostic</h3>
        <p className="text-sm text-muted-foreground">Three questions to calibrate your learning pathway. No wrong answers — this shapes your roadmap.</p>
      </div>
      {QUESTIONS.map((q, qi) => (
        <Card key={q.id}>
          <CardContent className="pt-5">
            <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold mr-2">{qi + 1}</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[q.id] === oi;
                const correct = oi === q.correct;
                return (
                  <button
                    key={oi}
                    disabled={revealed}
                    onClick={() => !revealed && onAnswer(q.id, oi)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-150 font-medium",
                      !revealed && !chosen && "border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-foreground",
                      !revealed && chosen && "border-primary bg-primary/8 text-primary",
                      revealed && correct && "border-emerald-500/40 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400",
                      revealed && chosen && !correct && "border-red-500/40 bg-red-500/8 text-red-600 dark:text-red-400",
                      revealed && !chosen && !correct && "border-border text-muted-foreground opacity-60"
                    )}
                  >
                    <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Step 3: Commitment ────────────────────────────────────────────────────
function CommitmentStep({ hours, onChange }: { hours: number; onChange: (h: number) => void }) {
  const info = HOURS_LABELS[hours] ?? { label: `${hours} hrs/week`, emoji: "📅" };
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">Weekly commitment</h3>
        <p className="text-sm text-muted-foreground">Set a realistic schedule — consistency matters more than intensity.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-bold text-foreground">{hours}<span className="text-lg text-muted-foreground ml-1 font-normal">hrs/week</span></p>
              <p className="text-sm text-muted-foreground mt-0.5">{info.emoji} {info.label}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Estimated completion</p>
              <p className="text-sm font-semibold text-primary">{estimateWeeks(hours)}</p>
            </div>
          </div>
          <input
            type="range" min={5} max={35} step={5} value={hours}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-1.5"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">5 hrs</span>
            <span className="text-xs text-muted-foreground">35 hrs</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: <Clock className="w-4 h-4" />, label: "Hours/week", value: `${hours}h` },
              { icon: <Target className="w-4 h-4" />, label: "Sessions/week", value: `${Math.round(hours / 2)}` },
              { icon: <Zap className="w-4 h-4" />, label: "Est. completion", value: estimateWeeks(hours).split("–")[0] + "w+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-muted/50 p-3 text-center">
                <div className="flex justify-center text-primary mb-1">{stat.icon}</div>
                <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main wizard ───────────────────────────────────────────────────────────
export default function DesiWizard({ onComplete }: { onComplete: (r: WizardResult) => void }) {
  const STEPS = ["Target Role", "Skill Diagnostic", "Commitment"];
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [hours, setHours] = useState(15);

  const score = QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
  const allAnswered = QUESTIONS.every((q) => q.id in answers);
  const canNext =
    (step === 0 && selectedRole !== null) ||
    (step === 1 && (allAnswered || revealed)) ||
    step === 2;

  function next() {
    if (step === 1 && !revealed) { setRevealed(true); return; }
    setDirection(1);
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else if (selectedRole) onComplete({ role: selectedRole, score, weeklyHours: hours });
  }
  function back() {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
    if (step === 2) setRevealed(false);
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -30 : 30, opacity: 0 }),
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Stepper current={step} labels={STEPS} />
      <Progress value={((step + 1) / STEPS.length) * 100} className="mb-8 h-1" />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {step === 0 && <RoleStep selected={selectedRole} onSelect={setSelectedRole} />}
          {step === 1 && <DiagnosticStep answers={answers} onAnswer={(id, i) => setAnswers((p) => ({ ...p, [id]: i }))} revealed={revealed} />}
          {step === 2 && <CommitmentStep hours={hours} onChange={setHours} />}
        </motion.div>
      </AnimatePresence>

      {step === 1 && revealed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
          <div className={cn("flex items-center gap-3 p-4 rounded-xl border",
            score === 3 ? "border-emerald-500/30 bg-emerald-500/5" :
            score >= 1 ? "border-amber-500/30 bg-amber-500/5" :
            "border-primary/20 bg-primary/5")}>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
              score === 3 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
              "bg-primary/10 text-primary")}>
              {score}/{QUESTIONS.length}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {score === 3 ? "Excellent — Advanced track unlocked" :
                 score >= 1 ? "Solid foundation — Standard track" :
                 "Beginner track — We'll start from basics"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Your roadmap has been calibrated to your current level.</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button variant="outline" size="sm" onClick={back} disabled={step === 0}>
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button onClick={next} disabled={!canNext} size="sm">
          {step === STEPS.length - 1 ? "Generate Roadmap" :
           step === 1 && !revealed ? "Check Answers" : "Continue"}
          {(step < STEPS.length - 1) && step !== 1 && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}

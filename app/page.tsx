"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Github, ArrowRight, CheckCircle,
  BookOpen, MessageSquare, BarChart3, Cpu
} from "lucide-react";
import DesiWizard, { type WizardResult } from "@/components/DesiWizard";
import MemeRoadmap from "@/components/MemeRoadmap";
import ChatDrawer, { ChatTriggerButton } from "@/components/ChatDrawer";
import { cn, Button, Badge, Card, CardContent, Separator } from "@/components/ui";

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({
  view,
  onNavigate,
  wizardDone,
}: {
  view: string;
  onNavigate: (v: "hero" | "wizard" | "roadmap") => void;
  wizardDone: boolean;
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-20 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("hero")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
            LearnMate <span className="text-muted-foreground font-normal">AI</span>
          </span>
        </button>

        {/* Nav items */}
        <nav className="flex items-center gap-1">
          {view !== "hero" && (
            <Button
              variant={view === "wizard" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => onNavigate("wizard")}
            >
              Assessment
            </Button>
          )}
          {wizardDone && view !== "hero" && (
            <Button
              variant={view === "roadmap" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => onNavigate("roadmap")}
            >
              Roadmap
            </Button>
          )}
          <Separator orientation="vertical" className="h-5 mx-1" />
          <a
            href="https://github.com/Rajatpundir7/IBM-PERSONAL_AGENT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}

// ── Feature card ───────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="p-5">
      <CardContent className="p-0">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

// ── Hero section ────────────────────────────────────────────────────────────
function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <Badge variant="default">Problem Statement #12</Badge>
          <Badge variant="outline">IBM watsonx.ai</Badge>
          <Badge variant="violet">Mistral Small 3.1 24B</Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.05]"
        >
          Your personal{" "}
          <span className="text-gradient">SDE learning</span>{" "}
          co-pilot
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Agentic AI that builds a personalised engineering roadmap from your skill assessment,
          adapts in real-time, and mentors you with IBM watsonx.ai.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <Button size="lg" onClick={onStart} className="gap-2 shadow-sm">
            Start Assessment <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://github.com/Rajatpundir7/IBM-PERSONAL_AGENT" target="_blank" rel="noopener noreferrer" className="gap-2">
              <Github className="w-4 h-4" /> View on GitHub
            </a>
          </Button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground mb-16"
        >
          {["No signup required", "Free to use", "Powered by IBM Cloud", "Open source"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
        >
          <FeatureCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Skill Diagnostic"
            desc="3-question assessment calibrates your roadmap to your exact knowledge level."
          />
          <FeatureCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="Adaptive Roadmap"
            desc="3-phase pathway that adjusts dynamically when you hit knowledge gaps."
          />
          <FeatureCard
            icon={<MessageSquare className="w-5 h-5" />}
            title="AI Mentor Chat"
            desc="Real-time guidance from AI mentors specialised in DSA and system design."
          />
          <FeatureCard
            icon={<Cpu className="w-5 h-5" />}
            title="watsonx.ai Powered"
            desc="IBM Mistral Small 3.1 24B drives all AI features via a secure backend proxy."
          />
        </motion.div>
      </div>
    </div>
  );
}

// ── Page shells ────────────────────────────────────────────────────────────
function PageShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen pt-20 pb-28 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
type View = "hero" | "wizard" | "roadmap";

export default function Home() {
  const [view, setView] = useState<View>("hero");
  const [wizardResult, setWizardResult] = useState<WizardResult | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  function handleComplete(result: WizardResult) {
    setWizardResult(result);
    setView("roadmap");
  }

  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25 },
  };

  return (
    <div className="dark">
      {view !== "hero" && (
        <Navbar view={view} onNavigate={setView} wizardDone={wizardResult !== null} />
      )}

      <AnimatePresence mode="wait">
        {view === "hero" && (
          <motion.div key="hero" {...fade}>
            <Hero onStart={() => setView("wizard")} />
          </motion.div>
        )}

        {view === "wizard" && (
          <motion.div key="wizard" {...fade}>
            <PageShell
              title="Skill Assessment"
              subtitle="Three steps to calibrate your personalised learning pathway."
            >
              <DesiWizard onComplete={handleComplete} />
            </PageShell>
          </motion.div>
        )}

        {view === "roadmap" && wizardResult && (
          <motion.div key="roadmap" {...fade}>
            <PageShell
              title="Learning Pathway"
              subtitle="Your personalised roadmap, powered by IBM watsonx.ai."
            >
              <MemeRoadmap wizardResult={wizardResult} />
            </PageShell>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chat — only after hero */}
      {view !== "hero" && (
        <ChatTriggerButton onClick={() => setChatOpen(true)} />
      )}

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

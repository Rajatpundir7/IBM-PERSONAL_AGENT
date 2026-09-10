import type { Metadata } from "next";
import "@/styles/globals.css";
import WxoWidget from "@/components/WxoWidget";

export const metadata: Metadata = {
  title: "LearnMate AI — Desi SDE Pathway Orchestrator",
  description:
    "Agentic AI for Personalized Course Pathways. DSA phodenge, System Design seekhenge, FAANG crack karenge!",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: "#0B0F19", minHeight: "100vh" }}>
        {children}
        {/* Watson Orchestrate chat widget (client-side) */}
        <WxoWidget />
      </body>
    </html>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, Target, ArrowRight, FileCheck, Map, CreditCard, RefreshCw } from "lucide-react";

type Scenario = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: { title: string; detail: string; action?: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "first-time",
    title: "First-Time Voter",
    icon: <Target className="h-6 w-6" />,
    description: "Complete guide for registering and voting for the first time.",
    steps: [
      { title: "Check Eligibility", detail: "Must be 18+ and an Indian citizen." },
      { title: "Form 6 Submission", detail: "Apply online via NVSP or Voter Helpline App.", action: "Apply Now" },
      { title: "Document Verification", detail: "Keep Aadhar and Age Proof ready." },
    ]
  },
  {
    id: "lost-id",
    title: "Lost Voter ID",
    icon: <AlertCircle className="h-6 w-6" />,
    description: "Steps to recover or replace a lost EPIC card.",
    steps: [
      { title: "File FIR/NCR", detail: "Lodge a police complaint for the lost card." },
      { title: "Submit Form 8", detail: "Select 'Issue of Replacement EPIC' on the portal.", action: "Open Form 8" },
      { title: "Alternative IDs", detail: "You can vote using Aadhar, Passport, or PAN if your name is on the roll." },
    ]
  },
  {
    id: "name-mismatch",
    title: "Name Mismatch",
    icon: <FileCheck className="h-6 w-6" />,
    description: "Correcting spelling errors in your Voter ID.",
    steps: [
      { title: "Identify Error", detail: "Check details on the electoral roll." },
      { title: "Submit Form 8", detail: "Select 'Correction of Entries'.", action: "Open Form 8" },
      { title: "Provide Proof", detail: "Upload 10th marksheet or Aadhar with correct spelling." },
    ]
  },
  {
    id: "change-address",
    title: "Shifted Constituency",
    icon: <Map className="h-6 w-6" />,
    description: "Moving your vote to a new city or state.",
    steps: [
      { title: "Submit Form 8", detail: "Select 'Shifting of Residence'.", action: "Open Form 8" },
      { title: "New Address Proof", detail: "Upload utility bill or rental agreement." },
      { title: "Verification", detail: "BLO will verify the new address." },
    ]
  },
  {
    id: "nri",
    title: "Overseas/NRI Voter",
    icon: <CreditCard className="h-6 w-6" />,
    description: "Registration process for Indian citizens living abroad.",
    steps: [
      { title: "Submit Form 6A", detail: "Register as an overseas elector.", action: "Open Form 6A" },
      { title: "Passport Verification", detail: "Self-attested copy of passport required." },
      { title: "Voting Protocol", detail: "Currently, NRIs must vote in person at their registered constituency." },
    ]
  },
];

export default function StrategySimulator() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-8">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar pr-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-white/30 mb-2 pl-2">Select Scenario</h2>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={cn(
              "flex flex-col text-left p-4 rounded-2xl border transition-all duration-300",
              activeId === s.id
                ? "bg-sana/10 border-sana/30 shadow-[0_0_20px_rgba(163,255,0,0.1)]"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2 rounded-lg",
                activeId === s.id ? "bg-sana text-black" : "bg-white/10 text-white/70"
              )}>
                {s.icon}
              </div>
              <span className={cn(
                "font-bold",
                activeId === s.id ? "text-sana" : "text-white"
              )}>{s.title}</span>
            </div>
            <span className="text-xs text-white/50">{s.description}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full md:w-2/3 bg-black/40 border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeId ? (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {(() => {
                const scenario = SCENARIOS.find(s => s.id === activeId)!;
                return (
                  <>
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                      <div className="p-4 bg-sana/20 text-sana rounded-2xl">
                        {scenario.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{scenario.title}</h2>
                        <p className="text-white/60">{scenario.description}</p>
                      </div>
                    </div>

                    <div className="relative flex-1">
                      {/* Timeline Line */}
                      <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-white/10" />

                      <div className="space-y-8 relative">
                        {scenario.steps.map((step, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-6 relative"
                          >
                            <div className="h-14 w-14 rounded-full bg-black border-4 border-[#020408] flex items-center justify-center font-black text-sana z-10 shrink-0 shadow-[0_0_10px_rgba(163,255,0,0.2)]">
                              {idx + 1}
                            </div>
                            <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-2xl">
                              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                              <p className="text-white/60 leading-relaxed mb-4">{step.detail}</p>
                              {step.action && (
                                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sana hover:text-white transition-all">
                                  {step.action}
                                  <ArrowRight className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <RefreshCw className="h-3 w-3" /> Auto-sync enabled
                      </span>
                      <button className="px-6 py-3 bg-sana text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all">
                        Execute Strategy
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-white/30 text-center"
            >
              <Target className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a scenario to generate a strategy.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

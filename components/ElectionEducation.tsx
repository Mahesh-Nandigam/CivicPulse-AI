"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, Search, HelpCircle, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const educationSteps = [
  {
    id: "step-1",
    title: "Registration Check",
    icon: Search,
    content: "The first step is ensuring you are registered in your current jurisdiction. Deadlines vary by state (typically 15-30 days before Election Day).",
    tips: ["Check status online", "Update address if you moved", "Know your ID requirements"]
  },
  {
    id: "step-2",
    title: "Research Your Ballot",
    icon: BookOpen,
    content: "Review non-partisan guides for candidates and measures. CivicPulse AI can help summarize complex legislative language.",
    tips: ["Download sample ballot", "Compare candidate platforms", "Read fiscal impact reports"]
  },
  {
    id: "step-3",
    title: "Plan Your Visit",
    icon: HelpCircle,
    content: "Decide between Early Voting, Vote-by-Mail, or In-Person. Locate your designated polling station and check opening hours.",
    tips: ["Find polling locations", "Check wait times", "Secure necessary identification"]
  },
  {
    id: "step-4",
    title: "Cast Your Vote",
    icon: CheckCircle,
    content: "Bring your required ID, follow poll worker instructions, and ensure your ballot is correctly scanned or deposited.",
    tips: ["Know your voter rights", "Request assistance if needed", "Verify ballot confirmation"]
  }
];

export default function ElectionEducation() {
  const [activeStep, setActiveStep] = useState(educationSteps[0].id);

  return (
    <div className="glass-card p-10 space-y-8">
      <div className="flex items-center gap-6">
        <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <GraduationCap className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tight">Civic Learning Hub</h3>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-1">Master the democratic process in 4 stages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {educationSteps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={cn(
                "w-full p-5 rounded-2xl flex items-center gap-4 transition-all border text-left group",
                activeStep === step.id 
                  ? "bg-accent/10 border-accent/50 shadow-lg shadow-accent/10" 
                  : "bg-white/5 border-white/5 hover:border-white/20"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                activeStep === step.id ? "bg-accent text-white" : "bg-white/5 text-white/30 group-hover:text-white"
              )}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Stage 0{i+1}</div>
                <div className={cn(
                  "text-sm font-black uppercase italic tracking-tight",
                  activeStep === step.id ? "text-white" : "text-white/40"
                )}>{step.title}</div>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 transition-all",
                activeStep === step.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              )} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-black/40 rounded-[2.5rem] p-10 h-full border border-white/5 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                    {educationSteps.find(s => s.id === activeStep)?.title}
                  </h4>
                  <p className="text-white/60 text-lg leading-relaxed font-medium">
                    {educationSteps.find(s => s.id === activeStep)?.content}
                  </p>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[10px] font-black text-accent uppercase tracking-[0.5em] flex items-center gap-3">
                    <CheckCircle className="h-4 w-4" /> Pro-Tips for Citizens
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educationSteps.find(s => s.id === activeStep)?.tips.map((tip, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 text-xs font-black text-white/70 uppercase italic tracking-wide group hover:bg-accent/5 hover:border-accent/20 transition-all">
                        <div className="h-6 w-6 rounded-lg bg-accent/20 flex items-center justify-center text-[10px] text-accent">0{i+1}</div>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Background Icon Watermark */}
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                 {React.createElement(educationSteps.find(s => s.id === activeStep)?.icon || Search, { className: "h-64 w-64 text-white" })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

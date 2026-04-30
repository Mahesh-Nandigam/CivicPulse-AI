"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Skull, XCircle, Info, ArrowRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const scenarios = [
  {
    id: "registration",
    title: "Missed Registration",
    impact: "Total Exclusion",
    description: "You arrive at the polls on Election Day, but your name isn't on the roster. You missed the 20-day cutoff.",
    consequence: "Your voice on local taxes and schools is legally silenced for the next 4 years.",
    icon: XCircle,
    color: "text-alert",
    bg: "bg-alert/10",
    border: "border-alert/20"
  },
  {
    id: "apathy",
    title: "Apathy Multiplier",
    impact: "Policy Drift",
    description: "You feel your single vote doesn't matter and stay home. 10,000 others in your district do the same.",
    consequence: "A measure you strongly oppose passes by a margin of 42 votes. Your community budget is reallocated.",
    icon: Activity,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20"
  },
  {
    id: "logistics",
    title: "Logistical Failure",
    impact: "Physical Exhaustion",
    description: "You wait until 6 PM on Tuesday. The queue stretches 4 blocks. System delays increase wait to 5 hours.",
    consequence: "You abandon the line due to personal commitments. The candidate who promised health reforms loses by a sliver.",
    icon: Clock,
    color: "text-democracy",
    bg: "bg-democracy/10",
    border: "border-democracy/20"
  }
];

export default function ConsequenceSimulator() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="glass-card p-10 space-y-8 border-alert/20">
      <div className="flex items-center gap-6">
        <div className="h-14 w-14 rounded-2xl bg-alert/20 flex items-center justify-center border border-alert/30 animate-pulse">
          <AlertTriangle className="h-8 w-8 text-alert" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tight">Consequence Simulation</h3>
          <p className="text-[10px] font-black text-alert uppercase tracking-[0.4em] mt-1">Operational Impact of Civic Inaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((s) => (
          <motion.div 
            key={s.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActiveId(activeId === s.id ? null : s.id)}
            className={cn(
              "p-8 rounded-[2rem] border cursor-pointer transition-all flex flex-col gap-6 relative overflow-hidden h-[300px]",
              activeId === s.id ? `${s.bg} ${s.border} ring-2 ring-inset ring-alert/10` : "bg-white/5 border-white/5"
            )}
          >
             <div className="absolute top-0 right-0 p-6 opacity-5">
                <s.icon className="h-24 w-24 text-white" />
             </div>
             
             <div className="flex items-center justify-between relative z-10">
                <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border", activeId === s.id ? "bg-white/10 border-white/20" : "bg-black/20 border-white/10")}>{s.impact}</span>
                <s.icon className={cn("h-5 w-5", s.color)} />
             </div>

             <div className="relative z-10 flex-1">
                <h4 className="text-xl font-black text-white uppercase italic tracking-tight mb-3">{s.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed font-bold uppercase tracking-tight">{s.description}</p>
             </div>

             <AnimatePresence>
                {activeId === s.id && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-alert/20 border border-alert/30 relative z-10"
                  >
                     <div className="text-[8px] font-black text-alert uppercase tracking-widest mb-1">Critical Outcome</div>
                     <p className="text-[10px] text-white font-black italic uppercase leading-tight">{s.consequence}</p>
                  </motion.div>
                )}
             </AnimatePresence>

             {!activeId && (
                <div className="flex items-center gap-2 text-[8px] font-black text-white/20 uppercase tracking-widest group">
                   Simulate Impact <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
             )}
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-center">
         <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.6em] italic">Apathy is a luxury that democracy cannot afford.</p>
      </div>
    </div>
  );
}

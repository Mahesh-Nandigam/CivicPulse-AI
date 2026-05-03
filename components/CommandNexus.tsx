"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, ArrowRight, ShieldCheck, MapPin, Database } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function CommandNexus({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { location, role } = useUser();
  const city = location.city || "Unknown Zone";
  const state = location.state || "Unknown Sector";

  return (
    <div className="w-full h-full max-w-6xl mx-auto space-y-6">
      {/* Header Profile Section */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sana/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back, Operative.</h1>
          <p className="text-white/60 text-lg">
            Your personalized deployment strategy for <strong className="text-white">{city}, {state}</strong> is ready.
          </p>
          <div className="flex gap-3 mt-4">
            <span className="px-3 py-1 bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest rounded-md border border-white/5">
              Region: {state}
            </span>
            <span className="px-3 py-1 bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest rounded-md border border-white/5">
              Status: {role}
            </span>
          </div>
        </div>

        {/* Circular Readiness Gauge */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-bold uppercase tracking-widest text-white/50 mb-1">Voting Readiness</div>
            <div className="text-3xl font-black text-sana">42%</div>
          </div>
          <div className="relative h-24 w-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <motion.circle
                initial={{ strokeDashoffset: 251 }}
                animate={{ strokeDashoffset: 251 - (251 * 0.42) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="50" cy="50" r="40"
                stroke="#a3ff00"
                strokeWidth="8"
                fill="none"
                strokeDasharray="251"
                strokeLinecap="round"
              />
            </svg>
            <ShieldCheck className="absolute h-8 w-8 text-sana" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trajectory Tracker */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Database className="h-5 w-5 text-sana" />
            Mission Trajectory
          </h2>
          
          <div className="space-y-6">
            {[
              { title: "Verify Electoral Eligibility", status: "complete", time: "Completed" },
              { title: "Form 6 Registration Submission", status: "pending", time: "Action Required" },
              { title: "Acquire Voter ID (EPIC)", status: "locked", time: "Locked" },
              { title: "Locate Designated Polling Booth", status: "locked", time: "Locked" },
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="mt-1">
                  {step.status === "complete" ? (
                    <CheckCircle2 className="h-6 w-6 text-sana" />
                  ) : step.status === "pending" ? (
                    <CircleDashed className="h-6 w-6 text-yellow-500 animate-spin-slow" />
                  ) : (
                    <CircleDashed className="h-6 w-6 text-white/20" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={cn("text-lg font-bold", step.status === "locked" ? "text-white/30" : "text-white")}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50">{step.time}</p>
                </div>
                {step.status === "pending" && (
                  <button className="px-4 py-2 bg-sana/10 text-sana border border-sana/20 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-sana hover:text-black transition-all">
                    Execute
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Console */}
        <div className="flex flex-col gap-6">
          <div className="bg-sana text-black rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-[0_0_30px_rgba(163,255,0,0.15)]" onClick={() => onNavigate("command_center")}>
            <div>
              <h3 className="text-xl font-black uppercase tracking-widest mb-2">Intelligence Uplink</h3>
              <p className="text-black/70 font-medium">Access Sana AI for immediate contextual problem solving.</p>
            </div>
            <div className="flex justify-end mt-8">
              <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center text-sana">
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer" onClick={() => onNavigate("evm_sandbox")}>
            <div>
              <div className="h-10 w-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tactical Deployment Map</h3>
              <p className="text-sm text-white/50">Locate your exact polling station coordinates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

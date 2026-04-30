"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  UserPlus, 
  Search, 
  MapPin, 
  Vote,
  CheckCircle2
} from "lucide-react";
import { JourneyState } from "@/lib/sana-engine";

interface JourneyTrackerProps {
  state: JourneyState;
}

const MILESTONES = [
  { key: "isRegistered", label: "Registration", icon: UserPlus },
  { key: "isVerified", label: "Verification", icon: Search },
  { key: "hasBoothInfo", label: "Booth", icon: MapPin },
  { key: "readyToVote", label: "Voting", icon: Vote },
];

export default function JourneyTracker({ state }: JourneyTrackerProps) {
  return (
    <div className="w-full bg-white/[0.03] backdrop-blur-xl border-y border-white/5 py-4 px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-10" />
        
        {MILESTONES.map((milestone, idx) => {
          const isComplete = state[milestone.key as keyof JourneyState];
          const isActive = !isComplete && (idx === 0 || state[MILESTONES[idx - 1].key as keyof JourneyState]);

          const Icon = milestone.icon;

          return (
            <div key={milestone.key} className="flex flex-col items-center gap-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg",
                isComplete 
                  ? "bg-sana border-sana text-black" 
                  : isActive 
                    ? "bg-black border-sana text-sana animate-pulse" 
                    : "bg-black border-white/20 text-white/20"
              )}>
                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                isComplete ? "text-sana" : isActive ? "text-sana/60" : "text-white/20"
              )}>
                {milestone.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

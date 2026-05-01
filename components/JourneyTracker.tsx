"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  UserPlus,
  Search,
  MapPin,
  Vote,
  CheckCircle2,
} from "lucide-react";
import { JourneyState } from "@/lib/sana-engine";

/**
 * Props for the JourneyTracker component.
 */
interface JourneyTrackerProps {
  /** The current state of all journey milestones. */
  state: JourneyState;
}

/**
 * Milestone configuration for the voter journey progress bar.
 * Each milestone maps to a boolean in JourneyState.
 */
const MILESTONES = [
  { key: "isRegistered" as const, label: "Registration", icon: UserPlus, description: "Complete voter registration via Form 6" },
  { key: "isVerified" as const, label: "Verification", icon: Search, description: "Verify your name on the electoral roll" },
  { key: "hasBoothInfo" as const, label: "Booth", icon: MapPin, description: "Identify your assigned polling booth" },
  { key: "readyToVote" as const, label: "Voting", icon: Vote, description: "Confirm documents and election date" },
] as const;

/**
 * JourneyTracker renders a horizontal progress indicator showing
 * the user's advancement through the four civic readiness milestones.
 *
 * Visual states:
 * - **Complete** (green filled): Milestone achieved
 * - **Active** (pulsing outline): Current focus area
 * - **Pending** (dimmed): Not yet reachable
 *
 * @param props - Contains the current JourneyState.
 * @returns An accessible progress tracker with tooltips.
 */
export default function JourneyTracker({ state }: JourneyTrackerProps) {
  const completedCount = Object.values(state).filter(Boolean).length;

  return (
    <div
      className="w-full bg-white/[0.03] backdrop-blur-xl border-y border-white/5 py-4 px-6"
      role="progressbar"
      aria-valuenow={completedCount}
      aria-valuemin={0}
      aria-valuemax={4}
      aria-label={`Voter journey progress: ${completedCount} of 4 milestones completed`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-10" aria-hidden="true" />

        {MILESTONES.map((milestone, idx) => {
          const isComplete = state[milestone.key];
          const isActive = !isComplete && (idx === 0 || state[MILESTONES[idx - 1].key]);
          const Icon = milestone.icon;

          return (
            <div
              key={milestone.key}
              className="flex flex-col items-center gap-2"
              title={milestone.description}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg",
                  isComplete
                    ? "bg-sana border-sana text-black"
                    : isActive
                      ? "bg-black border-sana text-sana animate-pulse"
                      : "bg-black border-white/20 text-white/20"
                )}
                aria-label={`${milestone.label}: ${isComplete ? "completed" : isActive ? "in progress" : "pending"}`}
              >
                {isComplete ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Icon className="h-5 w-5" aria-hidden="true" />}
              </div>
              <span
                className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  isComplete ? "text-sana" : isActive ? "text-sana/60" : "text-white/20"
                )}
              >
                {milestone.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

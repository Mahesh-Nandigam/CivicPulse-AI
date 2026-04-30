"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Compass, 
  Clock, 
  HelpCircle, 
  Zap, 
  MessageSquare 
} from "lucide-react";

const suggestions = [
  { label: "Guide me to vote", icon: Compass, value: "guide_me" },
  { label: "Show election timeline", icon: Clock, value: "timeline" },
  { label: "What should I do next?", icon: Zap, value: "next_steps" },
  { label: "Explain elections simply", icon: HelpCircle, value: "explain" },
  { label: "Talk to a candidate", icon: MessageSquare, value: "candidate" },
];

interface SuggestionChipsProps {
  onSelect: (value: string) => void;
}

export default function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {suggestions.map((s, i) => (
        <motion.button
          key={s.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          onClick={() => onSelect(s.label)}
          className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-sana/50 hover:bg-sana/5 transition-all duration-300"
        >
          <s.icon className="h-4 w-4 text-white/40 group-hover:text-sana transition-colors" />
          <span className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
            {s.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

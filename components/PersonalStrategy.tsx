"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Zap, MapPin, Calendar, Briefcase, GraduationCap, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateVotingStrategy } from "@/lib/ai-logic";

export default function PersonalStrategy() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: "",
    age: "",
    concerns: [] as string[],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);

  const concernsList = ["Jobs & Economy", "Education", "Healthcare", "Climate Change", "Civil Rights", "National Security"];

  const toggleConcern = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern) 
        ? prev.concerns.filter(c => c !== concern) 
        : [...prev.concerns, concern]
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // AI Synthesis Logic
    setTimeout(() => {
      const generated = generateVotingStrategy(formData.location, formData.age, formData.concerns);
      setStrategy(generated);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="glass-card p-10 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <Target className="h-64 w-64 text-democracy" />
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <div className="h-14 w-14 rounded-2xl bg-democracy/20 flex items-center justify-center border border-democracy/30">
          <Sparkles className="h-8 w-8 text-democracy" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tight">Personal Voting Strategy</h3>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-1">AI-Powered Optimization Engine</p>
        </div>
      </div>

      <div className="relative z-10">
        {!strategy ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Target Jurisdiction</label>
                <input 
                  type="text" 
                  placeholder="e.g. New York, NY" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-democracy transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Citizen Age Group</label>
                <select 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-democracy transition-all text-white/50"
                >
                  <option value="">Select Range</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-50">35-50</option>
                  <option value="50+">50+</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Primary Socio-Economic Concerns</label>
              <div className="flex flex-wrap gap-3">
                {concernsList.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleConcern(c)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                      formData.concerns.includes(c) 
                        ? "bg-democracy border-democracy text-white shadow-lg shadow-democracy/20" 
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={!formData.location || !formData.age || formData.concerns.length === 0 || isGenerating}
              className="w-full cyber-button h-16 flex items-center justify-center gap-4"
            >
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
              {isGenerating ? "Synthesizing Strategy..." : "Generate My Voting Strategy"}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="p-8 rounded-[2rem] bg-democracy/10 border border-democracy/20">
              <div className="text-[10px] font-black text-democracy uppercase tracking-[0.5em] mb-4 flex items-center gap-2">
                <Sparkles className="h-3 w-3" /> Strategic Overview
              </div>
              <p className="text-lg font-black text-white italic leading-tight uppercase tracking-tight">"{strategy.message}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {strategy.plan.map((item: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 group hover:border-democracy/30 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-democracy/10 flex items-center justify-center text-democracy">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">{item.title}</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed uppercase font-bold">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
               <div>
                  <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Hard Deadline</div>
                  <div className="text-sm font-black text-alert uppercase italic tracking-tighter">{strategy.deadline}</div>
               </div>
               <button onClick={() => setStrategy(null)} className="text-[10px] font-black text-democracy uppercase tracking-widest hover:underline">
                  Reset Generator
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

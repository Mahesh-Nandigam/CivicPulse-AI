"use client";

import React from "react";
import { useUser } from "@/context/UserContext";
import { MapPin, User, Globe, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ContextBar() {
  const { location, language, role, updateLocation, isLocating } = useUser();

  return (
    <div className="h-24 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-12 z-50 sticky top-0">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-10 w-10 rounded-xl bg-sana/10 flex items-center justify-center transition-all",
            isLocating && "animate-pulse"
          )}>
            <MapPin className={cn("h-5 w-5", isLocating ? "text-white" : "text-sana")} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Detected Location</span>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm font-black text-white uppercase tracking-tighter italic max-w-[200px] truncate">
                {isLocating ? "Scanning Coordinates..." : (location.city || "Detecting...")}
              </span>
              <button 
                onClick={updateLocation}
                className="text-[8px] font-black text-sana uppercase border border-sana/30 px-2 py-1 rounded hover:bg-sana hover:text-black transition-all"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-12">
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Globe className="h-5 w-5 text-white/40" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Regional Segment</span>
            <span className="text-sm font-black text-white uppercase tracking-tighter italic mt-1">
              {location.state || "Scanning State..."}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <Languages className="h-3 w-3 text-sana" />
          <span className="text-[8px] font-black text-white uppercase tracking-widest">{language}</span>
        </div>

        <div className="flex items-center gap-4 pl-8 border-l border-white/10">
          <div className="text-right">
            <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Profile Status</div>
            <div className="text-[10px] font-black text-sana uppercase tracking-tighter italic">Verified {role}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sana to-blue-500 p-[1px]">
            <div className="h-full w-full rounded-full bg-[#020408] flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

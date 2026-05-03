"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Languages, Volume2, ArrowRightLeft } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
];

export default function LinguisticsConsole() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = () => {
    if (!inputText) return;
    setIsTranslating(true);
    
    // Simulate translation delay
    setTimeout(() => {
      // Mock translation just for UI demo purposes
      const mockTranslations: Record<string, string> = {
        "Where is my polling booth?": "मेरा पोलिंग बूथ कहाँ है?",
        "How to register as a voter?": "मतदाता के रूप में पंजीकरण कैसे करें?",
        "What is EVM?": "ईवीएम क्या है?",
        "Documents required for voting": "मतदान के लिए आवश्यक दस्तावेज",
      };
      
      setTranslatedText(mockTranslations[inputText] || `[Translated to ${LANGUAGES.find(l => l.code === targetLang)?.name}]: ${inputText}`);
      setIsTranslating(false);
    }, 1500);
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleQuickPhrase = (text: string) => {
    setInputText(text);
    // Auto translate when a quick phrase is selected
    setTimeout(() => {
      const mockTranslations: Record<string, string> = {
        "Where is my polling booth?": "मेरा पोलिंग बूथ कहाँ है?",
        "How to register as a voter?": "मतदाता के रूप में पंजीकरण कैसे करें?",
        "What is EVM?": "ईवीएम क्या है?",
        "Documents required for voting": "मतदान के लिए आवश्यक दस्तावेज",
      };
      setTranslatedText(mockTranslations[text] || `[Translated to ${LANGUAGES.find(l => l.code === targetLang)?.name}]: ${text}`);
    }, 500);
  };

  return (
    <div className="w-full h-full flex flex-col max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Languages className="h-8 w-8 text-sana" />
          Linguistics Console
        </h2>
        <p className="text-white/50">Translate complex electoral terminology into 11+ regional languages instantly.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 shadow-2xl relative">
        {/* Language Selectors */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
          <select 
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="bg-black/50 border border-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-sana"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>

          <button 
            onClick={handleSwap}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>

          <select 
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-black/50 border border-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:border-sana"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        {/* Translation Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Area */}
          <div className="flex flex-col">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-48 bg-transparent text-2xl text-white placeholder:text-white/20 resize-none focus:outline-none custom-scrollbar"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-white/30">{inputText.length} / 5000</span>
              <button 
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
                className="px-6 py-2 bg-sana text-black font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isTranslating ? "Processing..." : "Translate"}
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex flex-col relative h-full">
            <div className="absolute -left-3 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
            <div className="w-full h-48 bg-transparent text-2xl text-sana resize-none focus:outline-none overflow-y-auto custom-scrollbar md:pl-6">
              {isTranslating ? (
                <div className="flex items-center gap-2 text-white/30">
                  <span className="h-2 w-2 rounded-full bg-sana animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-sana animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-sana animate-bounce [animation-delay:-0.3s]" />
                </div>
              ) : (
                translatedText
              )}
            </div>
            {translatedText && (
              <div className="mt-4 flex justify-start md:pl-6">
                <button className="p-2 bg-sana/10 text-sana hover:bg-sana/20 rounded-lg transition-all flex items-center gap-2 text-sm font-bold">
                  <Volume2 className="h-4 w-4" /> Text-to-Speech
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Phrases */}
      <div className="mt-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">Tactical Quick Phrases</h3>
        <div className="flex flex-wrap gap-3">
          {["Where is my polling booth?", "How to register as a voter?", "What is EVM?", "Documents required for voting"].map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPhrase(phrase)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrainCircuit, Landmark, CheckCircle2, XCircle } from "lucide-react";

const QUIZ_QUESTIONS = [
  {
    question: "What is the minimum age to register as a voter in India?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    explanation: "As per the Constitution of India, a citizen must be at least 18 years old to register as a voter."
  },
  {
    question: "What is the full form of EPIC?",
    options: [
      "Electronic Photo Identity Card",
      "Electors Photo Identity Card",
      "Election Permanent ID Card",
      "Electoral Photo Information Card"
    ],
    correct: 1,
    explanation: "EPIC stands for Electors Photo Identity Card, commonly known as Voter ID."
  },
  {
    question: "Which form is used for new voter registration?",
    options: ["Form 1", "Form 6", "Form 8", "Form 11"],
    correct: 1,
    explanation: "Form 6 is used for new voter registration for inclusion of name in the electoral roll."
  }
];

export default function KnowledgeHub() {
  const [activeTab, setActiveTab] = useState<"quiz" | "parliament">("quiz");
  
  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === QUIZ_QUESTIONS[currentQuestion].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {/* Header Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("quiz")}
          className={cn(
            "px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2",
            activeTab === "quiz" ? "bg-sana text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
        >
          <BrainCircuit className="h-4 w-4" /> Tactical Quiz
        </button>
        <button
          onClick={() => setActiveTab("parliament")}
          className={cn(
            "px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2",
            activeTab === "parliament" ? "bg-sana text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
        >
          <Landmark className="h-4 w-4" /> State Intelligence
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {activeTab === "quiz" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-black/40 border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            {!showResult ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sana font-black uppercase tracking-widest text-xs">
                    Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                  </span>
                  <div className="flex gap-1">
                    {QUIZ_QUESTIONS.map((_, i) => (
                      <div key={i} className={cn("h-1 w-6 rounded-full", i <= currentQuestion ? "bg-sana" : "bg-white/10")} />
                    ))}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h2>

                <div className="space-y-4">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQuestion].correct;
                    const showCorrect = selectedOption !== null && isCorrect;
                    const showWrong = isSelected && !isCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={selectedOption !== null}
                        className={cn(
                          "w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between",
                          selectedOption === null ? "bg-white/5 border-transparent hover:border-sana/50 hover:bg-white/10" :
                          showCorrect ? "bg-green-500/20 border-green-500" :
                          showWrong ? "bg-red-500/20 border-red-500" : "bg-white/5 border-transparent opacity-50"
                        )}
                      >
                        <span className="text-lg font-medium">{opt}</span>
                        {showCorrect && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                        {showWrong && <XCircle className="h-6 w-6 text-red-500" />}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-white/70 text-sm"
                  >
                    <strong className="text-white">Explanation:</strong> {QUIZ_QUESTIONS[currentQuestion].explanation}
                  </motion.div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className="px-8 py-4 bg-sana text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {currentQuestion === QUIZ_QUESTIONS.length - 1 ? "Finish Framework" : "Next Parameter"}
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-sana mb-8">
                  <span className="text-4xl font-black text-sana">{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Readiness Protocol Complete</h2>
                <p className="text-white/60 mb-8">You answered {score} out of {QUIZ_QUESTIONS.length} correctly.</p>
                <button
                  onClick={resetQuiz}
                  className="px-8 py-4 bg-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all"
                >
                  Restart Protocol
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "parliament" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="text-center text-white/50 border border-dashed border-white/20 p-12 rounded-3xl">
              <Landmark className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <h2 className="text-2xl font-bold text-white mb-2">State Intelligence Database</h2>
              <p>Direct integration with ECI statistics pipeline pending...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

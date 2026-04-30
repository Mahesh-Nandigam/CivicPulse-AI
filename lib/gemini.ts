import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function askCivicAdvisor(prompt: string, context: string = "") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `
      You are the "CivicPulse AI Advisor", a professional, objective, and highly knowledgeable assistant designed to help citizens understand the election process.
      Your goal is to provide accurate, non-partisan information about:
      1. Voter registration steps and deadlines.
      2. Polling place logistics and early voting options.
      3. Educational summaries of ballot measures and candidate platforms (maintain strict neutrality).
      4. Election day rules (IDs required, rights of voters).
      
      User Context: ${context}
      
      Maintain a tone that is institutional, reassuring, and mission-critical. Use technical but accessible language. 
      If a user asks for personal opinions or partisan endorsements, politely decline and state your purpose as a neutral civic education tool.
      Keep responses concise and formatted for a HUD-style interface.
    `;

    const result = await model.generateContent([systemPrompt, prompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm experiencing a neural link delay. Please try again or check official election websites for immediate info.";
  }
}

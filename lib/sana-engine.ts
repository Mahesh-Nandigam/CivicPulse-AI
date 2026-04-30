import { GoogleGenerativeAI } from "@google/generative-ai";
import { CIVIC_KNOWLEDGE_BASE } from "./civic-kb";
import { getRAGContext } from "./services";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * Represents the milestones achieved in the user's civic journey.
 */
export interface JourneyState {
  isRegistered: boolean;
  isVerified: boolean;
  hasBoothInfo: boolean;
  readyToVote: boolean;
}

/**
 * Tracks the state of the active conversation for stateful AI logic.
 */
export interface ConversationState {
  lastIntent?: string;
  lastTopic?: string;
  stepProgress: number;
  userProfile?: string;
  journey: JourneyState;
}

/**
 * The structured response from Sana AI, optimized for proactive decision support.
 */
export interface SanaResponse {
  answer: string;
  nudge?: string;
  options: Array<{ label: string; info: string; urgency: "high" | "normal"; intent?: string }>;
  reasoning: string;
  state: ConversationState;
  suggestions: string[];
  references: Array<{ name: string; url: string }>;
  confidence: number;
}

// Simple in-memory cache for efficiency
const contextCache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

/**
 * Generates a Google Calendar event link for a given election date.
 */
function getCalendarLink(dateStr: string, phase: string): string {
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const title = encodeURIComponent(`Voting Day: General Elections 2024 (${phase})`);
  const details = encodeURIComponent("Don't forget to exercise your right to vote! Carry your EPIC ID and check your polling booth on Sana AI.");
  // Basic date mapping for 2024
  const dateMap: Record<string, string> = {
    "May 13": "20240513T070000Z/20240513T180000Z",
    "May 20": "20240520T070000Z/20240520T180000Z",
    "May 25": "20240525T070000Z/20240525T180000Z",
    "June 1": "20240601T070000Z/20240601T180000Z",
  };
  const dates = dateMap[dateStr] || "20240513T070000Z/20240513T180000Z";
  return `${base}&text=${title}&details=${details}&dates=${dates}`;
}

const SYSTEM_PROMPT = `
You are Sana, a Proactive Civic Decision Intelligence System (v9.0). 
Built on the principles of Strategic Advisory and Decision Intelligence.

JOURNEY MILESTONES:
1. Registration (NVSP/Form 6)
2. Verification (Roll Check)
3. Polling Booth (Location identified)
4. Ready to Vote (Documents & Date confirmed)

OPERATIONAL GUIDELINES:
- PROACTIVE NUDGING: Analyze 'journey' milestones. If a milestone is incomplete, proactively nudge the user.
- STATEFUL MEMORY: Use 'stepProgress' and 'Conversation History' to avoid repetition.
- LOCAL GROUNDING: Use real-world local data (EPIC ID, Aadhaar, NVSP) and the provided location context.
- GOOGLE SERVICES: When mentioning election dates, include a "Add to Google Calendar" link in the 'references' array.
- ADAPTIVE PERSONALITY: Be expert, supportive, and human-centric.

FORMATTING: Always return valid JSON matching the schema.
`;

/**
 * Primary interface for chatting with Sana. Handles state, history, and RAG.
 */
export async function chatWithSana(
  prompt: string, 
  context: any, 
  history: any[] = [], 
  state: ConversationState = { stepProgress: 0, journey: { isRegistered: false, isVerified: false, hasBoothInfo: false, readyToVote: false } }
): Promise<SanaResponse> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Security: Prevent processing without valid key or in restricted environments
  if (!apiKey || apiKey.includes("AQ.")) {
    return getProactiveFallback(prompt, context, state);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Efficiency: Use cached context if available
  const cacheKey = `${prompt.slice(0, 20)}_${context.location.city}`;
  let staticContext = "";
  let dynamicContext = "";

  const cached = contextCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    staticContext = cached.data;
  } else {
    [staticContext, dynamicContext] = await Promise.all([
      retrieveContext(prompt, context.location),
      getRAGContext(prompt, context.location)
    ]);
    contextCache.set(cacheKey, { data: staticContext, timestamp: Date.now() });
  }

  const conversationHistory = history.slice(-5).map(h => `${h.role}: ${h.content}`).join("\n");

  const fullPrompt = `
    CURRENT_STATE: ${JSON.stringify(state)}
    LOCATION: ${context.location.city || 'India'}, ${context.location.state || ''}
    ROLE: ${context.role || 'Voter'}
    
    CONTEXT_GROUNDING:
    ${staticContext}
    ${dynamicContext}
    
    CONVERSATION_HISTORY:
    ${conversationHistory}
    
    USER_QUERY: ${prompt}
    
    Instruction: Generate a JSON response that pushes the user through the journey milestones.
  `;

  try {
    const result = await model.generateContent([SYSTEM_PROMPT, fullPrompt]);
    const response = await result.response;
    const text = response.text();
    
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonStr);
    
    if (parsed.state) {
      parsed.state.stepProgress = (state.stepProgress || 0) + 1;
    }

    return parsed;
  } catch (error) {
    console.error("Sana Engine Runtime Error:", error);
    return getProactiveFallback(prompt, context, state);
  }
}

/**
 * Retrieves static civic knowledge from the internal KB.
 */
function retrieveContext(query: string, location: any) {
  let context = "CIVIC BASELINE:\n";
  const q = query.toLowerCase();

  context += `- Eligibility: ${CIVIC_KNOWLEDGE_BASE.general_info.eligibility}\n`;
  context += `- Portal: ${CIVIC_KNOWLEDGE_BASE.general_info.registration_portal}\n`;
  
  if (q.includes("how to vote") || q.includes("process") || q.includes("booth")) {
    context += `- Voting Process: ${CIVIC_KNOWLEDGE_BASE.processes.how_to_vote.join(" -> ")}\n`;
  }
  
  const state = location.state;
  if (state && CIVIC_KNOWLEDGE_BASE.states[state as keyof typeof CIVIC_KNOWLEDGE_BASE.states]) {
    const stateData = CIVIC_KNOWLEDGE_BASE.states[state as keyof typeof CIVIC_KNOWLEDGE_BASE.states];
    context += `- ${state} Official Helpdesk: ${stateData.helpdesk}\n`;
  }

  return context;
}

/**
 * Secure fallback for when external APIs or LLMs are unavailable.
 */
function getProactiveFallback(prompt: string, context: any, state: ConversationState): SanaResponse {
  const city = context.location.city || "your area";
  return {
    answer: "I'm temporarily operating in offline mode, but I can still guide you through the essentials for " + city + ".",
    nudge: "Shall we start by checking your registration status manually?",
    options: [
      { label: "Verify My Status", info: "Check the voter list for " + city, urgency: "high", intent: "verify_status" },
      { label: "Find My Booth", info: "Locate your station.", urgency: "normal", intent: "find_booth" }
    ],
    reasoning: "Status verification is the most critical first step for any voter.",
    state: { ...state, stepProgress: state.stepProgress + 1, lastTopic: "fallback" },
    suggestions: ["Registration steps", "ID requirements"],
    references: [
      { name: "ECI Portal", url: "https://voters.eci.gov.in" },
      { name: "Add Election Day (May 13) to Google Calendar", url: getCalendarLink("May 13", "Phase 4") }
    ],
    confidence: 1.0
  };
}

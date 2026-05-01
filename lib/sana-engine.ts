import { GoogleGenerativeAI } from "@google/generative-ai";
import { CIVIC_KNOWLEDGE_BASE } from "./civic-kb";
import { getRAGContext } from "./services";
import {
  logToCloud,
  LogSeverity,
  trackAnalyticsEvent,
  getGoogleMapsDirections,
  createCalendarEventUrl,
  emitCloudFunctionEvent,
} from "./google-cloud-services";

/**
 * Lazy-initializes the Google Generative AI client.
 * Uses NEXT_PUBLIC_GEMINI_API_KEY from environment.
 */
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

/**
 * Represents the milestones achieved in the user's civic journey.
 * Each boolean maps to a critical step in voter readiness.
 *
 * @property isRegistered - Whether the user has completed voter registration.
 * @property isVerified - Whether the user has verified their electoral roll entry.
 * @property hasBoothInfo - Whether the user has identified their polling booth.
 * @property readyToVote - Whether the user is fully prepared to vote.
 */
export interface JourneyState {
  isRegistered: boolean;
  isVerified: boolean;
  hasBoothInfo: boolean;
  readyToVote: boolean;
}

/**
 * Tracks the state of the active conversation for stateful AI logic.
 *
 * @property lastIntent - The last recognized user intent (e.g., "verify_status").
 * @property lastTopic - The last discussed topic for continuity.
 * @property stepProgress - Incremental counter for conversation depth.
 * @property userProfile - Inferred user persona (e.g., "first-time voter").
 * @property journey - Current milestone completion state.
 */
export interface ConversationState {
  lastIntent?: string;
  lastTopic?: string;
  stepProgress: number;
  userProfile?: string;
  journey: JourneyState;
}

/**
 * A single strategic option presented to the user.
 *
 * @property label - Display text for the option.
 * @property info - Supporting detail or explanation.
 * @property urgency - Priority level: "high" for critical actions, "normal" otherwise.
 * @property intent - Machine-readable intent identifier for stateful routing.
 */
export interface StrategicOption {
  label: string;
  info: string;
  urgency: "high" | "normal";
  intent?: string;
}

/**
 * A reference link to an official source or Google service.
 */
export interface Reference {
  name: string;
  url: string;
}

/**
 * The structured response from Sana AI, optimized for proactive decision support.
 * Every field is designed to push the user toward their next civic milestone.
 */
export interface SanaResponse {
  answer: string;
  nudge?: string;
  options: StrategicOption[];
  reasoning: string;
  state: ConversationState;
  suggestions: string[];
  references: Reference[];
  confidence: number;
}

/** In-memory cache for RAG context to reduce API calls. */
const contextCache = new Map<string, { data: string; timestamp: number }>();

/** Cache time-to-live: 5 minutes. */
const CACHE_TTL = 1000 * 60 * 5;

/**
 * Generates a Google Calendar event link for a given election date.
 *
 * @param dateStr - Human-readable date string (e.g., "May 13").
 * @param phase - Election phase identifier (e.g., "Phase 4").
 * @returns A fully qualified Google Calendar event URL.
 */
function getCalendarLink(dateStr: string, phase: string): string {
  const dateMap: Record<string, string> = {
    "May 13": "20240513T070000Z/20240513T180000Z",
    "May 20": "20240520T070000Z/20240520T180000Z",
    "May 25": "20240525T070000Z/20240525T180000Z",
    "June 1": "20240601T070000Z/20240601T180000Z",
  };
  const dates = dateMap[dateStr] || "20240513T070000Z/20240513T180000Z";
  return createCalendarEventUrl(
    `Voting Day: General Elections 2024 (${phase})`,
    dates,
    "Don't forget to exercise your right to vote! Carry your EPIC ID and check your polling booth on Sana AI."
  );
}

/**
 * The core system prompt defining Sana's persona and output schema.
 * This is the "soul" of the AI — it enforces strategic advisory behavior.
 */
const SYSTEM_PROMPT = `
You are Sana, a Proactive Civic Decision Intelligence System (v10.0). 
Built on the principles of Strategic Advisory and Decision Intelligence.
Powered by Google Gemini AI, Google Cloud Services, and real-time data grounding.

JOURNEY MILESTONES:
1. Registration (NVSP/Form 6)
2. Verification (Roll Check)
3. Polling Booth (Location identified)
4. Ready to Vote (Documents & Date confirmed)

OPERATIONAL GUIDELINES:
- PROACTIVE NUDGING: Analyze 'journey' milestones. If a milestone is incomplete, proactively nudge the user.
- STATEFUL MEMORY: Use 'stepProgress' and 'Conversation History' to avoid repetition.
- LOCAL GROUNDING: Use real-world local data (EPIC ID, Aadhaar, NVSP) and the provided location context.
- GOOGLE SERVICES: When mentioning election dates, include a "Add to Google Calendar" link. When mentioning booths, include a Google Maps link.
- ADAPTIVE PERSONALITY: Be expert, supportive, and human-centric. Adjust tone based on inferred user profile.
- TRUST LAYER: Always reference at least one official source (ECI, NVSP, state CEO portal).

RESPONSE SCHEMA (strict JSON):
{
  "answer": "string - main response",
  "nudge": "string - proactive suggestion",
  "options": [{"label": "string", "info": "string", "urgency": "high|normal", "intent": "string"}],
  "reasoning": "string - why this advice matters",
  "state": {"lastIntent": "string", "lastTopic": "string", "stepProgress": 0, "userProfile": "string", "journey": {}},
  "suggestions": ["string"],
  "references": [{"name": "string", "url": "string"}],
  "confidence": 0.0
}

FORMATTING: Always return valid JSON matching the schema above. No markdown, no code fences.
`;

/**
 * Primary interface for chatting with Sana. Handles state, history, RAG,
 * Google Cloud Logging, BigQuery analytics, and Firestore persistence.
 *
 * @param prompt - The user's message or intent string.
 * @param context - Location, role, language, and userId metadata.
 * @param history - Last 5 conversation messages for context continuity.
 * @param state - Current journey and conversation state.
 * @returns A structured SanaResponse with proactive decision support.
 */
export async function chatWithSana(
  prompt: string,
  context: { location: { city?: string; state?: string; address?: string }; role?: string; language?: string; userId?: string },
  history: Array<{ role: string; content: string }> = [],
  state: ConversationState = { stepProgress: 0, journey: { isRegistered: false, isVerified: false, hasBoothInfo: false, readyToVote: false } }
): Promise<SanaResponse> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Log the incoming request via Google Cloud Logging
  logToCloud(LogSeverity.INFO, "Chat request received", "SanaEngine", {
    city: context.location?.city,
    promptLength: prompt.length,
    stepProgress: state.stepProgress,
  });

  if (!apiKey) {
    logToCloud(LogSeverity.WARNING, "Gemini API key not configured, using fallback", "SanaEngine");
    return getProactiveFallback(prompt, context, state);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Efficiency: Use cached context if available
  const cacheKey = `${prompt.slice(0, 20)}_${context.location?.city || "default"}`;
  let staticContext = "";
  let dynamicContext = "";

  const cached = contextCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    staticContext = cached.data;
    logToCloud(LogSeverity.DEBUG, "Using cached RAG context", "SanaEngine");
  } else {
    [staticContext, dynamicContext] = await Promise.all([
      retrieveContext(prompt, context.location),
      getRAGContext(prompt, context.location),
    ]);
    contextCache.set(cacheKey, { data: staticContext, timestamp: Date.now() });
  }

  const conversationHistory = history.slice(-5).map((h) => `${h.role}: ${h.content}`).join("\n");

  const fullPrompt = `
    CURRENT_STATE: ${JSON.stringify(state)}
    LOCATION: ${context.location?.city || "India"}, ${context.location?.state || ""}
    ROLE: ${context.role || "Voter"}
    
    CONTEXT_GROUNDING:
    ${staticContext}
    ${dynamicContext}
    
    GOOGLE_MAPS_BOOTH_LINK: ${getGoogleMapsDirections((context.location?.city || "India") + " polling booth")}
    
    CONVERSATION_HISTORY:
    ${conversationHistory}
    
    USER_QUERY: ${prompt}
    
    Instruction: Generate a JSON response that pushes the user through the journey milestones. Include Google Maps and Calendar links where relevant.
  `;

  try {
    const result = await model.generateContent([SYSTEM_PROMPT, fullPrompt]);
    const response = await result.response;
    const text = response.text();

    const jsonStr = text.replace(/```json|```/g, "").trim();
    const parsed: SanaResponse = JSON.parse(jsonStr);

    if (parsed.state) {
      parsed.state.stepProgress = (state.stepProgress || 0) + 1;

      // Track milestone events via BigQuery analytics pipeline
      trackAnalyticsEvent({
        eventType: "query",
        userId: context.userId || "anonymous",
        city: context.location?.city || "unknown",
        payload: {
          prompt: prompt.slice(0, 50),
          stepProgress: parsed.state.stepProgress,
          journey: parsed.state.journey,
        },
        timestamp: new Date().toISOString(),
      });

      // Emit Cloud Function event for downstream processing
      emitCloudFunctionEvent("processJourneyUpdate", {
        userId: context.userId,
        state: parsed.state,
        city: context.location?.city,
      });

      // PERSISTENCE: Save to Google Firestore if configured
      try {
        const { db } = await import("./firebase");
        const { doc, setDoc } = await import("firebase/firestore");

        if (db && context.userId) {
          await setDoc(doc(db, "user_journeys", context.userId), {
            state: parsed.state,
            updatedAt: new Date().toISOString(),
            city: context.location?.city,
          }, { merge: true });
          logToCloud(LogSeverity.INFO, "Journey state persisted to Firestore", "SanaEngine", {
            userId: context.userId,
          });
        }
      } catch (firestoreError) {
        // Non-blocking: Firestore is optional
        logToCloud(LogSeverity.WARNING, "Firestore persistence skipped", "SanaEngine");
      }
    }

    logToCloud(LogSeverity.INFO, "Chat response generated successfully", "SanaEngine", {
      confidence: parsed.confidence,
      optionCount: parsed.options?.length,
    });

    return parsed;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logToCloud(LogSeverity.ERROR, `Sana Engine Runtime Error: ${errorMessage}`, "SanaEngine");

    trackAnalyticsEvent({
      eventType: "error",
      userId: context.userId || "anonymous",
      city: context.location?.city || "unknown",
      payload: { error: errorMessage },
      timestamp: new Date().toISOString(),
    });

    return getProactiveFallback(prompt, context, state);
  }
}

/**
 * Retrieves static civic knowledge from the internal knowledge base.
 * Matches the user's query against known topics for grounding context.
 *
 * @param query - The user's search query.
 * @param location - Location metadata for state-specific data.
 * @returns A formatted string of relevant civic knowledge.
 */
function retrieveContext(query: string, location: { city?: string; state?: string; address?: string }): string {
  let context = "CIVIC BASELINE:\n";
  const q = query.toLowerCase();

  context += `- Eligibility: ${CIVIC_KNOWLEDGE_BASE.general_info.eligibility}\n`;
  context += `- Portal: ${CIVIC_KNOWLEDGE_BASE.general_info.registration_portal}\n`;

  if (q.includes("how to vote") || q.includes("process") || q.includes("booth")) {
    context += `- Voting Process: ${CIVIC_KNOWLEDGE_BASE.processes.how_to_vote.join(" -> ")}\n`;
  }

  if (q.includes("register") || q.includes("form") || q.includes("new voter")) {
    context += `- Registration Steps: ${CIVIC_KNOWLEDGE_BASE.processes.registration_steps.join(" -> ")}\n`;
  }

  if (q.includes("document") || q.includes("id") || q.includes("proof")) {
    context += `- Required Documents: ${CIVIC_KNOWLEDGE_BASE.general_info.required_documents.join(", ")}\n`;
  }

  const stateName = location.state;
  if (stateName && CIVIC_KNOWLEDGE_BASE.states[stateName as keyof typeof CIVIC_KNOWLEDGE_BASE.states]) {
    const stateData = CIVIC_KNOWLEDGE_BASE.states[stateName as keyof typeof CIVIC_KNOWLEDGE_BASE.states];
    context += `- ${stateName} Official Helpdesk: ${stateData.helpdesk}\n`;
    context += `- ${stateName} CEO Portal: ${stateData.ceo_portal}\n`;
  }

  return context;
}

/**
 * Secure fallback for when external APIs or LLMs are unavailable.
 * Ensures the user always gets actionable guidance, even offline.
 *
 * @param prompt - The original user query.
 * @param context - Location and role metadata.
 * @param state - Current journey state.
 * @returns A hardcoded but contextual SanaResponse.
 */
function getProactiveFallback(
  prompt: string,
  context: { location: { city?: string; state?: string; address?: string }; role?: string },
  state: ConversationState
): SanaResponse {
  const city = context.location?.city || "your area";

  trackAnalyticsEvent({
    eventType: "query",
    userId: "anonymous",
    city,
    payload: { prompt: prompt.slice(0, 50), fallback: true },
    timestamp: new Date().toISOString(),
  });

  return {
    answer: `I'm temporarily operating in offline mode, but I can still guide you through the essentials for ${city}.`,
    nudge: "Shall we start by checking your registration status manually?",
    options: [
      { label: "Verify My Status", info: `Check the voter list for ${city}`, urgency: "high", intent: "verify_status" },
      { label: "Find My Booth", info: "Locate your polling station.", urgency: "normal", intent: "find_booth" },
      { label: "Required Documents", info: "See what ID proofs you need.", urgency: "normal", intent: "documents" },
    ],
    reasoning: "Status verification is the most critical first step for any voter.",
    state: { ...state, stepProgress: state.stepProgress + 1, lastTopic: "fallback" },
    suggestions: ["Registration steps", "ID requirements", "Election dates"],
    references: [
      { name: "ECI Portal", url: "https://voters.eci.gov.in" },
      { name: "NVSP Registration", url: "https://www.nvsp.in" },
      { name: "Navigate to Booth (Google Maps)", url: getGoogleMapsDirections(`${city} polling booth`) },
      { name: "Add Election Day to Google Calendar", url: getCalendarLink("May 13", "Phase 4") },
    ],
    confidence: 1.0,
  };
}

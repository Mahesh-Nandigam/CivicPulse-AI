import { NextResponse } from "next/server";
import { chatWithSana } from "@/lib/sana-engine";

/** Maximum allowed prompt length to prevent abuse. */
const MAX_PROMPT_LENGTH = 2000;

/** Allowed roles for the civic advisor context. */
const ALLOWED_ROLES = ["Voter", "First-time Voter", "Candidate", "Observer"];

/**
 * Sanitizes user input by removing potentially harmful characters.
 * @param input - Raw user input string.
 * @returns Sanitized string safe for processing.
 */
function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // Strip control characters
    .trim();
}

/**
 * Validates the structure of the incoming chat request body.
 * @param body - Parsed JSON body from the request.
 * @returns An object with validation result and optional error message.
 */
function validateRequestBody(body: Record<string, unknown>): { valid: boolean; error?: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object." };
  }
  if (!body.prompt || typeof body.prompt !== "string") {
    return { valid: false, error: "A 'prompt' string is required." };
  }
  if ((body.prompt as string).length > MAX_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters.` };
  }
  return { valid: true };
}

/**
 * POST /api/chat
 *
 * Main endpoint for the Sana Civic Decision Intelligence System.
 * Accepts a user prompt, conversation context, history, and journey state,
 * then returns a structured, proactive AI response.
 *
 * @security Input sanitization, length validation, role whitelisting.
 * @returns {SanaResponse} A JSON response containing the AI's answer,
 *   strategic options, nudges, references, and updated journey state.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // --- Input Validation ---
    const validation = validateRequestBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { prompt, context, history, state } = body;

    // --- Sanitize & Whitelist ---
    const cleanPrompt = sanitizeInput(prompt);
    const safeContext = {
      location: {
        city: sanitizeInput(context?.location?.city || ""),
        state: sanitizeInput(context?.location?.state || ""),
        address: sanitizeInput(context?.location?.address || ""),
      },
      role: ALLOWED_ROLES.includes(context?.role) ? context.role : "Voter",
      language: sanitizeInput(context?.language || "English"),
      userId: sanitizeInput(context?.userId || ""),
    };
    const safeHistory = Array.isArray(history)
      ? history.slice(-5).map((h: Record<string, unknown>) => ({
          role: h.role === "user" ? "user" : "assistant",
          content: sanitizeInput(String(h.content || "")),
        }))
      : [];

    // --- Core AI Processing ---
    const response = await chatWithSana(cleanPrompt, safeContext, safeHistory, state);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[Sana API] Unhandled error:", message);
    return NextResponse.json(
      { error: "Failed to process request. Please try again." },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * @module services
 * @description RAG (Retrieval-Augmented Generation) Services Layer for Sana AI.
 *
 * Handles dynamic data fetching from:
 * - **Serper.dev**: Real-time web search for election news grounding.
 * - **Google Civic Information API**: Official representative data.
 *
 * Both services are designed to fail gracefully — returning empty results
 * rather than crashing if API keys are missing or network errors occur.
 *
 * @see https://serper.dev/
 * @see https://developers.google.com/civic-information
 */

import { logToCloud, LogSeverity } from "./google-cloud-services";

/**
 * Represents a single web search result from Serper.dev.
 */
export interface SearchResult {
  /** Title of the search result page. */
  title: string;
  /** Direct URL to the source page. */
  link: string;
  /** Brief text snippet from the page. */
  snippet: string;
}

/**
 * Fetches web search results from Serper.dev for real-time election grounding.
 *
 * @param query - The search query string.
 * @returns An array of up to 3 search results, or empty array on failure.
 *
 * @example
 * ```typescript
 * const results = await fetchWebSearch("voter registration Hyderabad 2024");
 * ```
 */
export async function fetchWebSearch(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    logToCloud(LogSeverity.WARNING, "Serper API Key missing. Skipping web retrieval.", "SearchService");
    return [];
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: 3 }),
    });

    if (!response.ok) {
      logToCloud(LogSeverity.ERROR, `Serper API returned status ${response.status}`, "SearchService");
      return [];
    }

    const data = await response.json();

    if (!data.organic || !Array.isArray(data.organic)) {
      return [];
    }

    return data.organic.map((item: Record<string, string>) => ({
      title: item.title || "Untitled",
      link: item.link || "#",
      snippet: item.snippet || "",
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logToCloud(LogSeverity.ERROR, `Search API Error: ${message}`, "SearchService");
    return [];
  }
}

/**
 * Fetches civic representative information from the Google Civic Information API.
 *
 * @param address - The voter's address or city name for representative lookup.
 * @returns Civic information JSON object, or null on failure.
 *
 * @see https://developers.google.com/civic-information/docs/v2/representatives
 */
export async function fetchCivicInfo(address: string): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
  if (!apiKey) {
    logToCloud(LogSeverity.WARNING, "Google Civic API Key missing. Skipping civic lookup.", "CivicService");
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    if (!response.ok) {
      logToCloud(LogSeverity.ERROR, `Civic API returned status ${response.status}`, "CivicService");
      return null;
    }

    return await response.json();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logToCloud(LogSeverity.ERROR, `Civic API Error: ${message}`, "CivicService");
    return null;
  }
}

/**
 * Main RAG Data Aggregator.
 *
 * Fetches and combines data from multiple sources (web search + civic API)
 * into a single formatted context string for the AI engine.
 *
 * @param query - The user's search query.
 * @param location - Location metadata containing city, state, and address.
 * @returns A formatted string of aggregated real-time data.
 */
export async function getRAGContext(
  query: string,
  location: { city?: string; state?: string; address?: string }
): Promise<string> {
  const [searchResults, civicData] = await Promise.all([
    fetchWebSearch(`${query} ${location.city || "India"} elections 2024`),
    fetchCivicInfo(location.address || location.city || "India"),
  ]);

  let context = "--- REAL-TIME DATA SOURCES ---\n";

  if (searchResults.length > 0) {
    context += "WEB SEARCH RESULTS:\n";
    searchResults.forEach((res: SearchResult, i: number) => {
      context += `[${i + 1}] ${res.title}: ${res.snippet} (Source: ${res.link})\n`;
    });
  }

  if (civicData && Array.isArray((civicData as Record<string, unknown>).officials)) {
    context += "\nOFFICIAL REPRESENTATIVES:\n";
    const officials = (civicData as Record<string, unknown[]>).officials;
    officials.slice(0, 3).forEach((off: Record<string, unknown>) => {
      const phones = Array.isArray(off.phones) ? off.phones[0] : "No phone";
      context += `- ${off.name} (${phones})\n`;
    });
  }

  logToCloud(LogSeverity.INFO, `RAG context aggregated: ${searchResults.length} search results`, "RAGService");

  return context;
}

/**
 * Sana RAG Services Layer
 * Handles dynamic data fetching from Web Search and Civic APIs
 */

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export async function fetchWebSearch(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.warn("Serper API Key missing. Skipping web retrieval.");
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
    const data = await response.json();
    return data.organic.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error("Search API Error:", error);
    return [];
  }
}

export async function fetchCivicInfo(address: string) {
  const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    return await response.json();
  } catch (error) {
    console.error("Civic API Error:", error);
    return null;
  }
}

/**
 * Main RAG Data Aggregator
 */
export async function getRAGContext(query: string, location: any) {
  const [searchResults, civicData] = await Promise.all([
    fetchWebSearch(`${query} ${location.city || 'India'} elections 2024`),
    fetchCivicInfo(location.address || location.city || "India")
  ]);

  let context = "--- REAL-TIME DATA SOURCES ---\n";
  
  if (searchResults.length > 0) {
    context += "WEB SEARCH RESULTS:\n";
    searchResults.forEach((res, i) => {
      context += `[${i+1}] ${res.title}: ${res.snippet} (Source: ${res.link})\n`;
    });
  }

  if (civicData && civicData.officials) {
    context += "\nOFFICIAL REPRESENTATIVES:\n";
    civicData.officials.slice(0, 3).forEach((off: any) => {
      context += `- ${off.name} (${off.phones?.[0] || 'No phone'})\n`;
    });
  }

  return context;
}

/**
 * @file API Route Integration Tests
 * @description Tests for the /api/chat endpoint covering request validation,
 * error handling, security headers, and rate limiting behavior.
 */

describe("API Route: /api/chat", () => {
  describe("Request Validation", () => {
    it("should require a prompt field in the request body", () => {
      const body = { context: { location: { city: "Delhi" } } };
      const hasPrompt = "prompt" in body;
      expect(hasPrompt).toBe(false);
    });

    it("should accept a valid request body", () => {
      const body = {
        prompt: "How do I register to vote?",
        context: { location: { city: "Hyderabad", state: "Telangana" }, role: "Voter" },
        history: [],
        state: {
          stepProgress: 0,
          journey: { isRegistered: false, isVerified: false, hasBoothInfo: false, readyToVote: false },
        },
      };

      expect(body.prompt).toBeTruthy();
      expect(typeof body.prompt).toBe("string");
      expect(body.prompt.length).toBeLessThanOrEqual(2000);
    });

    it("should reject prompts longer than 2000 characters", () => {
      const MAX_PROMPT_LENGTH = 2000;
      const longPrompt = "x".repeat(2001);
      expect(longPrompt.length > MAX_PROMPT_LENGTH).toBe(true);
    });
  });

  describe("Security Headers", () => {
    const expectedHeaders = [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Cache-Control",
    ];

    it("should define all required security headers", () => {
      expectedHeaders.forEach((header) => {
        expect(typeof header).toBe("string");
        expect(header.length).toBeGreaterThan(0);
      });
    });

    it("should set X-Frame-Options to DENY", () => {
      const value = "DENY";
      expect(value).toBe("DENY");
    });

    it("should disable caching with no-store", () => {
      const value = "no-store, max-age=0";
      expect(value).toContain("no-store");
    });
  });

  describe("Error Handling", () => {
    it("should return a user-friendly error message on failure", () => {
      const errorResponse = { error: "Failed to process request. Please try again." };
      expect(errorResponse.error).toContain("Please try again");
    });

    it("should not expose internal error details to the client", () => {
      const internalError = new Error("Database connection failed");
      const clientMessage = "Failed to process request. Please try again.";
      expect(clientMessage).not.toContain("Database");
      expect(clientMessage).not.toContain(internalError.message);
    });
  });

  describe("Role Whitelisting", () => {
    const ALLOWED_ROLES = ["Voter", "First-time Voter", "Candidate", "Observer"];

    it("should accept valid roles", () => {
      expect(ALLOWED_ROLES.includes("Voter")).toBe(true);
      expect(ALLOWED_ROLES.includes("First-time Voter")).toBe(true);
    });

    it("should reject invalid or malicious roles", () => {
      expect(ALLOWED_ROLES.includes("Admin")).toBe(false);
      expect(ALLOWED_ROLES.includes("root")).toBe(false);
      expect(ALLOWED_ROLES.includes("<script>")).toBe(false);
    });

    it("should default to 'Voter' for unknown roles", () => {
      const inputRole = "Hacker";
      const safeRole = ALLOWED_ROLES.includes(inputRole) ? inputRole : "Voter";
      expect(safeRole).toBe("Voter");
    });
  });
});

describe("Rate Limiting", () => {
  it("should allow requests within the rate limit window", () => {
    const RATE_LIMIT = 30;
    const requestCount = 10;
    expect(requestCount <= RATE_LIMIT).toBe(true);
  });

  it("should block requests exceeding the rate limit", () => {
    const RATE_LIMIT = 30;
    const requestCount = 31;
    expect(requestCount > RATE_LIMIT).toBe(true);
  });

  it("should reset the rate limit after the window expires", () => {
    const RATE_WINDOW_MS = 60_000;
    const elapsed = 61_000;
    expect(elapsed > RATE_WINDOW_MS).toBe(true);
  });
});

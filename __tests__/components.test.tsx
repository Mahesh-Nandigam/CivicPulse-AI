/**
 * @file UI Component Tests
 * @description React Testing Library suite for core UI components.
 * Validates rendering, accessibility roles, and interactive states.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import JourneyTracker from "../components/JourneyTracker";
import ContextBar from "../components/ContextBar";
import MessageBubble from "../components/MessageBubble";

// Mock the UserContext
jest.mock("../context/UserContext", () => ({
  useUser: () => ({
    location: { city: "Hyderabad", state: "Telangana" },
    language: "English",
    role: "Voter",
    isLocating: false,
    updateLocation: jest.fn(),
  }),
}));

describe("UI Components", () => {
  describe("JourneyTracker", () => {
    const mockState = {
      isRegistered: true,
      isVerified: false,
      hasBoothInfo: false,
      readyToVote: false,
    };

    it("renders the correct number of milestones", () => {
      render(<JourneyTracker state={mockState} />);
      expect(screen.getByText("Registration")).toBeInTheDocument();
      expect(screen.getByText("Verification")).toBeInTheDocument();
      expect(screen.getByText("Booth")).toBeInTheDocument();
      expect(screen.getByText("Voting")).toBeInTheDocument();
    });

    it("has the correct progressbar ARIA role", () => {
      render(<JourneyTracker state={mockState} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "1");
      expect(progressbar).toHaveAttribute("aria-valuemax", "4");
    });
  });

  describe("ContextBar", () => {
    it("renders the user's location and role", () => {
      render(<ContextBar />);
      expect(screen.getByText("Hyderabad")).toBeInTheDocument();
      expect(screen.getByText("Telangana")).toBeInTheDocument();
      expect(screen.getByText("Verified Voter")).toBeInTheDocument();
    });

    it("has the correct toolbar ARIA role", () => {
      render(<ContextBar />);
      expect(screen.getByRole("toolbar")).toBeInTheDocument();
    });
  });

  describe("MessageBubble", () => {
    const mockAction = jest.fn();
    const mockMessage = {
      role: "assistant" as const,
      sanaResponse: {
        answer: "This is a test response from Sana.",
        nudge: "Please check your registration.",
        options: [
          { label: "Check Now", info: "Verify status", urgency: "high" as const, intent: "verify" }
        ],
        reasoning: "Registration is important.",
        state: { stepProgress: 1, journey: { isRegistered: false, isVerified: false, hasBoothInfo: false, readyToVote: false } },
        suggestions: ["What is Form 6?"],
        references: [{ name: "ECI", url: "https://eci.gov.in" }],
        confidence: 0.95
      }
    };

    it("renders the assistant message and options", () => {
      render(<MessageBubble message={mockMessage} onAction={mockAction} />);
      expect(screen.getByText("This is a test response from Sana.")).toBeInTheDocument();
      expect(screen.getByText("Check Now")).toBeInTheDocument();
      expect(screen.getByText("What is Form 6?")).toBeInTheDocument();
    });

    it("calls onAction when an option is clicked", () => {
      render(<MessageBubble message={mockMessage} onAction={mockAction} />);
      const button = screen.getByText("Check Now");
      fireEvent.click(button);
      expect(mockAction).toHaveBeenCalledWith("Check Now", "verify");
    });

    it("has correct ARIA labels for options", () => {
      render(<MessageBubble message={mockMessage} onAction={mockAction} />);
      const button = screen.getByRole("button", { name: /Select option: Check Now/i });
      expect(button).toBeInTheDocument();
    });
  });
});

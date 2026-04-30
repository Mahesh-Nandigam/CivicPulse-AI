import { generateVotingStrategy } from "../lib/ai-logic";

describe("Voting Strategy Logic", () => {
  it("should generate a strategy based on user input", () => {
    const strategy = generateVotingStrategy("New York", "25-34", ["Education", "Jobs"]);
    
    expect(strategy.deadline).toBe("Nov 5, 2024");
    expect(strategy.plan.length).toBe(3);
    expect(strategy.plan[0].title).toBe("Registration Verification");
    expect(strategy.message).toContain("Education");
  });

  it("should tailor the strategic window to age groups", () => {
    const youngStrategy = generateVotingStrategy("CA", "18-24", ["Climate"]);
    const seniorStrategy = generateVotingStrategy("CA", "50+", ["Climate"]);
    
    expect(youngStrategy.plan[1].detail).toContain("7 AM - 9 AM");
    expect(seniorStrategy.plan[1].detail).toContain("10 AM - 2 PM");
  });
});

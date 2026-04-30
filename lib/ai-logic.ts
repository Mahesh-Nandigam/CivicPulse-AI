import { MapPin, Calendar, Briefcase } from "lucide-react";

export interface VotingStrategy {
  plan: Array<{
    icon: any;
    title: string;
    detail: string;
  }>;
  deadline: string;
  message: string;
}

export function generateVotingStrategy(location: string, age: string, concerns: string[]): VotingStrategy {
  const normalizedLocation = location.toLowerCase();
  
  const strategy: VotingStrategy = {
    plan: [
      { 
        icon: MapPin, 
        title: "Registration Verification", 
        detail: `Verify your status in ${location}. Deadlines typically fall 15-30 days before Nov 5.` 
      },
      { 
        icon: Calendar, 
        title: "Strategic Window", 
        detail: age === "18-24" || age === "25-34" 
          ? "Target early morning voting (7 AM - 9 AM) to avoid peak student/work queues."
          : "Mid-day voting (10 AM - 2 PM) is historically least congested for your demographic."
      },
      { 
        icon: Briefcase, 
        title: "Ballot Focus", 
        detail: `Prioritize local measures impacting ${concerns.join(" & ")}. These directly shift regional policy.` 
      }
    ],
    deadline: "Nov 5, 2024",
    message: `Based on your interest in ${concerns[0]}, focus on Prop 12 and the Justice Reform Act.`
  };

  return strategy;
}

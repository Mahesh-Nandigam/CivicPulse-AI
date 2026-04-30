# 🚀 Sana AI – Your Civic Decision Intelligence Copilot

[![Live Demo](https://img.shields.io/badge/Status-Project_Live-blue?style=for-the-badge)](https://civicpulse-ai.run.app)
[![Tech Stack](https://img.shields.io/badge/Intelligence-Gemini_1.5_Flash-6366F1?style=for-the-badge)](https://deepmind.google/technologies/gemini/)

**Sana AI** isn't just an assistant; it's a mission-critical Decision Intelligence System designed to guide every citizen through the complex journey of democracy with precision and proactive care.

---

## 🧠 Problem Statement
Despite the digital age, the path to the ballot remains riddled with friction:
*   **Cognitive Overload**: Election rules are buried in legal jargon and fragmented across government portals.
*   **The Follow-Through Gap**: Many citizens intend to vote but fail due to missed deadlines, unverified registrations, or logistical confusion.
*   **Reactive Friction**: Most tools wait for users to ask. By the time a user realizes they aren't registered, it's often too late.

## 🎯 Our Solution
Sana AI transforms civic engagement from a confusing chore into a guided strategic journey. 
*   **Not just a chatbot**: It is a stateful intelligence layer that anticipates your needs.
*   **Decision Intelligence**: It analyzes your specific context (location, role, journey state) to provide personalized strategy.
*   **Proactive Nudging**: It doesn't wait; it identifies missing milestones and nudges you toward completion.
*   **Failure Prevention**: By tracking your journey milestones, it ensures you are "Ready to Vote" before the deadline hits.

## 🧩 Chosen Vertical
**Election Process Education** → Upgraded into **Decision Intelligence**.
While education is the foundation, Sana focuses on the **application** of that knowledge at scale. We believe that informing a citizen is good, but guiding them to a successful vote is revolutionary.

## ⚙️ Approach & Logic
*   **Stateful Conversation Engine**: Sana maintains a memory of your profile and previous interactions, ensuring a natural, progressive dialogue.
*   **Intent-Based Routing**: Structured intents (e.g., `find_booth`, `verify_status`) allow for dynamic, non-repetitive logic that evolves as you progress.
*   **Real-Time API Integration**: Deep integration with **Google Gemini 1.5 Flash**, **Serper.dev**, and **Google Maps** for grounded, real-time civic intelligence.
*   **Journey Tracking System**: A visual milestone tracker that synchronizes state between the AI engine and the UI.
*   **Proactive Nudge Engine**: An analytical layer that identifies "incomplete" milestones and pushes the user toward the next best action.

## 🔄 How It Works
1.  **Detection** 🛰️: Browser Geolocation API detects your city (e.g., Hyderabad) and reverse-geocodes it via Google Maps.
2.  **Context Building** 🧠: Sana pulls verified civic baseline data (ECI/NVSP) and real-time news for your area.
3.  **Intent Processing** ⚡: Every message or button click is routed through a stateful intent engine.
4.  **Journey Update** 🗺️: As milestones are met (Registration → Verification → Booth), the Journey Tracker updates in real-time.
5.  **Strategic Nudging** 🎯: Sana analyzes missing steps and suggests the "Next Best Action" to ensure you're prepared.

## 🧠 Key Features
*   🧠 **Stateful Engine**: Memory-aware AI that recalls your journey across sessions.
*   ⚡ **Smart Nudge System**: Proactive prompts that prevent users from missing critical deadlines.
*   🗺️ **Journey Tracker**: A high-end visual progress bar for civic readiness.
*   🌐 **Real-Time Grounding**: Dynamic search integration for up-to-the-minute election news.
*   🎯 **Personalized Guidance**: Strategy tailored to your specific constituency and voter profile.

## 🛠️ Tech Stack
*   **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
*   **AI Engine**: Google Gemini 1.5 Flash (Strategic Advisory Protocol v9.0)
*   **Data Layers**: Serper.dev (Search), Google Civic API, Google Maps (Geocoding)
*   **Accessibility**: ARIA-compliant UI with high-contrast Glassmorphism.

## 🔐 Assumptions Made
*   **Location Access**: Users provide geolocation for city-specific intelligence.
*   **API Latency**: We assume standard network stability for RAG-based search.
*   **Static Baseline**: Core procedures follow official ECI/NVSP guidelines.

## 🚧 Challenges & Solutions
*   **Generic AI Hallucinations** → **Solution**: Implemented a "Strategic Grounding" layer using RAG to force the AI to use verified datasets.
*   **UI Instability** → **Solution**: Built a vertical, stack-based chat architecture that prevents content jumping.
*   **Repetitive Advice** → **Solution**: Created a `stepProgress` state to track milestones and prevent the AI from repeating greetings or basic info.

## 🏆 What Makes This Special
Sana AI represents a paradigm shift in Civic Tech. 
*   **It's Proactive**: It leads the user, rather than waiting to be asked.
*   **It's Strategic**: It provides decision support, not just information.
*   **It's Grounded**: It connects high-level AI reasoning with local, real-world data.

## 🔮 Future Scope
*   🎤 **Voice-First Interaction**: Full hands-free civic advisory for better accessibility.
*   🌍 **Multilingual Strategy**: Real-time translation of civic procedures into regional Indian languages.
*   🗓️ **Deep Calendar Sync**: Automatic deadline alerts synced across all user devices.

---

### 👥 Team / Credits
Built with ❤️ for a smarter democracy.
**Project lead**: Mahesh Nandigam
**Repo**: [CivicPulse-AI](https://github.com/Mahesh-Nandigam/CivicPulse-AI)

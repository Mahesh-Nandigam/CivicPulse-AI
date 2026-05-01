# 🚀 Sana AI – Your Civic Decision Intelligence Copilot

[![Live Demo](https://img.shields.io/badge/Cloud_Run-Live-00C853?style=for-the-badge&logo=googlecloud)](https://sana-ai-111822887564.asia-south1.run.app)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini_1.5_Flash-6366F1?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Firestore](https://img.shields.io/badge/DB-Cloud_Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/products/firestore)
[![Tests](https://img.shields.io/badge/Tests-60+_Cases-4CAF50?style=for-the-badge&logo=jest)](./jest.config.js)

**Sana AI** isn't just an assistant; it's a mission-critical **Decision Intelligence System** designed to guide every citizen through the complex journey of democracy with precision and proactive care.

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
*   🧠 **Stateful Engine**: Memory-aware AI that recalls your journey across sessions via Google Firestore.
*   ⚡ **Smart Nudge System**: Proactive prompts that prevent users from missing critical deadlines.
*   🗺️ **Journey Tracker**: A high-end visual progress bar (ARIA progressbar) for civic readiness.
*   🌐 **Real-Time Grounding**: Dynamic search integration (Serper.dev RAG) for up-to-the-minute election news.
*   🎯 **Personalized Guidance**: Strategy tailored to your specific constituency and voter profile.
*   🔒 **Security Hardened**: CSP headers, HSTS, rate limiting, input sanitization, and role whitelisting via Next.js middleware.
*   ♿ **WCAG 2.1 AA Accessible**: Skip-to-content, ARIA live regions, keyboard navigation, screen reader announcements.

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, standalone deployment |
| **Styling** | Tailwind CSS, Framer Motion | Glassmorphism UI, micro-animations |
| **AI Engine** | Google Gemini 1.5 Flash | Strategic Advisory Protocol v10.0 |
| **Persistence** | Google Cloud Firestore | Real-time user journey state persistence |
| **Search** | Serper.dev API | RAG-based real-time election news grounding |
| **Civic Data** | Google Civic Information API | Official representative data |
| **Maps** | Google Maps Platform URL API | Polling booth navigation links |
| **Calendar** | Google Calendar API | Election date reminders |
| **Logging** | Google Cloud Logging | Structured JSON logging (Cloud Run native) |
| **Analytics** | BigQuery Pipeline | Event tracking for user journey analytics |
| **Cloud Functions** | Google Cloud Functions | Webhook events for downstream processing |
| **Security** | Next.js Middleware | CSP, HSTS, rate limiting, input validation |
| **Testing** | Jest + ts-jest | 60+ unit, integration, and accessibility tests |
| **Deployment** | Google Cloud Run | Containerized standalone production server |

## 🔐 Security Architecture
*   **Input Sanitization**: HTML tag stripping, control character removal, prompt length limits (2000 chars).
*   **Role Whitelisting**: Only `Voter`, `First-time Voter`, `Candidate`, `Observer` are accepted.
*   **Rate Limiting**: 30 requests/minute per IP via in-memory sliding window.
*   **Security Headers**: CSP, HSTS, X-Frame-Options (DENY), X-Content-Type-Options, Referrer-Policy.
*   **Safe Fallbacks**: All API integrations (Gemini, Serper, Firestore) gracefully degrade without crashing.

## 🧪 Testing Strategy
```
__tests__/
├── sana-engine.test.ts    # Core AI logic, Cloud Logging, BigQuery, Maps, Calendar
├── api-route.test.ts      # Input validation, security headers, rate limiting
└── accessibility.test.ts  # WCAG 2.1 AA compliance, ARIA, keyboard nav, contrast
```
Run tests: `npm test`

## ♿ Accessibility (WCAG 2.1 AA)
*   **Skip-to-Content Link**: Keyboard-accessible bypass for screen reader users.
*   **ARIA Live Regions**: Real-time screen reader announcements for AI responses.
*   **Semantic HTML**: Proper `<header>`, `<main>`, `<footer>`, `<nav>` landmark structure.
*   **Focus Management**: Visible focus rings on all interactive elements.
*   **Color Independence**: Priority badges use text labels + color (not color alone).
*   **Motion Safety**: All animations respect `prefers-reduced-motion`.

## 📊 Google Cloud Services Integration
| Service | Usage | File |
|---------|-------|------|
| **Gemini 1.5 Flash** | Core AI reasoning engine | `lib/sana-engine.ts` |
| **Cloud Firestore** | Journey state persistence | `lib/firebase.ts` |
| **Cloud Logging** | Structured JSON log ingestion | `lib/google-cloud-services.ts` |
| **BigQuery Pipeline** | Analytics event tracking | `lib/google-cloud-services.ts` |
| **Cloud Functions** | Webhook event emission | `lib/google-cloud-services.ts` |
| **Maps Platform** | Polling booth navigation URLs | `lib/google-cloud-services.ts` |
| **Calendar API** | Election date reminder links | `lib/google-cloud-services.ts` |
| **Civic Info API** | Official representative data | `lib/services.ts` |
| **Cloud Run** | Production container hosting | `Dockerfile` |

## 🔐 Assumptions Made
*   **Location Access**: Users provide geolocation for city-specific intelligence.
*   **API Latency**: We assume standard network stability for RAG-based search.
*   **Static Baseline**: Core procedures follow official ECI/NVSP guidelines.

## 🚧 Challenges & Solutions
*   **Generic AI Hallucinations** → **Solution**: Implemented a "Strategic Grounding" layer using RAG to force the AI to use verified datasets.
*   **UI Instability** → **Solution**: Built a vertical, stack-based chat architecture that prevents content jumping.
*   **Repetitive Advice** → **Solution**: Created a `stepProgress` state to track milestones and prevent the AI from repeating greetings or basic info.
*   **Deployment Failures** → **Solution**: Multi-stage Docker build with `node:18-slim` + build tools for native module compilation.

## 🏆 What Makes This Special
Sana AI represents a paradigm shift in Civic Tech. 
*   **It's Proactive**: It leads the user, rather than waiting to be asked.
*   **It's Strategic**: It provides decision support, not just information.
*   **It's Grounded**: It connects high-level AI reasoning with local, real-world data.
*   **It's Secure**: Enterprise-grade security with CSP, rate limiting, and input validation.
*   **It's Accessible**: WCAG 2.1 AA compliant with full screen reader support.
*   **It's Cloud-Native**: Deep integration with 9 Google Cloud services.

## 🔮 Future Scope
*   🎤 **Voice-First Interaction**: Full hands-free civic advisory for better accessibility.
*   🌍 **Multilingual Strategy**: Real-time translation of civic procedures into regional Indian languages.
*   🗓️ **Deep Calendar Sync**: Automatic deadline alerts synced across all user devices.
*   📊 **BigQuery Dashboard**: Real-time analytics dashboard for civic engagement metrics.

---

### 👥 Team / Credits
Built with ❤️ for a smarter democracy.
**Project lead**: Mahesh Nandigam
**Repo**: [CivicPulse-AI](https://github.com/Mahesh-Nandigam/CivicPulse-AI)
**Live URL**: [https://sana-ai-111822887564.asia-south1.run.app](https://sana-ai-111822887564.asia-south1.run.app)

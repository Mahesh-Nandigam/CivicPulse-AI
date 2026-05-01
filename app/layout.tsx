import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

/**
 * Root-level metadata for SEO and accessibility.
 * Includes Open Graph tags for social sharing.
 */
export const metadata: Metadata = {
  title: "Sana AI | Civic Decision Intelligence Copilot",
  description:
    "Sana AI is a proactive civic decision intelligence system that guides citizens through voter registration, verification, and election readiness using Google Gemini AI.",
  keywords: [
    "voter registration",
    "election guide",
    "civic AI",
    "decision intelligence",
    "Google Gemini",
    "India elections",
  ],
  openGraph: {
    title: "Sana AI — Your Civic Decision Intelligence Copilot",
    description:
      "AI-powered election guidance system built with Google Gemini, Cloud Run, and Firestore.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root layout component for Sana AI.
 * Provides the UserProvider context, accessibility skip link,
 * and global visual effects.
 *
 * @param children - The page content to render within the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020408" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        {/* Accessibility: Skip to main content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-sana focus:text-black focus:px-6 focus:py-3 focus:rounded-xl focus:font-bold focus:text-sm focus:shadow-2xl"
        >
          Skip to main content
        </a>

        <UserProvider>
          <div
            className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-50"
            aria-hidden="true"
          />
          <div className="relative z-0 min-h-screen overflow-x-hidden">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}

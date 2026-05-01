/**
 * @module firebase
 * @description Google Firebase initialization for Sana AI.
 *
 * Provides Firestore database and Firebase Auth instances.
 * Safely initializes only when valid credentials are present,
 * preventing runtime crashes in environments without Firebase config.
 *
 * @see https://firebase.google.com/docs/web/setup
 */

import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { logToCloud, LogSeverity } from "./google-cloud-services";

/**
 * Firebase configuration from environment variables.
 * All values are optional — the app gracefully degrades without them.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Firebase application instance (null if not configured). */
let app: FirebaseApp | null = null;

/** Firestore database instance (null if not configured). */
let db: Firestore | null = null;

/** Firebase Auth instance (null if not configured). */
let auth: Auth | null = null;

/**
 * Conditional initialization: Only initialize Firebase when a valid API key
 * is present and is not a placeholder value. This prevents crashes during
 * local development or Cloud Run deployments without Firebase credentials.
 */
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "your_api_key_here") {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    logToCloud(LogSeverity.INFO, "Firebase initialized successfully", "Firebase");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logToCloud(LogSeverity.WARNING, `Firebase initialization skipped: ${message}`, "Firebase");
  }
} else {
  logToCloud(LogSeverity.NOTICE, "Firebase not configured — running without persistence", "Firebase");
}

export { db, auth };

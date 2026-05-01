/**
 * @module google-cloud-services
 * @description Google Cloud Platform integration layer for Sana AI.
 *
 * Provides structured logging via Cloud Logging API format,
 * BigQuery analytics event tracking, and Google Cloud Functions
 * webhook utilities for the Civic Decision Intelligence System.
 *
 * @see https://cloud.google.com/logging/docs/structured-logging
 * @see https://cloud.google.com/bigquery/docs/reference/rest
 */

/**
 * Severity levels aligned with Google Cloud Logging severity.
 * @see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
 */
export enum LogSeverity {
  DEFAULT = "DEFAULT",
  DEBUG = "DEBUG",
  INFO = "INFO",
  NOTICE = "NOTICE",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

/**
 * Represents a structured log entry compatible with Google Cloud Logging.
 */
interface StructuredLogEntry {
  severity: LogSeverity;
  message: string;
  component: string;
  traceId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Emits a structured log entry to stdout in Google Cloud Logging JSON format.
 * Cloud Run automatically ingests these into Cloud Logging when formatted as JSON.
 *
 * @param severity - The log severity level.
 * @param message - Human-readable log message.
 * @param component - The system component emitting the log (e.g., "SanaEngine").
 * @param metadata - Optional key-value metadata to attach to the log.
 *
 * @example
 * ```typescript
 * logToCloud(LogSeverity.INFO, "User started journey", "JourneyTracker", {
 *   city: "Hyderabad",
 *   milestone: "Registration",
 * });
 * ```
 */
export function logToCloud(
  severity: LogSeverity,
  message: string,
  component: string,
  metadata?: Record<string, unknown>
): void {
  const entry: StructuredLogEntry = {
    severity,
    message,
    component,
    timestamp: new Date().toISOString(),
    metadata,
  };

  // Cloud Run picks up JSON lines from stdout as structured logs
  console.log(JSON.stringify(entry));
}

/**
 * Represents an analytics event for BigQuery ingestion.
 */
export interface AnalyticsEvent {
  eventType: "query" | "milestone_reached" | "session_start" | "nudge_accepted" | "error";
  userId: string;
  city: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

/**
 * Tracks an analytics event by logging it in BigQuery-compatible format.
 * In production, this would use the BigQuery Streaming Insert API.
 * Currently logs to Cloud Logging for downstream ETL into BigQuery.
 *
 * @param event - The analytics event to track.
 *
 * @example
 * ```typescript
 * trackAnalyticsEvent({
 *   eventType: "milestone_reached",
 *   userId: "user-123",
 *   city: "Hyderabad",
 *   payload: { milestone: "isRegistered", stepProgress: 2 },
 *   timestamp: new Date().toISOString(),
 * });
 * ```
 */
export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  logToCloud(LogSeverity.INFO, `[Analytics] ${event.eventType}`, "BigQueryPipeline", {
    eventType: event.eventType,
    userId: event.userId,
    city: event.city,
    ...event.payload,
  });
}

/**
 * Generates a Google Maps Directions URL for navigating to a polling booth.
 * Uses Google Maps Platform URL API.
 *
 * @param destination - The address or place name of the polling booth.
 * @param origin - Optional origin address; defaults to "My Location".
 * @returns A fully qualified Google Maps URL.
 *
 * @see https://developers.google.com/maps/documentation/urls/get-started
 */
export function getGoogleMapsDirections(destination: string, origin?: string): string {
  const base = "https://www.google.com/maps/dir/?api=1";
  const dest = encodeURIComponent(destination);
  const orig = origin ? `&origin=${encodeURIComponent(origin)}` : "";
  return `${base}&destination=${dest}${orig}&travelmode=driving`;
}

/**
 * Generates a Google Calendar event URL for election reminders.
 *
 * @param title - Event title.
 * @param date - ISO date string for the event start.
 * @param details - Event description text.
 * @returns A Google Calendar "quick add" URL.
 *
 * @see https://support.google.com/calendar/answer/41207
 */
export function createCalendarEventUrl(
  title: string,
  date: string,
  details: string
): string {
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  return `${base}&text=${encodeURIComponent(title)}&dates=${date}&details=${encodeURIComponent(details)}`;
}

/**
 * Logs a Cloud Functions-compatible webhook payload for external integrations.
 * This enables downstream consumption by Google Cloud Functions triggers.
 *
 * @param functionName - The target Cloud Function name.
 * @param payload - The data payload to send.
 */
export function emitCloudFunctionEvent(
  functionName: string,
  payload: Record<string, unknown>
): void {
  logToCloud(LogSeverity.NOTICE, `[CloudFunction:${functionName}] Event emitted`, "CloudFunctions", payload);
}

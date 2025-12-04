package com.crm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Google Calendar integration.
 *
 * ============================================
 * GOOGLE CALENDAR SYNC - ARCHITECTURE PLAN
 * ============================================
 *
 * PHASE 1: OAuth Flow (Week 1-2)
 * --------------------------------
 * 1. Add Google Calendar API dependencies to pom.xml:
 *    - google-api-services-calendar
 *    - google-oauth-client-jetty
 *    - google-http-client-jackson2
 *
 * 2. Create OAuth endpoints:
 *    - GET /api/oauth2/google-calendar/authorize
 *      Returns authorization URL for user to grant calendar access
 *    - GET /api/oauth2/callback/google-calendar
 *      Handles OAuth callback, stores tokens in UserGoogleToken entity
 *
 * 3. Create entities:
 *    - UserGoogleToken: Stores access_token, refresh_token, expires_at per user
 *
 * PHASE 2: Read-Only Sync (Week 3-4)
 * -----------------------------------
 * 1. Create GoogleCalendarSyncService:
 *    - fetchEvents(userId, startDate, endDate): Fetch events from Google
 *    - syncToLocal(userId): Pull Google events to local CalendarEvent table
 *    - handleWebhook(payload): Process Google Calendar push notifications
 *
 * 2. Add sync metadata to CalendarEvent:
 *    - googleEventId: External event ID
 *    - syncSource: "LOCAL" | "GOOGLE"
 *    - lastSyncedAt: Timestamp
 *    - syncStatus: "SYNCED" | "PENDING" | "CONFLICT"
 *
 * 3. Create scheduled job:
 *    - @Scheduled(fixedRateString = "${google.calendar.sync-interval-minutes}")
 *    - Batch sync all connected users' calendars
 *
 * PHASE 3: Two-Way Sync (Week 5-6)
 * ---------------------------------
 * 1. Extend GoogleCalendarSyncService:
 *    - pushEvent(userId, eventId): Push local event to Google
 *    - deleteEvent(userId, googleEventId): Remove from Google
 *    - handleConflict(localEvent, googleEvent): Merge strategy
 *
 * 2. Add event listeners:
 *    - @EventListener on CalendarEvent create/update/delete
 *    - Queue changes for async push to Google
 *
 * 3. Conflict resolution:
 *    - Default: Last-write-wins based on updatedAt
 *    - Optional: User prompt for manual resolution
 *
 * PHASE 4: Google Meet Integration (Week 7-8)
 * --------------------------------------------
 * 1. Extend event creation:
 *    - Add conferenceData request when creating events
 *    - Parse and store Meet link from response
 *
 * 2. Update CalendarEvent entity:
 *    - meetLink: Google Meet URL
 *    - conferenceId: Google conference ID
 *
 * API ENDPOINTS TO ADD
 * --------------------
 * GET  /api/calendar/sync/status          - Check sync status for current user
 * POST /api/calendar/sync/connect         - Initiate OAuth flow
 * POST /api/calendar/sync/disconnect      - Revoke access and clear tokens
 * POST /api/calendar/sync/trigger         - Manual sync trigger
 * GET  /api/calendar/sync/conflicts       - List unresolved conflicts
 * POST /api/calendar/sync/resolve/{id}    - Resolve a specific conflict
 *
 * SECURITY CONSIDERATIONS
 * -----------------------
 * - Store refresh tokens encrypted (use app.encryption.key)
 * - Validate webhook signatures from Google
 * - Rate limit sync requests per user
 * - Audit log all OAuth token operations
 *
 * REQUIRED GOOGLE CLOUD SETUP
 * ---------------------------
 * 1. Go to https://console.cloud.google.com
 * 2. Create or select a project
 * 3. Enable "Google Calendar API" in API Library
 * 4. Configure OAuth consent screen (External or Internal)
 * 5. Create OAuth 2.0 credentials (Web application)
 * 6. Add authorized redirect URI: {YOUR_DOMAIN}/api/oauth2/callback/google-calendar
 * 7. Copy Client ID and Secret to environment variables
 */
@Configuration
@ConfigurationProperties(prefix = "google.calendar")
public class GoogleCalendarConfig {

    /**
     * Whether Google Calendar integration is enabled.
     * Set to true only after OAuth credentials are configured.
     */
    private boolean enabled = false;

    /**
     * How often to sync with Google Calendar (in minutes).
     * Default: 15 minutes
     */
    private int syncIntervalMinutes = 15;

    /**
     * Maximum number of events to fetch per sync operation.
     * Prevents API quota exhaustion for users with many events.
     */
    private int maxEventsPerSync = 500;

    // Getters and Setters

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getSyncIntervalMinutes() {
        return syncIntervalMinutes;
    }

    public void setSyncIntervalMinutes(int syncIntervalMinutes) {
        this.syncIntervalMinutes = syncIntervalMinutes;
    }

    public int getMaxEventsPerSync() {
        return maxEventsPerSync;
    }

    public void setMaxEventsPerSync(int maxEventsPerSync) {
        this.maxEventsPerSync = maxEventsPerSync;
    }
}

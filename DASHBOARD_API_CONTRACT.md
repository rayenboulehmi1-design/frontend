# ScoutyGo Dashboard — API Integration Contract

This document describes the backend API endpoints required to make the Base44 dashboard fully functional with persistent, cross-device data. The frontend UX for all features is already built — these endpoints power the server-side persistence layer for the Replit migration.

## Current State

| Feature | Data Source | Status |
|---------|-----------|--------|
| Live Signals | ScoutyGo API via `scoutygoSignals` function | ✅ Live |
| Platform Stats | ScoutyGo API `/stats` endpoint | ✅ Live |
| Saved Opportunities | Browser `localStorage` | ⚠️ Local only |
| Alerts | Browser `localStorage` | ⚠️ Local only |
| User Profile | Base44 Auth SDK (`base44.auth.me/updateMe`) | ✅ Live |
| Settings | Browser `localStorage` | ⚠️ Local only |
| Opportunity Detail | Fetched from list endpoint (no single-item API) | ⚠️ Needs dedicated endpoint |

---

## Required Endpoints

### 1. Single Opportunity Detail

**Current gap:** The `scoutygoSignals` function fetches all opportunities as a list. The Opportunity Detail page (`/opportunities/:id`) currently searches the full list for the matching ID, which is inefficient.

```
GET /opportunities/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "category": "string",
  "summary": "string",
  "confidenceScore": 85,
  "company": "string",
  "city": "string",
  "country": "string",
  "detectedAt": "ISO-8601",
  "sourceUrl": "string",
  "sourceName": "string",
  "financials": {
    "dealValue": "number | null",
    "currency": "string | null"
  },
  "contacts": [
    { "name": "string", "role": "string", "email": "string" }
  ],
  "rawData": {}
}
```

**Frontend integration point:** `src/lib/scoutyClient.js → fetchSignalById()`

---

### 2. Saved Opportunities

```
GET    /users/saved                  — List saved opportunities
POST   /users/saved/:opportunityId   — Save an opportunity
DELETE /users/saved/:opportunityId   — Remove a saved opportunity
```

**POST/DELETE response:** `{ "saved": true/false, "opportunityId": "string" }`

**Frontend integration point:** `src/hooks/useSavedOpportunities.js` — replace localStorage reads/writes with API calls. The hook's `toggleSave`, `isSaved`, and `saved` state map directly to these endpoints.

---

### 3. Alerts

```
GET    /users/alerts          — List all alerts for the current user
POST   /users/alerts          — Create a new alert
PUT    /users/alerts/:id      — Update an alert
DELETE /users/alerts/:id      — Delete an alert
```

**Alert object:**
```json
{
  "id": "string",
  "name": "string",
  "category": "Real Estate | Investment | Business | null",
  "location": "string | null",
  "keywords": "string | null",
  "minConfidence": 50,
  "createdAt": "ISO-8601",
  "active": true
}
```

**Notification delivery:** When a new opportunity matches an alert, trigger:
- Email notification (via SendGrid, AWS SES, or similar)
- Push notification (via Web Push API or Firebase Cloud Messaging)

**Frontend integration point:** `src/pages/Alerts.jsx` — replace localStorage with API calls.

---

### 4. User Settings

```
GET /users/settings    — Get current user settings
PUT /users/settings    — Update user settings
```

**Settings object:**
```json
{
  "emailAlerts": true,
  "pushNotifications": false,
  "weeklyDigest": true,
  "defaultCategory": "All",
  "minConfidence": 0
}
```

**Frontend integration point:** `src/pages/Settings.jsx` — replace localStorage with API calls.

---

### 5. Alert Matching (Server-side)

A background job or webhook that runs when new opportunities are ingested:

```
For each new opportunity:
  1. Fetch all active alerts
  2. Match opportunity against alert criteria (category, location, keywords, minConfidence)
  3. For each match, trigger notification delivery
```

This can be implemented as a Replit background worker or a post-ingestion hook.

---

## Migration Checklist

- [ ] Implement `GET /opportunities/:id` on Replit
- [ ] Implement `/users/saved` CRUD endpoints
- [ ] Implement `/users/alerts` CRUD endpoints
- [ ] Implement `/users/settings` GET/PUT endpoints
- [ ] Add alert matching background job
- [ ] Set up email notification service
- [ ] Set up push notification service
- [ ] Update `scoutyClient.js` to call Replit endpoints directly (or through Base44 proxy functions)
- [ ] Replace localStorage hooks with API-backed hooks
- [ ] Test cross-device sync for saved/alerts/settings
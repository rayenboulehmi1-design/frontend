# ScoutyGo — Replit Migration Contract

This document identifies all features in the current Base44 implementation that rely on frontend-only storage or require Replit backend persistence to become fully functional, cross-device, and production-ready. Each section details the current frontend behavior, the expected backend endpoint or service, request/response shapes, authentication, and data ownership requirements.

---

## Feature Status Summary

| Feature | Current Data Source | Status |
|---------|-------------------|--------|
| Live Signals | ScoutyGo API via `scoutygoSignals` Base44 function | ✅ Live — preserve |
| Platform Stats | ScoutyGo API `/stats` endpoint | ✅ Live — preserve |
| Stripe Checkout | `createCheckout` Base44 function + Stripe | ✅ Live — preserve |
| Stripe Billing Portal | `stripeBillingPortal` Base44 function + Stripe | ✅ Live — preserve |
| Stripe Webhooks | `stripe-webhook` Base44 function | ✅ Live — preserve |
| User Profile | Base44 Auth SDK (`base44.auth.me/updateMe`) | ✅ Live — migrate to Replit auth |
| Saved Opportunities | Browser `localStorage` | ⚠️ Local only — migrate |
| Alerts | Browser `localStorage` | ⚠️ Local only — migrate |
| User Settings | Browser `localStorage` | ⚠️ Local only — migrate |
| Alert Notification Delivery | Not implemented | ⚠️ Requires backend service |
| Opportunity Enrichment | Fetched from list (no single-item API) | ⚠️ Needs dedicated endpoint |
| Payment History | Stripe invoices API (not yet wired) | ⚠️ Needs backend function |

---

## 1. Saved Opportunities

### Current Frontend Behavior
- Storage: `localStorage` key `"scouty_saved_opportunities"` (JSON array of full signal objects).
- Hook: `src/hooks/useSavedOpportunities.js` — provides `saved` (array), `savedCount` (number), `isSaved(id)` (boolean), and `toggleSave(signal)` (add/remove).
- Signal objects stored in full (id, title, category, location, entity_name, confidence, summary, time_ago).
- Data is device-specific — a user logging in on a new device sees an empty saved list.
- No server round-trip; all operations are synchronous localStorage reads/writes.

### Expected Backend Endpoint
```
GET    /users/saved                  — List saved opportunities for the authenticated user
POST   /users/saved/:opportunityId   — Save an opportunity
DELETE /users/saved/:opportunityId   — Remove a saved opportunity
```

### Request Data

**GET /users/saved**
```
Headers: Authorization: Bearer <access_token>
Body: none
```

**POST /users/saved/:opportunityId**
```
Headers: Authorization: Bearer <access_token>
Body: application/json
{
  "opportunityId": "string",
  "title": "string",
  "category": "Real Estate | Investment | Business",
  "location": "string",
  "entity_name": "string",
  "confidence": number,
  "summary": "string",
  "time_ago": "string"
}
```

**DELETE /users/saved/:opportunityId**
```
Headers: Authorization: Bearer <access_token>
Body: none
```

### Expected Response Data

**GET /users/saved**
```json
{
  "saved": [
    {
      "id": "string",
      "opportunityId": "string",
      "title": "string",
      "category": "Real Estate | Investment | Business",
      "location": "string",
      "entity_name": "string",
      "confidence": 85,
      "summary": "string",
      "time_ago": "string",
      "savedAt": "ISO-8601"
    }
  ]
}
```

**POST /users/saved/:opportunityId**
```json
{
  "saved": true,
  "opportunityId": "string"
}
```

**DELETE /users/saved/:opportunityId**
```json
{
  "saved": false,
  "opportunityId": "string"
}
```

### Authentication Requirement
- All endpoints require a valid Bearer token (authenticated user).
- Token is obtained from the auth provider after login (email/password, Google, or Apple).

### User Ownership / Security Requirement
- Each saved record must be scoped to `user_id` from the auth token.
- Users can only read/write their own saved opportunities.
- Server must reject requests where the token's `user_id` does not match the resource owner.
- No user should be able to see or modify another user's saved list.

### Frontend Integration Point
`src/hooks/useSavedOpportunities.js` — replace localStorage reads/writes with API calls. The hook's `toggleSave`, `isSaved`, `saved`, and `savedCount` interfaces stay the same; only the internal implementation changes from localStorage to async API calls.

---

## 2. Alerts

### Current Frontend Behavior
- Storage: `localStorage` key `"scouty_alerts"` (JSON array of alert objects).
- Page: `src/pages/Alerts.jsx` — list, create, delete alerts.
- Alert object: `{ id, name, category, location, keywords, minConfidence, createdAt }`.
- "Track" button on OpportunityDetail creates an alert from a signal's properties.
- Alert list items are clickable — link to filtered Intelligence Feed.
- Delete button uses `stopPropagation` to avoid navigation.
- Data is device-specific and not synced across devices.

### Expected Backend Endpoint
```
GET    /users/alerts          — List all alerts for the authenticated user
POST   /users/alerts          — Create a new alert
PUT    /users/alerts/:id      — Update an alert (toggle active, edit criteria)
DELETE /users/alerts/:id      — Delete an alert
```

### Request Data

**GET /users/alerts**
```
Headers: Authorization: Bearer <access_token>
Body: none
```

**POST /users/alerts**
```
Headers: Authorization: Bearer <access_token>
Body: application/json
{
  "name": "string",
  "category": "Real Estate | Investment | Business | null",
  "location": "string | null",
  "keywords": "string | null",
  "minConfidence": number
}
```

**PUT /users/alerts/:id**
```
Headers: Authorization: Bearer <access_token>
Body: application/json
{
  "name": "string (optional)",
  "category": "string | null (optional)",
  "location": "string | null (optional)",
  "keywords": "string | null (optional)",
  "minConfidence": number (optional),
  "active": boolean (optional)
}
```

**DELETE /users/alerts/:id**
```
Headers: Authorization: Bearer <access_token>
Body: none
```

### Expected Response Data

**GET /users/alerts**
```json
{
  "alerts": [
    {
      "id": "string",
      "name": "string",
      "category": "Real Estate | Investment | Business | null",
      "location": "string | null",
      "keywords": "string | null",
      "minConfidence": 50,
      "active": true,
      "createdAt": "ISO-8601"
    }
  ]
}
```

**POST /users/alerts**
```json
{
  "id": "string",
  "name": "string",
  "category": "string | null",
  "location": "string | null",
  "keywords": "string | null",
  "minConfidence": 50,
  "active": true,
  "createdAt": "ISO-8601"
}
```

**PUT /users/alerts/:id** — returns the updated alert object.

**DELETE /users/alerts/:id** — returns `{ "deleted": true, "id": "string" }`.

### Authentication Requirement
- All endpoints require a valid Bearer token (authenticated user).

### User Ownership / Security Requirement
- Each alert must be scoped to `user_id` from the auth token.
- Users can only read/write/delete their own alerts.
- Server must reject cross-user access attempts.
- Alert `active` field allows soft-disable without deletion.

### Frontend Integration Point
`src/pages/Alerts.jsx` — replace localStorage state with API-backed fetch/create/delete. The "Track" button in `src/pages/OpportunityDetail.jsx` must call `POST /users/alerts` instead of writing to localStorage.

---

## 3. User Settings

### Current Frontend Behavior
- Storage: `localStorage` key `"scouty_settings"` (JSON object).
- Page: `src/pages/Settings.jsx` — toggle notification preferences, set default category and min confidence threshold.
- Dashboard reads these settings on mount to pre-filter the signal list (default category and min confidence).
- Settings object: `{ emailAlerts, pushNotifications, weeklyDigest, defaultCategory, minConfidence }`.
- Data is device-specific.

### Expected Backend Endpoint
```
GET /users/settings    — Get current user settings
PUT /users/settings    — Update user settings (partial update)
```

### Request Data

**GET /users/settings**
```
Headers: Authorization: Bearer <access_token>
Body: none
```

**PUT /users/settings**
```
Headers: Authorization: Bearer <access_token>
Body: application/json
{
  "emailAlerts": boolean (optional),
  "pushNotifications": boolean (optional),
  "weeklyDigest": boolean (optional),
  "defaultCategory": "All | Real Estate | Investment | Business" (optional),
  "minConfidence": number (optional)
}
```

### Expected Response Data

**GET /users/settings**
```json
{
  "emailAlerts": true,
  "pushNotifications": false,
  "weeklyDigest": true,
  "defaultCategory": "All",
  "minConfidence": 0
}
```

**PUT /users/settings** — returns the full updated settings object (same shape as GET).

### Authentication Requirement
- All endpoints require a valid Bearer token (authenticated user).

### User Ownership / Security Requirement
- Settings are per-user, scoped to `user_id` from the auth token.
- Users can only read/write their own settings.
- If no settings record exists for a user, GET should return defaults (emailAlerts: true, pushNotifications: false, weeklyDigest: true, defaultCategory: "All", minConfidence: 0).

### Frontend Integration Point
`src/pages/Settings.jsx` — replace localStorage reads/writes with API calls. `src/pages/Dashboard.jsx` — replace localStorage reads in useState initializers with an async settings fetch on mount.

---

## 4. Alert Notification Delivery

### Current Frontend Behavior
- Not implemented. Alerts are stored but never matched against incoming signals.
- No email, push, or in-app notification is sent when a new signal matches alert criteria.
- The Alerts page displays a static list with no "last triggered" or "matches found" indicator.

### Expected Backend Service
A background worker or post-ingestion hook that runs whenever new opportunities are ingested into the ScoutyGo system:

```
For each new opportunity ingested:
  1. Fetch all active alerts from the database
  2. For each alert, match against the opportunity:
     - category matches (or alert category is null)
     - location contains alert location string (or alert location is null)
     - opportunity title/summary contains alert keywords (or keywords is null)
     - opportunity confidence >= alert minConfidence
  3. For each match, create a notification record and trigger delivery:
     - Email notification (if user's emailAlerts setting is true)
     - Push notification (if user's pushNotifications setting is true)
     - In-app notification (stored in database, fetched by frontend)
```

### Request Data (Internal — not user-facing)

**Match Query (internal)**
```
Input: new opportunity object
Query: SELECT alerts WHERE active = true AND (
  (category IS NULL OR category = opportunity.category) AND
  (location IS NULL OR opportunity.location LIKE '%' || location || '%') AND
  (keywords IS NULL OR opportunity.title LIKE '%' || keywords || '%' OR opportunity.summary LIKE '%' || keywords || '%') AND
  (minConfidence <= opportunity.confidence)
)
```

### Expected Response Data (Notification Record)
```json
{
  "id": "string",
  "userId": "string",
  "alertId": "string",
  "opportunityId": "string",
  "opportunityTitle": "string",
  "deliveredVia": ["email", "push", "in_app"],
  "read": false,
  "createdAt": "ISO-8601"
}
```

### Authentication Requirement
- The matching worker runs with service-role credentials (no user token).
- It reads all active alerts across all users (internal system operation).
- Individual notification delivery respects each user's notification preferences (emailAlerts, pushNotifications, weeklyDigest from User Settings).

### User Ownership / Security Requirement
- Notifications are scoped to `userId` — a user can only see their own notifications.
- Email/push delivery must respect the user's opt-in preferences from Settings.
- The matching worker must not expose one user's alert criteria or matched opportunities to another user.
- Notification records should be retained for a defined period (e.g., 90 days) and then archived or deleted.

### Required External Services
- **Email:** SendGrid, AWS SES, Postmark, or similar transactional email service.
- **Push:** Web Push API (VAPID keys) or Firebase Cloud Messaging (FCM).
- **Scheduler:** Replit background worker or cron-based trigger to run the matching job on ingestion or at intervals (e.g., every 5 minutes).

### Frontend Integration Point
- `src/pages/Alerts.jsx` — add a "Last triggered" timestamp and "Matches" count per alert (requires `GET /users/alerts/:id/notifications` or inclusion in the alert list response).
- New `src/pages/Notifications.jsx` (optional) — list unread notifications with links to matched opportunities.

---

## 5. Opportunity Enrichment

### Current Frontend Behavior
- `src/lib/scoutyClient.js → fetchSignalById(id, limit)` fetches ALL signals via `scoutygoSignals` and finds the matching ID client-side.
- This is inefficient — the entire signal list (up to 500 records) is downloaded to view one detail page.
- The Opportunity Detail page (`src/pages/OpportunityDetail.jsx`) displays: title, category, confidence, location, entity_name, time_ago, and summary.
- No source links, financials, contact data, or raw metadata are available.

### Expected Backend Endpoint
```
GET /opportunities/:id    — Fetch full detail for a single opportunity
```

### Request Data
```
Headers: Authorization: Bearer <access_token> (if authenticated; may be public for marketing)
URL Param: id (string) — the opportunity identifier
Body: none
```

### Expected Response Data
```json
{
  "id": "string",
  "title": "string",
  "category": "Real Estate | Investment | Business",
  "summary": "string",
  "confidence": 85,
  "entity_name": "string",
  "location": "string",
  "time_ago": "string",
  "detectedAt": "ISO-8601",
  "sourceUrl": "string | null",
  "sourceName": "string | null",
  "financials": {
    "dealValue": "number | null",
    "currency": "string | null"
  },
  "contacts": [
    {
      "name": "string",
      "role": "string",
      "email": "string | null",
      "phone": "string | null"
    }
  ],
  "rawData": {}
}
```

### Authentication Requirement
- If opportunity detail is public (visible to non-subscribers for marketing): no auth required, but enriched fields (contacts, financials, sourceUrl) should be omitted or redacted for unauthenticated/non-subscriber users.
- If opportunity detail is subscriber-only: require Bearer token and verify active subscription (Pro tier).

### User Ownership / Security Requirement
- Opportunities are not user-owned — they are platform intelligence data.
- However, enriched fields (contacts, financials) should be gated by subscription tier:
  - Free users: title, category, summary, confidence, location, entity_name, time_ago only.
  - Pro users: all fields including sourceUrl, financials, contacts, rawData.
- Rate limiting should be applied to prevent bulk scraping.

### Frontend Integration Point
`src/lib/scoutyClient.js → fetchSignalById()` — replace the list-and-filter approach with a direct `GET /opportunities/:id` call. `src/pages/OpportunityDetail.jsx` — render the enriched fields (source links, financials, contacts) when present in the response.

---

## 6. Payment History

### Current Frontend Behavior
- `src/pages/AccountOverview.jsx` — Payment History section shows a professional empty state: "No payments yet. Your payment history will appear here once you subscribe."
- No fake or mock data is displayed.
- No backend call is made to fetch invoice history.
- The Stripe Billing Portal link is available for Pro users to manage billing via Stripe directly.

### Expected Backend Endpoint
```
GET /users/payments    — List payment/invoice history for the authenticated user
```

Alternatively, a Base44 backend function that wraps the Stripe Invoices API:

```
Base44 function: stripePaymentHistory
Input: { } (uses authenticated user's stripe_customer_id)
Calls: stripe.invoices.list({ customer: customerId, limit: 50 })
Returns: formatted invoice list
```

### Request Data
```
Headers: Authorization: Bearer <access_token>
Body: none
```

### Expected Response Data
```json
{
  "invoices": [
    {
      "id": "string",
      "number": "string",
      "amountPaid": 4900,
      "currency": "usd",
      "status": "paid",
      "periodStart": "ISO-8601",
      "periodEnd": "ISO-8601",
      "invoicePdfUrl": "string"
    }
  ]
}
```

### Authentication Requirement
- Requires a valid Bearer token (authenticated user).
- The backend function must resolve the user's `stripe_customer_id` from their profile (set by the `stripe-webhook` function on checkout completion).

### User Ownership / Security Requirement
- The backend function must use the authenticated user's `stripe_customer_id` — never accept a customer ID from the request body.
- Users can only view their own invoice history.
- The `invoicePdfUrl` should be a Stripe-hosted URL (no need to generate PDFs server-side).
- If no `stripe_customer_id` exists on the user profile, return an empty array (not an error).

### Frontend Integration Point
`src/pages/AccountOverview.jsx` — replace the static empty state with a `useEffect` that calls the `stripePaymentHistory` function. Render invoice rows (date, amount, status, download link) when data is available; keep the empty state when no invoices exist. Do not implement fake/mock invoice data under any circumstances.

---

## Migration Checklist

### Backend Endpoints to Implement on Replit
- [ ] `GET /opportunities/:id` — single opportunity detail with enrichment
- [ ] `GET/POST/DELETE /users/saved` — saved opportunities CRUD
- [ ] `GET/POST/PUT/DELETE /users/alerts` — alerts CRUD
- [ ] `GET/PUT /users/settings` — user settings read/update
- [ ] `GET /users/payments` or `stripePaymentHistory` function — invoice history
- [ ] Alert matching background worker (post-ingestion hook or scheduled job)

### External Services to Configure
- [ ] Transactional email service (SendGrid / AWS SES / Postmark) for alert notifications
- [ ] Push notification service (Web Push / FCM) for browser/mobile push
- [ ] Scheduler (Replit background worker or cron) for alert matching job

### Frontend Files to Update
- [ ] `src/hooks/useSavedOpportunities.js` — replace localStorage with API calls
- [ ] `src/pages/Alerts.jsx` — replace localStorage with API calls
- [ ] `src/pages/OpportunityDetail.jsx` — "Track" button calls API; render enriched fields
- [ ] `src/pages/Settings.jsx` — replace localStorage with API calls
- [ ] `src/pages/Dashboard.jsx` — fetch settings from API on mount
- [ ] `src/pages/AccountOverview.jsx` — fetch real invoice history
- [ ] `src/lib/scoutyClient.js` — `fetchSignalById()` calls `GET /opportunities/:id` directly

### Existing Features to Preserve (Do Not Break)
- [ ] `scoutygoSignals` Base44 function — live signal fetching from ScoutyGo API
- [ ] `scoutygoProbe` Base44 function — ScoutyGo API health probe
- [ ] `createCheckout` Base44 function — Stripe Checkout session creation
- [ ] `stripeBillingPortal` Base44 function — Stripe Billing Portal session
- [ ] `stripe-webhook` Base44 function — Stripe webhook handler (checkout, invoice, subscription events)
- [ ] Apple, Google, and email/password authentication flows
- [ ] Protected route gating via `ProtectedRoute` component
- [ ] Iframe check on checkout (block checkout in preview, allow in published app)
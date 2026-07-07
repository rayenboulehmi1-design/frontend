# BASE44 INTEGRATION CONTRACT

## ScoutyGo Production Backend ↔ Base44 Frontend

**Document Purpose:** This contract defines how the Base44 frontend application should communicate with the existing ScoutyGo production intelligence backend through secure Base44 backend proxy functions.

**Created:** 2026-07-07
**Status:** Draft — Pending ScoutyGo Team Completion

> **IMPORTANT — READ FIRST:**
> The Base44 platform does not have direct access to the ScoutyGo production backend. Sections marked `[SCOUTYGO TEAM — FILL IN]` require your engineering team to provide the actual values from your production infrastructure. Do not deploy any integration code until all fill-in fields are completed and reviewed.

---

## Table of Contents

1. [Production API Base URL Structure](#1-production-api-base-url-structure)
2. [Authentication Method per Endpoint](#2-authentication-method-per-endpoint)
3. [Service-to-Service vs. User Identity Forwarding](#3-service-to-service-vs-user-identity-forwarding)
4. [Endpoint Catalog](#4-endpoint-catalog)
5. [Request Parameters](#5-request-parameters)
6. [Response Schemas](#6-response-schemas)
7. [Pagination Method](#7-pagination-method)
8. [Rate Limiting](#8-rate-limiting)
9. [CORS Policy](#9-cors-policy)
10. [Realtime Updates](#10-realtime-updates)
11. [Opportunity → Signal Field Mapping](#11-opportunity--signal-field-mapping)
12. [Fields Lost in Signal Reduction](#12-fields-lost-in-signal-reduction)
13. [Recommended Authentication Architecture](#13-recommended-authentication-architecture)
14. [Membership Tier & Whop Entitlement Preservation](#14-membership-tier--whop-entitlement-preservation)
15. [Minimum API Changes Required](#15-minimum-api-changes-required)

---

## 1. Production API Base URL Structure

```
Base URL: https://[SCOUTYGO TEAM — FILL IN: production domain]/api/v[X]
```

**Requirements:**
- The Base44 backend function will reference this URL via the secret `SCOUTYGO_API_BASE_URL`.
- The actual domain, version prefix, and any subpath must be provided by the ScoutyGo team.
- No secrets are exposed in this document. The Base44 function reads the URL at runtime via `Deno.env.get("SCOUTYGO_API_BASE_URL")`.

**Environment variants (if applicable):**

| Environment | Base URL | Notes |
|---|---|---|
| Production | `[SCOUTYGO TEAM — FILL IN]` | Used by the live Base44 app |
| Staging | `[SCOUTYGO TEAM — FILL IN]` | Optional, for integration testing |

---

## 2. Authentication Method per Endpoint

> The ScoutyGo team must confirm the authentication method for each endpoint category below. Base44 must never guess or assume auth requirements.

| Endpoint Category | Auth Method | Token Source | Notes |
|---|---|---|---|
| Opportunity/deal listing | `[FILL IN]` | `[FILL IN]` | |
| Opportunity detail | `[FILL IN]` | `[FILL IN]` | |
| Search & filtering | `[FILL IN]` | `[FILL IN]` | |
| Dashboard statistics | `[FILL IN]` | `[FILL IN]` | |
| Recent intelligence/signals | `[FILL IN]` | `[FILL IN]` | |
| Saved opportunities/watchlist | `[FILL IN]` | `[FILL IN]` | |
| Membership/entitlement resolution | `[FILL IN]` | `[FILL IN]` | |
| Owner/admin test mode | `[FILL IN]` | `[FILL IN]` | |

**Possible auth methods (select per endpoint):**
- API Key (header: `Authorization: Bearer <key>` or `X-API-Key: <key>`)
- OAuth2 Access Token (per-user, short-lived)
- JWT (per-user, signed)
- Session Cookie (per-user)
- Service-to-Service Key (shared, server-only)
- Whop License Key (per-user entitlement)
- Clerk Session JWT (per-user)

---

## 3. Service-to-Service vs. User Identity Forwarding

### The Critical Question

Can Base44 use a **single service-to-service credential** to fetch all opportunity data from ScoutyGo, or must **each Base44 user's identity be forwarded** and verified by ScoutyGo before returning tier-appropriate data?

### Recommendation: User Identity Must Be Forwarded

Given that ScoutyGo has membership tiers (Professional, Enterprise) backed by Whop entitlements, a pure service-to-service credential is **unsafe** unless ScoutyGo's API enforces tier-based filtering server-side using a forwarded user identifier.

**The safe flow:**

```
Base44 Browser
  → user has Base44 session (base44.auth.me())
  → Base44 Backend Function verifies user is authenticated
  → Backend Function calls ScoutyGo API WITH user identity context:
      Option A: Forward a Base44 user identifier (email, user_id) 
                and let ScoutyGo resolve entitlements
      Option B: Forward a Whop license key stored on the user's profile
      Option C: Exchange a Base44-issued JWT for a ScoutyGo session token
  → ScoutyGo API enforces tier-based data access server-side
  → Returns only data the user's tier permits
  → Base44 Backend Function transforms response → returns to browser
```

### Decision Matrix

| Scenario | Safe? | Reason |
|---|---|---|
| Service key, ScoutyGo returns ALL data, Base44 filters client-side | ❌ **NO** | Client-side filtering can be bypassed; data exposed |
| Service key, ScoutyGo filters by forwarded user ID | ✅ Yes | ScoutyGo enforces entitlements server-side |
| Per-user token (Whop/Clerk), forwarded to ScoutyGo | ✅ Yes (best) | ScoutyGo validates the user's own credential |
| Service key, no user context, ScoutyGo returns tier-filtered data based on query param | ⚠️ Risky | Query param can be tampered unless validated server-side |

**[SCOUTYGO TEAM — FILL IN:** Which of the above matches your current architecture? Does ScoutyGo's API enforce tier-based access when given a user identifier, or does it require a per-user token?**]**

---

## 4. Endpoint Catalog

> All endpoints below must be confirmed by the ScoutyGo team. Placeholder paths use RESTful conventions — replace with actual routes.

### 4.1 Opportunity / Deal Listing

| Field | Value |
|---|---|
| Method | `[FILL IN — likely GET]` |
| Path | `[FILL IN — e.g. /opportunities]` |
| Auth | `[FILL IN]` |
| Description | Returns a paginated list of opportunities/deals |

### 4.2 Opportunity Detail

| Field | Value |
|---|---|
| Method | `[FILL IN — likely GET]` |
| Path | `[FILL IN — e.g. /opportunities/{id}]` |
| Auth | `[FILL IN]` |
| Description | Returns full detail for a single opportunity |

### 4.3 Search & Filtering

| Field | Value |
|---|---|
| Method | `[FILL IN — likely GET]` |
| Path | `[FILL IN — e.g. /opportunities/search]` or query params on listing endpoint |
| Auth | `[FILL IN]` |
| Description | Search opportunities by keyword, category, location, market code |

### 4.4 Dashboard Statistics

| Field | Value |
|---|---|
| Method | `[FILL IN — likely GET]` |
| Path | `[FILL IN — e.g. /stats/dashboard]` |
| Auth | `[FILL IN]` |
| Description | Aggregate metrics: total signals, category breakdown, top markets, time-series activity |

### 4.5 Recent Intelligence / Signals

| Field | Value |
|---|---|
| Method | `[FILL IN — likely GET]` |
| Path | `[FILL IN — e.g. /signals/recent]` |
| Auth | `[FILL IN]` |
| Description | Most recent N signals for live feed display |

### 4.6 Saved Opportunities / Watchlist

| Field | Value |
|---|---|
| Method | `[FILL IN — likely GET/POST/DELETE]` |
| Path | `[FILL IN — e.g. /users/me/watchlist]` |
| Auth | `[FILL IN — per-user required]` |
| Description | User's saved/bookmarked opportunities |

### 4.7 Membership & Entitlement Resolution

| Field | Value |
|---|---|
| Method | `[FILL IN]` |
| Path | `[FILL IN — e.g. /users/me/entitlements]` |
| Auth | `[FILL IN]` |
| Description | Resolves the user's current membership tier (Free, Professional, Enterprise) and Whop license status |

### 4.8 Owner / Admin Test Mode

| Field | Value |
|---|---|
| Method | `[FILL IN]` |
| Path | `[FILL IN — if applicable]` |
| Auth | `[FILL IN]` |
| Description | Admin override to view data across all tiers (for testing/support) |

---

## 5. Request Parameters

> Replace placeholders with actual parameter names, types, and defaults.

### 5.1 Opportunity Listing

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `page` / `cursor` | `[FILL IN]` | No | `[FILL IN]` | Pagination |
| `limit` / `per_page` | `[FILL IN]` | No | `[FILL IN]` | Results per page |
| `category` | `[FILL IN]` | No | — | Filter by category |
| `market` / `country_code` | `[FILL IN]` | No | — | Filter by geographic market |
| `search` / `q` | `[FILL IN]` | No | — | Full-text search |
| `sort` | `[FILL IN]` | No | `[FILL IN]` | Sort field + direction |
| `tier_filter` | `[FILL IN]` | No | — | If API supports tier-scoped results |

### 5.2 Opportunity Detail

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `[FILL IN]` | Yes | Opportunity identifier |

### 5.3 Dashboard Statistics

| Parameter | Type | Required | Description |
|---|---|---|---|
| `date_range` / `from` / `to` | `[FILL IN]` | No | Time window for stats |
| `category` | `[FILL IN]` | No | Filter stats by category |

### 5.4 Recent Signals

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `limit` | `[FILL IN]` | No | `[FILL IN]` | Number of recent signals |

### 5.5 Watchlist

| Parameter | Type | Required | Description |
|---|---|---|---|
| `opportunity_id` | `[FILL IN]` | Yes (for add/remove) | Opportunity to save/unsave |

### 5.6 Entitlements

| Parameter | Type | Required | Description |
|---|---|---|---|
| `user_id` / `email` | `[FILL IN]` | Yes (if not token-derived) | User identifier for entitlement lookup |

---

## 6. Response Schemas

> Provide sanitized example JSON for each endpoint. No real user data, no secrets, no PII.

### 6.1 Opportunity Listing Response

```json
{
  "data": [
    {
      "id": "[FILL IN — type, e.g. string/uuid]",
      "title": "[FILL IN]",
      "category": "[FILL IN]",
      "location": "[FILL IN]",
      "entity_name": "[FILL IN]",
      "time_ago": "[FILL IN]",
      "confidence": "[FILL IN]",
      "summary": "[FILL IN]",
      "created_date": "[FILL IN]"
    }
  ],
  "pagination": {
    "[FILL IN — page/cursor, total, has_more, etc.]": "[FILL IN]"
  }
}
```

### 6.2 Opportunity Detail Response

```json
{
  "id": "[FILL IN]",
  "title": "[FILL IN]",
  "category": "[FILL IN]",
  "location": "[FILL IN]",
  "entity_name": "[FILL IN]",
  "time_ago": "[FILL IN]",
  "confidence": "[FILL IN]",
  "summary": "[FILL IN]",
  "created_date": "[FILL IN]",
  "[FILL IN — all additional fields: deal_value, buyer, decision_makers, etc.]": "[FILL IN]"
}
```

### 6.3 Dashboard Statistics Response

```json
{
  "total_signals": "[FILL IN]",
  "category_breakdown": {
    "real_estate": "[FILL IN]",
    "investment": "[FILL IN]",
    "business": "[FILL IN]"
  },
  "top_markets": [
    { "name": "[FILL IN]", "count": "[FILL IN]" }
  ],
  "time_series": [
    { "date": "[FILL IN]", "real_estate": "[FILL IN]", "investment": "[FILL IN]", "business": "[FILL IN]" }
  ],
  "avg_confidence": "[FILL IN]"
}
```

### 6.4 Recent Signals Response

```json
{
  "data": [
    {
      "id": "[FILL IN]",
      "title": "[FILL IN]",
      "category": "[FILL IN]",
      "location": "[FILL IN]",
      "time_ago": "[FILL IN]",
      "confidence": "[FILL IN]"
    }
  ]
}
```

### 6.5 Watchlist Response

```json
{
  "data": [
    {
      "opportunity_id": "[FILL IN]",
      "saved_at": "[FILL IN]"
    }
  ]
}
```

### 6.6 Entitlements Response

```json
{
  "user_id": "[FILL IN]",
  "tier": "[FILL IN — free|professional|enterprise]",
  "whop_license_status": "[FILL IN — active|expired|cancelled]",
  "whop_license_key": "[REDACTED — never expose to frontend]",
  "entitlements": {
    "[FILL IN — feature flags, data access level, etc.]": "[FILL IN]"
  }
}
```

---

## 7. Pagination Method

| Question | Answer |
|---|---|
| Pagination style | `[FILL IN — cursor-based / offset+limit / page-based]` |
| Parameter name(s) | `[FILL IN]` |
| Response field(s) for next page | `[FILL IN]` |
| Maximum page size | `[FILL IN]` |
| Total count included? | `[FILL IN]` |

**Base44 implementation note:** The Base44 backend function will pass through pagination parameters from the frontend and return both the data and pagination metadata. The current Base44 frontend uses `base44.entities.Signal.list("-created_date", 50)` (offset + limit style). The proxy function should adapt whatever ScoutyGo uses to a consistent interface for the frontend.

---

## 8. Rate Limiting

| Question | Answer |
|---|---|
| Rate limit enabled? | `[FILL IN]` |
| Limit (requests per minute/hour) | `[FILL IN]` |
| Rate limit headers returned? | `[FILL IN — e.g. X-RateLimit-Remaining]` |
| Behavior when exceeded | `[FILL IN — 429 status? Retry-After header?]` |
| Per-user or per-IP or per-key? | `[FILL IN]` |

**Base44 implementation note:** If rate limits exist, the Base44 backend function should:
1. Respect `Retry-After` headers
2. Cache responses where appropriate (especially dashboard stats and recent signals)
3. Return a graceful error to the frontend when rate-limited

---

## 9. CORS Policy

| Question | Answer |
|---|---|
| CORS configured? | `[FILL IN]` |
| Allowed origins | `[FILL IN]` |
| Allowed methods | `[FILL IN]` |
| Allowed headers | `[FILL IN]` |
| Credentials allowed? | `[FILL IN]` |

**Base44 implementation note:** If Base44 uses the backend function proxy pattern (recommended), CORS is irrelevant — Deno-to-ScoutyGo calls are not browser-originated. CORS only matters if any request is made directly from the browser to ScoutyGo, which is not recommended.

---

## 10. Realtime Updates

| Question | Answer |
|---|---|
| Realtime mechanism | `[FILL IN — polling / SSE / WebSocket / webhook / none]` |
| If polling: recommended interval | `[FILL IN]` |
| If SSE/WebSocket: endpoint | `[FILL IN]` |
| If webhook: can ScoutyGo call a Base44 backend function URL? | `[FILL IN]` |

**Base44 implementation note:** The current Base44 app uses `base44.entities.Signal.subscribe()` for realtime updates on the local database. With the proxy pattern:
- **Polling:** Base44 backend function is called on an interval from the frontend (simplest, but not true realtime)
- **Webhook:** ScoutyGo calls a Base44 backend function URL when new data is available; the function can push to Base44 realtime or store in entities for subscription
- **SSE/WebSocket:** Not directly supported through `base44.functions.invoke()` — would require a different pattern

**Recommendation:** Start with polling at a 30-60 second interval for the live feed. Explore webhooks if true realtime is needed later.

---

## 11. Opportunity → Signal Field Mapping

The Base44 `Signal` entity shape is:

```json
{
  "id": "<built-in, string>",
  "title": "string — Headline of the intelligence signal",
  "category": "enum [Real Estate | Investment | Business]",
  "location": "string — Geographic location",
  "entity_name": "string — Company or entity name",
  "time_ago": "string — Human-readable relative time, e.g. '3h ago'",
  "confidence": "number — Confidence score percentage (0-100)",
  "summary": "string — Short description",
  "created_date": "<built-in, ISO datetime>"
}
```

### Mapping Table

| Base44 Signal Field | ScoutyGo Opportunity Field | Transformation Needed | Notes |
|---|---|---|---|
| `id` | `[FILL IN — e.g. opportunity.id]` | None (pass-through) | Must be string-compatible |
| `title` | `[FILL IN — e.g. opportunity.headline / opportunity.name]` | None | |
| `category` | `[FILL IN]` | **Enum mapping required** — ScoutyGo categories must map to `Real Estate` / `Investment` / `Business` | If ScoutyGo uses different category names (e.g. `real_estate`, `property`), a lookup table is needed |
| `location` | `[FILL IN — e.g. opportunity.city + opportunity.country]` | May need concatenation | Format as `"City, Country"` or `"City, CC"` |
| `entity_name` | `[FILL IN — e.g. opportunity.company_name]` | None | Optional field in Signal |
| `time_ago` | `[FILL IN]` | **If ScoutyGo provides a datetime, Base44 function must compute relative time** (e.g. using date-fns `formatDistanceToNow`) | Signal expects a pre-formatted string like `"3h ago"` |
| `confidence` | `[FILL IN — e.g. opportunity.score / opportunity.confidence_level]` | May need scaling (0-1 → 0-100) | Must be a number 0-100 |
| `summary` | `[FILL IN — e.g. opportunity.description / opportunity.brief]` | Truncate if very long | Optional field in Signal |
| `created_date` | `[FILL IN — e.g. opportunity.created_at / opportunity.detected_at]` | Ensure ISO 8601 format | Used by Dashboard charts for time-series |

**[SCOUTYGO TEAM — FILL IN the right column for each row above.]**

---

## 12. Fields Lost in Signal Reduction

The Base44 `Signal` entity is a **summary-grade shape** — it was designed for feed display, not deep opportunity analysis. Reducing a full ScoutyGo Opportunity to the Signal shape will lose critical intelligence fields.

### Fields at Risk of Loss

| ScoutyGo Field (expected) | In Signal Shape? | Impact if Lost | Mitigation |
|---|---|---|---|
| **Deal value / estimated value** | ❌ Not in Signal | Users cannot assess opportunity size in the feed | Store on Signal as a new optional field, OR fetch full detail on click via Opportunity Detail endpoint |
| **Buyer / company** | Partially — `entity_name` | Only one entity field; if ScoutyGo has both buyer and target, one is lost | Extend Signal with optional `buyer` field, or use detail view |
| **Decision makers** | ❌ Not in Signal | Key contact intelligence is invisible in feed | Fetch via detail endpoint; display on detail page |
| **Contact information** | ❌ Not in Signal | No way to act on the opportunity from feed view | Fetch via detail endpoint; gate behind tier check |
| **Opportunity score** | Partially — `confidence` may or may not be the same metric | If ScoutyGo's "score" differs from "confidence," mapping is ambiguous | Clarify with team; possibly add `opportunity_score` as separate field |
| **Urgency** | ❌ Not in Signal | Time-sensitive opportunities look identical to low-priority ones in feed | Add optional `urgency` field or badge |
| **Source evidence** | ❌ Not in Signal | Users can't verify signal provenance | Fetch via detail endpoint |
| **Next best action** | ❌ Not in Signal | Actionable guidance is lost | Fetch via detail endpoint; consider adding to detail page |
| **Who to approach** | ❌ Not in Signal | Outreach target is invisible | Fetch via detail endpoint |
| **Stakeholder gaps** | ❌ Not in Signal | Relationship intelligence is lost | Fetch via detail endpoint |
| **Project intelligence** | ❌ Not in Signal | Deep context is unavailable in feed | Fetch via detail endpoint |

### Recommendation

**Do NOT try to cram all Opportunity fields into the Signal entity.** Instead:

1. **Feed view (SignalCard, LiveIntelligence, Hero):** Uses the Signal shape — title, category, location, confidence, summary, time_ago. This is sufficient for browsing.

2. **Detail view (new Opportunity Detail page):** Calls the Opportunity Detail endpoint and renders ALL fields — deal value, decision makers, contact info, source evidence, next best action, stakeholder gaps, project intelligence. This is where the full ScoutyGo value lives.

3. **Tier-gated detail:** The detail endpoint call in the Base44 backend function must verify the user's tier before returning sensitive fields (contact info, decision makers). Free users may see a teaser; Professional/Enterprise users see full detail.

---

## 13. Recommended Authentication Architecture

### Architecture Diagram (text)

```
┌─────────────────────┐
│  Base44 Browser     │
│  (React frontend)   │
│                     │
│  base44.auth.me()   │
│  → user session     │
└─────────┬───────────┘
          │
          │ base44.functions.invoke('scoutygoProxy', {
          │   action: 'listOpportunities',
          │   params: { category, market, page, ... }
          │ })
          │
          ▼
┌─────────────────────────────────────┐
│  Base44 Backend Function (Deno)     │
│  base44/functions/scoutygoProxy/    │
│  entry.ts                           │
│                                     │
│  1. base44.auth.me()                │
│     → verify user is authenticated  │
│  2. Resolve user's ScoutyGo identity│
│     (email, user_id, or Whop key)   │
│  3. Resolve user's entitlement tier │
│  4. Forward request to ScoutyGo API │
│     with user identity context      │
│  5. Receive response                │
│  6. Transform Opportunity → Signal  │
│  7. Verify response doesn't contain │
│     data above user's tier          │
│  8. Return to browser               │
└─────────┬───────────────────────────┘
          │
          │ fetch(SCOUTYGO_API_BASE_URL + path, {
          │   headers: {
          │     [AUTH HEADER]: [user identity token or service key],
          │     'X-Base44-User-Id': user.id,
          │     'X-Base44-User-Email': user.email,
          │     'X-Base44-Tier': resolvedTier
          │   }
          │ })
          │
          ▼
┌─────────────────────────────────────┐
│  ScoutyGo Production API            │
│                                     │
│  1. Authenticate request            │
│  2. Resolve user entitlements       │
│     (Whop / Clerk)                  │
│  3. Enforce tier-based data access  │
│  4. Return tier-appropriate data    │
└─────────────────────────────────────┘
```

### Key Principles

1. **Base44 authenticates the user** via `base44.auth.me()` in the backend function — no unauthenticated requests reach ScoutyGo.

2. **ScoutyGo authorizes the data** — the Base44 function forwards user identity, but ScoutyGo's API must enforce tier-based access server-side. Base44 never trusts its own tier resolution for data gating (defense in depth).

3. **Secrets never reach the browser** — `SCOUTYGO_API_BASE_URL` and any service credentials are stored as Base44 environment variables, accessed only in Deno functions.

4. **Double validation** — both Base44 and ScoutyGo validate the user. Base44 checks authentication; ScoutyGo checks authorization (tier/entitlement).

### Recommended Secrets (Base44 Environment Variables)

| Secret Name | Purpose | Set By |
|---|---|---|
| `SCOUTYGO_API_BASE_URL` | Production API base URL | ScoutyGo team |
| `SCOUTYGO_SERVICE_KEY` | Service-to-service credential (if used) | ScoutyGo team |
| `SCOUTYGO_WEBHOOK_SECRET` | Shared secret for validating ScoutyGo webhooks (if used) | ScoutyGo team |

> **Note:** If ScoutyGo uses per-user Whop/Clerk tokens rather than a service key, no `SCOUTYGO_SERVICE_KEY` is needed — the user's token is forwarded instead.

---

## 14. Membership Tier & Whop Entitlement Preservation

### The Risk

ScoutyGo has at least three membership tiers (implied by the Base44 Pricing section: Scout/Free, Professional, Enterprise). If Base44 fetches data via a service key and returns it to the browser without tier enforcement, a Free user could see Professional or Enterprise data.

### Current ScoutyGo Entitlement System

> **[SCOUTYGO TEAM — FILL IN:]**
> - What membership tiers exist? (e.g. Free, Professional, Enterprise)
> - How are entitlements stored and verified? (Whop license? Clerk roles? Database flag?)
> - What data does each tier unlock?
>   - Free: `[FILL IN]`
>   - Professional: `[FILL IN]`
>   - Enterprise: `[FILL IN]`
> - Is the Whop license key stored per-user in ScoutyGo's database?
> - How does ScoutyGo currently verify a user's tier on each API request?

### Safe Architecture for Entitlement Preservation

```
Step 1: Base44 backend function calls base44.auth.me()
        → Gets the Base44 user (id, email)

Step 2: Base44 function calls ScoutyGo's entitlement endpoint
        → ScoutyGo resolves the user's tier via Whop/Clerk
        → Returns { tier: "professional", entitlements: {...} }

Step 3: Base44 function calls ScoutyGo's data endpoint WITH tier context
        → ScoutyGo returns ONLY tier-appropriate data
        → ScoutyGo is the authority — Base44 does not filter

Step 4: Base44 function returns data to browser
        → Browser renders whatever it receives
        → If user is Free, they see less data — enforced by ScoutyGo, not Base44
```

### Critical Rules

| Rule | Enforcement Point |
|---|---|
| Free users must not see Professional/Enterprise data | **ScoutyGo API** (server-side, authoritative) |
| Contact info, decision makers, deal values may be tier-gated | **ScoutyGo API** (omit from response for lower tiers) |
| Base44 must not cache tier-gated data in shared entities | **Base44 backend function** (avoid entity sync for tier-sensitive data) |
| If Base44 caches anything, it must be tier-scoped or non-sensitive | **Base44 backend function** |
| Watchlist is per-user — no cross-user leakage | **ScoutyGo API** (user-scoped queries) + **Base44** (forward correct user ID) |

### Whop License Key Handling

- If the Whop license key is needed for API auth, it should be stored **securely** and never exposed to the browser.
- **Option A (preferred):** ScoutyGo stores the Whop license per-user; Base44 forwards only the user's email/id; ScoutyGo resolves the Whop license internally.
- **Option B:** The Whop license key is stored on the Base44 User entity (via `base44.auth.updateMe()`); the Base44 backend function reads it server-side and forwards it to ScoutyGo. **Never** sent to the browser.
- **Option C (not recommended):** The user enters their Whop license key in the Base44 UI; it's sent to the backend function which forwards it. Higher friction, potential for key sharing.

**[SCOUTYGO TEAM — FILL IN: Which option matches your current architecture? Where is the Whop license key stored today?]**

### Clerk Configuration

> **[SCOUTYGO TEAM — FILL IN:]**
> - Is Clerk used for authentication on the ScoutyGo backend?
> - If so, does Base44 need to mint Clerk-compatible tokens, or can ScoutyGo accept a different identity assertion (e.g. signed email)?
> - The Base44 platform uses its own auth system. A token exchange or identity bridging mechanism may be needed.
> - **No changes to Base44 auth or Clerk config should be made without explicit approval.**

---

## 15. Minimum API Changes Required

### Goal: Zero Changes to ScoutyGo Production API

If the ScoutyGo API already supports the following, **no changes are needed**:

| Requirement | Status |
|---|---|
| Accepts a user identifier (email or id) in request headers | `[FILL IN]` |
| Resolves user entitlements (Whop/Clerk) internally | `[FILL IN]` |
| Returns tier-appropriate data based on the user's entitlements | `[FILL IN]` |
| Has endpoints for listing, detail, search, stats, recent, watchlist | `[FILL IN]` |
| Returns data in a transformable format (JSON with mappable fields) | `[FILL IN]` |

### If All Above Are ✅ → Zero API Changes

The Base44 backend function handles:
- Authentication (Base44 user verification)
- Identity forwarding (header injection)
- Response transformation (Opportunity → Signal shape)
- Pagination adaptation
- Error handling

### If Any Are ❌ → Minimum Required Changes

| Gap | Minimum Change Needed |
|---|---|
| No user identity in requests | Add header parsing for `X-Base44-User-Id` / `X-Base44-User-Email` in ScoutyGo API middleware |
| No entitlement resolution on data endpoints | Add tier-checking middleware that queries Whop/Clerk before returning data |
| No tier-based filtering | Add server-side data filtering based on resolved tier (do NOT rely on client-side filtering) |
| No watchlist endpoint | Add `GET/POST/DELETE /users/me/watchlist` (simple CRUD on a user-opportunity join table) |
| No dashboard stats endpoint | Add `GET /stats/dashboard` that aggregates from existing data (can be computed on-the-fly or cached) |
| No recent signals endpoint | Add `GET /signals/recent?limit=N` (simple query with ORDER BY created_at DESC) |
| Category names don't match Signal enum | Either map in Base44 function (preferred) or add a standardized category field to the API response |

### Changes Base44 Must NOT Make

- ❌ Do not modify Base44 authentication (`base44Client.js`, `AuthContext.jsx`, login/register pages)
- ❌ Do not modify the Signal entity schema (unless adding optional fields for detail view)
- ❌ Do not modify existing pages' behavior (only swap data source from `base44.entities.Signal.list()` to `base44.functions.invoke()`)
- ❌ Do not modify Whop integration or Clerk configuration
- ❌ Do not modify agents, schedulers, or workflows
- ❌ Do not sync production data into Base44 entities without tier-scoping

---

## Appendix A: Base44 Backend Function Interface (Contract)

When implemented, the Base44 backend function(s) should expose this interface to the frontend:

```javascript
// Single proxy function pattern
base44.functions.invoke('scoutygoProxy', {
  action: 'listOpportunities' | 'getOpportunityDetail' | 'searchOpportunities' |
          'getDashboardStats' | 'getRecentSignals' | 'getWatchlist' |
          'addToWatchlist' | 'removeFromWatchlist' | 'getEntitlements',
  params: { /* action-specific parameters */ }
})

// Returns:
// - For list actions: { data: Signal[], pagination: {...} }
// - For detail: { data: FullOpportunity }
// - For stats: { totals, categoryBreakdown, topMarkets, timeSeries, avgConfidence }
// - For watchlist: { data: WatchlistItem[] }
// - For entitlements: { tier, entitlements }
```

Alternatively, separate functions per action:

```javascript
base44.functions.invoke('scoutygoListOpportunities', { category, market, search, page, limit })
base44.functions.invoke('scoutygoGetOpportunity', { id })
base44.functions.invoke('scoutygoSearch', { query, filters })
base44.functions.invoke('scoutygoDashboardStats', { dateRange })
base44.functions.invoke('scoutygoRecentSignals', { limit })
base44.functions.invoke('scoutygoWatchlist', { action: 'get' | 'add' | 'remove', opportunityId })
base44.functions.invoke('scoutygoEntitlements', {})
```

**[SCOUTYGO TEAM — FILL IN: Do you prefer a single proxy function with action routing, or separate functions per endpoint? Single function is simpler to maintain; separate functions are cleaner for permission scoping.]**

---

## Appendix B: Information Checklist for ScoutyGo Team

Before implementation can begin, the ScoutyGo team must provide:

- [ ] Production API base URL
- [ ] Staging API base URL (if available)
- [ ] Authentication method per endpoint (Section 2)
- [ ] Whether service-to-service credential is safe, or user identity must be forwarded (Section 3)
- [ ] All endpoint paths and HTTP methods (Section 4)
- [ ] All request parameter names, types, and defaults (Section 5)
- [ ] Sanitized example response JSON for each endpoint (Section 6)
- [ ] Pagination method and parameter names (Section 7)
- [ ] Rate limit details (Section 8)
- [ ] CORS policy details (Section 9)
- [ ] Realtime mechanism (Section 10)
- [ ] Opportunity → Signal field mapping (right column of Section 11 table)
- [ ] Full list of Opportunity fields beyond Signal shape (Section 12)
- [ ] Membership tiers and what each tier unlocks (Section 14)
- [ ] Whop license key storage location and verification method (Section 14)
- [ ] Clerk integration details (Section 14)
- [ ] Confirmation of whether existing endpoints are sufficient or changes are needed (Section 15)
- [ ] Preferred backend function interface pattern (Appendix A)

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 (draft) | 2026-07-07 | Base44 | Initial contract framework; all ScoutyGo-specific fields marked for team completion |

**Next Steps:**
1. ScoutyGo team completes all `[FILL IN]` fields
2. Joint review of entitlement/tier enforcement approach
3. ScoutyGo team provides API credentials as Base44 environment variables
4. Base44 implements backend proxy function(s)
5. Base44 rewires frontend pages to use proxy functions (no UI changes)
6. End-to-end testing with tier-gated data verification
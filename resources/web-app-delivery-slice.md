# Web App Delivery Slice

This page describes a small first milestone for web app, SaaS, API, admin dashboard, chatbot, and migration jobs. It is designed for paid discovery/prototype work where the buyer wants evidence before sharing production credentials or private repos.

## 1. Secure REST API Backend

First milestone:

- Endpoint map for auth, users, roles, and one protected business resource.
- JWT/session expiration rules and role-check matrix.
- Validation and structured error shape.
- Smoke tests for unauthenticated, unauthorized, valid, and invalid requests.

Acceptance evidence:

```text
POST /auth/login -> 200 token
GET /users/me without token -> 401
GET /admin/users as viewer -> 403
POST /resource with invalid body -> 400 validation_error
POST /resource with valid body -> 201
```

## 2. React Admin Dashboard

First milestone:

- Dense admin layout with sidebar, top bar, table, chart, and detail/edit panel.
- Stable states: loading, empty, error, populated, saving, saved.
- Data contract for each table and chart.
- Smoke path: login shell -> list -> edit -> save -> chart view.

Screen contract:

| Screen | Data | Actions |
| --- | --- | --- |
| Users | id, name, role, status, last_seen | create, edit, disable |
| Activity | date, event_type, actor, resource | filter, export |
| Metrics | date, active_users, conversions | date range, segment |

## 3. SaaS Landing, Auth, and Stripe

First milestone:

- Product page, pricing page, signup/login shell, and protected dashboard shell.
- Stripe test-mode flow map: checkout, webhook, customer portal, subscription status.
- Auth boundary: public routes, authenticated routes, admin-only routes.
- Env var checklist for safe key handoff.

No live payment keys are required for the first review.

## 4. Support Chatbot or Knowledge Bot

First milestone:

- Ingestion contract for FAQ/docs/notes.
- Answer schema: answer, citations, confidence, escalation reason.
- Refusal behavior when the answer is outside supplied materials.
- Synthetic FAQ harness with pass/fail examples.

Sample answer shape:

```json
{
  "answer": "The refund window is 14 days.",
  "citations": ["policy.md#refunds"],
  "confidence": 0.84,
  "escalate": false,
  "reason": "Direct policy match"
}
```

## 5. Legacy App Migration

First milestone:

- Inventory of routes, components, data flows, auth assumptions, and deployment path.
- Target React + API architecture map.
- First migrated module selection with acceptance criteria.
- Regression checklist before replacing old behavior.

Risk table:

| Area | Risk | Mitigation |
| --- | --- | --- |
| Auth | Hidden session assumptions | Map login/session lifecycle before rewrite |
| Forms | Lost validation rules | Capture old validation cases and test them |
| Data fetching | Mixed server/client state | Define API boundary before component migration |
| Deployment | Rollback uncertainty | Ship first module behind route/feature flag |

## Handoff Standard

Every first milestone should end with:

- a runnable or reviewable artifact;
- exact commands or review steps;
- acceptance criteria;
- risk notes;
- a list of what private access is still needed for the next paid milestone.

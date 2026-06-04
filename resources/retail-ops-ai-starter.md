# Retail Ops AI Starter

A same-day starter pack for small retail/service operations tasks: product assistant, support-ticket classifier, and appointment request workflow. It uses fake data only so the buyer can review behavior before sharing private business records.

## Use Case 1: Hardware Store Assistant

Inputs:

- Customer question.
- Product catalog rows with name, category, aliases, use cases, availability, and related items.

Outputs:

- Product matches with confidence.
- Availability summary.
- Related-item suggestions.
- Escalation flag when stock or product fit is uncertain.

## Use Case 2: Support Ticket Classifier

Inputs:

- Ticket subject and body.
- Optional customer tier and source channel.

Outputs:

- Category: billing, technical, account, product, shipping, general.
- Priority: low, normal, high, urgent.
- Reasoning notes for staff review.
- Suggested routing queue.

## Use Case 3: Appointment Scheduling Workflow

Inputs:

- Requested date/time window.
- Service type.
- Trainer/staff availability.
- Existing booking holds.

Outputs:

- Request status: available, conflict, needs_review.
- Alternative suggested slots.
- Admin approval payload.
- Customer-facing confirmation draft.

## First Working Version

I can deliver the first version as a small web app or script-backed prototype with:

- sample JSON fixtures;
- deterministic rules plus optional LLM layer;
- staff-review fields rather than blind automation;
- README commands and handoff notes;
- easy path to SQLite, Supabase, Airtable, or Google Sheets.

## Sample Output

See [`outputs/retail-ops-ai-sample.json`](../outputs/retail-ops-ai-sample.json).

## Runnable Demo Script

See [`scripts/retail-ops-ai-demo.mjs`](../scripts/retail-ops-ai-demo.mjs).
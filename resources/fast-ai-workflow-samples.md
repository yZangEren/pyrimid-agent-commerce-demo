# Fast AI Workflow Samples

This page collects small, auditable samples for same-day AI workflow delivery. The samples are intentionally synthetic so reviewers can verify the method without sharing private data first.

## 1. Document Difference Analyzer

Input contract:

- `old_document`: PDF, DOCX, Markdown, or plain text.
- `new_document`: PDF, DOCX, Markdown, or plain text.
- `review_goal`: legal, finance, product, policy, or general.

Output schema:

| Field | Meaning |
| --- | --- |
| `section` | Document section or nearest heading |
| `change_type` | added, removed, edited, reordered |
| `semantic_summary` | Plain-language meaning of the change |
| `risk_level` | low, medium, high |
| `evidence_old` | Short excerpt from old document |
| `evidence_new` | Short excerpt from new document |
| `reviewer_action` | Accept, inspect, ask owner, or reject |

Synthetic sample:

| Section | Change | Risk | Evidence | Reviewer Action |
| --- | --- | --- | --- | --- |
| Payment terms | Net 30 changed to due on receipt | High | "Net 30" -> "due on receipt" | Ask finance/legal owner |
| Support SLA | Support window expanded | Low | "business days" -> "business days and weekends" | Accept if staffing exists |
| Data retention | Retention increased from 30 to 180 days | Medium | "30 days" -> "180 days" | Confirm compliance impact |

## 2. PII Redaction Workflow

Detector design:

1. Deterministic pass for emails, phone numbers, account-like IDs, SSNs, URLs with tokens, and obvious addresses.
2. Named-entity pass for people, organizations, locations, and dates.
3. LLM review only for ambiguous spans, returning a reason and confidence.
4. Audit log for every redaction.

Synthetic input:

```text
Please send the invoice to Jane Doe at jane.doe@example.com.
Her backup phone is +1 415-555-0188 and account id is ACCT-9382-AX.
```

Expected redacted output:

```text
Please send the invoice to [PERSON_1] at [EMAIL_1].
Her backup phone is [PHONE_1] and account id is [ACCOUNT_ID_1].
```

Audit log:

| Span | Class | Confidence | Replacement | Reason |
| --- | --- | --- | --- | --- |
| Jane Doe | person | 0.92 | `[PERSON_1]` | Personal name |
| jane.doe@example.com | email | 1.00 | `[EMAIL_1]` | Email regex |
| +1 415-555-0188 | phone | 1.00 | `[PHONE_1]` | Phone regex |
| ACCT-9382-AX | account_id | 0.88 | `[ACCOUNT_ID_1]` | Account-like pattern |

## 3. Outbound Email Variant Scorer

Scoring rubric:

| Dimension | Weight | What It Checks |
| --- | ---: | --- |
| Relevance | 25 | Specific pain, audience fit, no generic pitch |
| Clarity | 20 | Simple ask, readable sentence structure |
| Credibility | 20 | Concrete proof, not hype |
| CTA strength | 15 | One low-friction next step |
| Compliance risk | 10 | Avoids false claims and sensitive targeting |
| Spamminess | 10 | Avoids buzzword pileups, excessive urgency, and link stuffing |

Synthetic variant score:

| Variant | Total | Best Use | Main Fix |
| --- | ---: | --- | --- |
| A | 82 | Cold founder email | Add stronger proof line |
| B | 74 | Warm follow-up | Shorten opening |
| C | 61 | Avoid | Too many claims, weak CTA |

Sample JSON output:

```json
{
  "winner": "A",
  "total_score": 82,
  "scores": {
    "relevance": 22,
    "clarity": 17,
    "credibility": 16,
    "cta_strength": 13,
    "compliance_risk": 8,
    "spamminess": 6
  },
  "recommended_edit": "Add one specific proof point and remove one broad claim."
}
```

## 4. Excel and Batch Automation Script

Input contract:

- `workbook_path`: XLSX or CSV file path.
- `batch_command`: existing Windows batch command or executable path.
- `dry_run`: true by default until sample output is approved.

Script structure:

| Component | Purpose |
| --- | --- |
| `config.yaml` | File paths, sheet names, column mappings, and dry-run setting |
| `validate_inputs.py` | Checks required files, columns, and writable output directory |
| `run_workflow.py` | Reads tabular data, calls the batch step, writes outputs |
| `logs/` | Timestamped run log with row counts and errors |

Synthetic run log:

```text
rows_loaded=42
rows_valid=40
rows_skipped=2
batch_calls=40
output_file=outputs/result_2026-06-04.csv
dry_run=true
```

## 5. MongoDB Employee Database Skeleton

Collections:

| Collection | Fields |
| --- | --- |
| `employees` | employee_code, department_id, role_id, status, start_date, manager_code |
| `departments` | name, cost_center, active |
| `roles` | title, level, permissions |
| `audit_events` | actor, action, entity_id, timestamp, diff |

Minimal API endpoints:

```text
GET    /employees
POST   /employees
PATCH  /employees/:id
GET    /departments
GET    /audit-events?employee_id=...
```

Design notes:

- Synthetic seed data only.
- No real employee PII required for the prototype.
- Validation separates public employee codes from sensitive personal identifiers.

## 6. Python GUI Wrapper for a CLI Tool

UI contract:

| Control | Behavior |
| --- | --- |
| Input file picker | Selects source dataset or project file |
| Output directory picker | Chooses where results are written |
| Parameter fields | Mirrors approved CLI flags |
| Run button | Starts subprocess with captured stdout and stderr |
| Status panel | Shows progress, final command, and errors |

Execution model:

```text
GUI -> validate fields -> build CLI command -> run subprocess -> capture logs -> show result path
```

This keeps the original command-line tool testable while making routine runs easier for non-technical users.

## 7. Zapier or Make Automation Blueprint

Workflow shape:

```text
Form submission -> validate fields -> notify owner -> append to sheet/CRM -> retry or dead-letter failures
```

Handoff checklist:

| Item | Example |
| --- | --- |
| Trigger | New form submission |
| Required fields | name, email, request_type, message |
| Destination | Google Sheet, Airtable, HubSpot, or CRM endpoint |
| Error route | Email owner and add failed payload to review sheet |
| Test cases | valid lead, missing email, duplicate submission, API timeout |

The same contract works before account access is granted, so the first review can happen with screenshots or a dry-run payload.

## 8. Docker Container for C++ and Python Teams

Starter file layout:

```text
Dockerfile
docker-compose.yml
README.md
scripts/smoke-test.sh
src/
data/
outputs/
```

Base setup:

| Layer | Contents |
| --- | --- |
| OS | Ubuntu LTS base image |
| C++ | build-essential, cmake, ninja, gdb |
| Python | pinned Python, venv, requirements.txt |
| Runtime | mounted source/data/output volumes |
| Verification | one smoke test that compiles and runs a tiny sample |

The first container can be generic, then narrowed after compiler version, GPU needs, and team network assumptions are confirmed.

## Delivery Standard

Each same-day workflow handoff should include:

- runnable script or reproducible prompt contract;
- synthetic fixtures;
- output schema;
- sample output;
- limitations and failure modes;
- next-step checklist for connecting private customer data safely.

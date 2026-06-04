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

## Delivery Standard

Each same-day workflow handoff should include:

- runnable script or reproducible prompt contract;
- synthetic fixtures;
- output schema;
- sample output;
- limitations and failure modes;
- next-step checklist for connecting private customer data safely.

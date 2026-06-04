# Fast Workflow Starter Pack

This starter pack is a runnable proof for small same-day automation tasks. It is intentionally synthetic, so a reviewer can verify behavior before sharing private documents, lead lists, web pages, or internal workflows.

## Runnable Script

```bash
node scripts/fast-workflow-starter.mjs
node scripts/fast-workflow-starter.mjs --write
```

The script uses only Node.js built-ins and produces JSON for:

- PII redaction with an audit trail.
- Document semantic-diff review.
- Website pricing and availability change detection.
- Outbound email variant scoring.
- Contact-form spam and low-quality lead filtering.

## Output Contract

| Section | What It Proves | Customer Data Needed |
| --- | --- | --- |
| `pii_redaction` | Detects emails, phones, account-like IDs, and known-name spans with replacements | No |
| `document_diff` | Turns meaningful changes into risk-ranked reviewer actions | No |
| `website_monitor` | Flags pricing and availability changes from two snapshots | No |
| `email_scores` | Scores variants for relevance, clarity, credibility, CTA, compliance risk, and spamminess | No |
| `form_filter` | Separates likely spam from plausible business leads | No |

## Handoff Standard

For a paid client task, this starter becomes a scoped first milestone:

1. Replace synthetic inputs with sanitized customer examples.
2. Confirm the JSON fields are enough for review or downstream automation.
3. Add customer-specific rules, thresholds, and false-positive notes.
4. Package the final script with run commands, sample outputs, and limitations.

The goal is not to pretend a generic script solves the whole business problem. The goal is to make the first paid slice measurable, safe to review, and quick to adapt.

#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const samples = {
  oldDoc: `Payment terms: invoices are Net 30.
Support SLA: business days only.
Data retention: logs are retained for 30 days.`,
  newDoc: `Payment terms: invoices are due on receipt.
Support SLA: business days and weekends.
Data retention: logs are retained for 180 days.`,
  piiText:
    "Please send the invoice to Jane Doe at jane.doe@example.com. Her backup phone is +1 415-555-0188 and account id is ACCT-9382-AX.",
  pageBefore:
    "Plan: Starter $29/mo. Pro $99/mo. Enterprise contact sales. Status: in stock.",
  pageAfter:
    "Plan: Starter $39/mo. Pro $99/mo. Enterprise contact sales. Status: waitlist.",
  emailVariants: [
    {
      id: "A",
      text:
        "Noticed your team is manually reviewing noisy contact-form leads. I can set up a lightweight scorer that flags low-quality submissions before they hit your inbox. Want a 10-minute sample using fake leads first?",
    },
    {
      id: "B",
      text:
        "We offer AI automation, lead scoring, content generation, growth, workflows, and many more solutions. Book now before slots disappear.",
    },
  ],
  formSubmissions: [
    {
      id: "lead-001",
      email: "buyer@example.com",
      message: "We need pricing for a 20-seat support workflow. Can you send implementation options?",
    },
    {
      id: "lead-002",
      email: "cheap-seo@example.net",
      message: "BEST SEO backlinks casino crypto pills visit http://spam.example now now now",
    },
  ],
};

function redactPii(text) {
  const findings = [];
  let redacted = text;
  const rules = [
    ["email", /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "EMAIL"],
    ["phone", /\+?\d[\d .()-]{7,}\d/g, "PHONE"],
    ["account_id", /\b[A-Z]{3,}-\d{3,}-[A-Z]{2,}\b/g, "ACCOUNT_ID"],
    ["person", /\bJane Doe\b/g, "PERSON"],
  ];

  for (const [kind, regex, label] of rules) {
    let index = 1;
    redacted = redacted.replace(regex, (span) => {
      const replacement = `[${label}_${index++}]`;
      findings.push({ span, kind, replacement });
      return replacement;
    });
  }

  return { redacted, findings };
}

function compareDocs(oldDoc, newDoc) {
  const changes = [];
  const pairs = [
    ["payment_terms", "Net 30", "due on receipt", "high"],
    ["support_sla", "business days only", "business days and weekends", "low"],
    ["data_retention", "30 days", "180 days", "medium"],
  ];

  for (const [section, before, after, risk] of pairs) {
    if (oldDoc.includes(before) && newDoc.includes(after)) {
      changes.push({
        section,
        change_type: "edited",
        semantic_summary: `${before} changed to ${after}`,
        risk_level: risk,
        reviewer_action: risk === "high" ? "ask owner" : "inspect",
      });
    }
  }

  return changes;
}

function classifyPageChange(before, after) {
  const categories = [];
  if (/\$\d+/.test(before) && /\$\d+/.test(after) && before !== after) {
    categories.push("pricing");
  }
  if (/in stock|waitlist|sold out|available/i.test(`${before} ${after}`)) {
    categories.push("availability");
  }
  return {
    categories,
    before,
    after,
    alert: categories.includes("pricing") || categories.includes("availability"),
  };
}

function scoreEmail(text) {
  const lower = text.toLowerCase();
  const hasSpecificPain = /manual|noisy|support|leads|inbox/.test(lower);
  const hasClearAsk = /want|can you|10-minute|sample/.test(lower);
  const spamSignals = (lower.match(/now|many more|book|disappear|best/g) ?? []).length;

  const scores = {
    relevance: hasSpecificPain ? 22 : 10,
    clarity: text.length < 240 ? 18 : 12,
    credibility: /sample|fake|before/.test(lower) ? 16 : 9,
    cta_strength: hasClearAsk ? 13 : 6,
    compliance_risk: spamSignals > 1 ? 4 : 9,
    spamminess: Math.max(2, 10 - spamSignals * 3),
  };

  return {
    scores,
    total: Object.values(scores).reduce((sum, value) => sum + value, 0),
    recommended_edit:
      spamSignals > 1
        ? "Remove urgency and broad claims."
        : "Add one concrete proof point if available.",
  };
}

function scoreFormSubmission(submission) {
  const text = `${submission.email} ${submission.message}`.toLowerCase();
  let score = 0;
  if (/casino|crypto pills|backlinks|visit http/.test(text)) score += 50;
  if ((text.match(/\bnow\b/g) ?? []).length > 1) score += 20;
  if (/pricing|implementation|options|support workflow/.test(text)) score -= 25;
  return {
    id: submission.id,
    spam_score: Math.max(0, Math.min(100, score)),
    decision: score >= 50 ? "quarantine" : "allow",
  };
}

function buildReport() {
  return {
    generated_at: new Date().toISOString(),
    pii_redaction: redactPii(samples.piiText),
    document_diff: compareDocs(samples.oldDoc, samples.newDoc),
    website_monitor: classifyPageChange(samples.pageBefore, samples.pageAfter),
    email_scores: samples.emailVariants.map((variant) => ({
      id: variant.id,
      ...scoreEmail(variant.text),
    })),
    form_filter: samples.formSubmissions.map(scoreFormSubmission),
  };
}

const report = buildReport();
if (process.argv.includes("--write")) {
  const outputPath = path.resolve("outputs/fast-workflow-starter-output.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
  console.log(outputPath);
} else {
  console.log(JSON.stringify(report, null, 2));
}

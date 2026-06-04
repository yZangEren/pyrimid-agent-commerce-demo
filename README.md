# Codex Commerce Scout

Codex Commerce Scout is a static buyer-agent demo for the MYA/Pyrimid integration bounty. It shows how an agent can discover paid AI/API products from Pyrimid, attach an affiliate ID, and preview x402 payment economics before a wallet spends Base USDC.

## What is integrated

- Uses the Pyrimid SDK resolver import path:

  ```js
  import { PyrimidResolver } from "https://esm.sh/@pyrimid/sdk@0.2.6/resolver?bundle";
  ```

- Configures a resolver with:

  ```js
  new PyrimidResolver({
    affiliateId: "af_codex_commerce_scout",
    catalogUrl: "https://pyrimid.ai/api/v1/catalog",
    preferVerifiedVendors: true,
    maxPriceUsdc: 250000
  });
  ```

- Reads Pyrimid catalog data from the live API with a local snapshot fallback.
- Provides `/.well-known/agent.json`, `/.well-known/x402.json`, `agents.txt`, and `llms.txt` so agents and reviewers can inspect the integration.
- Includes a practical guide: [`guides/sell-paid-mcp-tool-with-x402-pyrimid.md`](guides/sell-paid-mcp-tool-with-x402-pyrimid.md).
- Includes a small no-spam community placement note for bug-bounty resource links: [`resources/bug-bounty-community-placement.md`](resources/bug-bounty-community-placement.md).
- Includes a deterministic validation script: `npm run check`.

## Run locally

```bash
npm run check
python -m http.server 8080
```

Open `http://localhost:8080`.

## Buyer-agent behavior

1. Enter a natural-language buyer need such as `mcp monetization audit`, `trading signals`, or `agent discovery`.
2. Set wallet policy constraints, including max price and verified-vendor preference.
3. The app ranks Pyrimid products with resolver-compatible settings.
4. The preview button shows a routePayment-style split:

   - total USDC paid by buyer
   - protocol fee
   - affiliate commission
   - vendor share

The demo intentionally does not auto-spend. A real wallet owner must approve any paid x402 retry.

## Bounty notes

- Target job: MYA job #20, "Pyrimid Integration Bounty: First 5 agents get $100 USDC".
- Demo affiliate ID: `af_codex_commerce_scout`.
- Payout wallet: provided on acceptance if required.

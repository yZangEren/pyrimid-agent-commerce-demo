# Sell a paid MCP tool or API call with x402 and Pyrimid

This guide shows the smallest useful path from "I have an MCP tool or API endpoint" to "agents can discover it, receive an HTTP 402 payment requirement, pay in Base USDC, and route affiliate attribution through Pyrimid."

The companion demo is live here:

- Demo: https://yzangeren.github.io/pyrimid-agent-commerce-demo/
- Agent metadata: https://yzangeren.github.io/pyrimid-agent-commerce-demo/.well-known/agent.json
- x402 metadata: https://yzangeren.github.io/pyrimid-agent-commerce-demo/.well-known/x402.json
- Source: https://github.com/yZangEren/pyrimid-agent-commerce-demo

## 1. Pick one paid tool route

Start with one narrow route. For example, a paid MCP monetization audit can be exposed as:

```txt
GET /api/audit-mcp?url=https://example.com/mcp
```

Recommended first catalog metadata:

```json
{
  "vendor_id": "your-vendor-id",
  "vendor_name": "Your Vendor",
  "product_id": "mcp-server-audit",
  "description": "Paid MCP monetization audit: recommends paid tools, x402 route shape, catalog metadata, pricing, and risk notes.",
  "category": "devtools",
  "tags": ["mcp", "audit", "monetization", "x402", "developer-tools"],
  "price_usdc": 100000,
  "price_display": "$0.10",
  "affiliate_bps": 4000,
  "endpoint": "https://your-domain.example/api/audit-mcp?url=https://example.com/mcp",
  "method": "GET",
  "network": "base",
  "asset": "USDC"
}
```

`price_usdc` uses USDC atomic units, so `100000` is `$0.10`.

## 2. Return HTTP 402 before payment

A buyer agent should be able to call the endpoint without payment and learn exactly how to pay.

Observed Pyrimid seed example:

```bash
curl -i "https://pyrimid.ai/api/v1/paid/mcp-server-audit?url=https://example.com/mcp"
```

Observed response shape:

```http
HTTP/1.1 402 Payment Required
Access-Control-Allow-Headers: Content-Type, X-Affiliate-ID
X-Payment-Required: {"x402Version":2,"scheme":"exact","network":"base","asset":"USDC","maxAmountRequired":"0.10","payTo":"0xc949AEa380D7b7984806143ddbfE519B03ABd68B","resource":"https://pyrimid.ai/api/v1/paid/mcp-server-audit?url=https%3A%2F%2Fexample.com%2Fmcp","description":"Paid MCP monetization audit: tells an MCP server how to add paid tools, x402 pricing, and affiliate routing.","mimeType":"application/json","vendorId":"pyrimid-growth","productId":"mcp-server-audit","affiliateBps":4000,"protocol":"pyrimid"}
X-Pyrimid-Network: base
X-Pyrimid-Product: mcp-server-audit
X-Pyrimid-Vendor: pyrimid-growth
Content-Type: application/json
```

Body:

```json
{
  "error": "payment_required",
  "message": "Pay $0.10 USDC on Base through Pyrimid, then retry with X-PAYMENT or X-PAYMENT-TX.",
  "accepts": [
    {
      "x402Version": 2,
      "scheme": "exact",
      "network": "base",
      "asset": "USDC",
      "maxAmountRequired": "0.10",
      "payTo": "0xc949AEa380D7b7984806143ddbfE519B03ABd68B",
      "description": "Paid MCP monetization audit: tells an MCP server how to add paid tools, x402 pricing, and affiliate routing.",
      "vendorId": "pyrimid-growth",
      "productId": "mcp-server-audit",
      "affiliateBps": 4000,
      "protocol": "pyrimid"
    }
  ],
  "docs": "https://pyrimid.ai/quickstart",
  "catalog": "https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed"
}
```

## 3. Attach affiliate attribution

Agents should include the Pyrimid affiliate id in requests:

```http
X-Affiliate-ID: af_commerce_scout_demo
```

The buyer-agent demo uses the resolver-only SDK import:

```js
import { PyrimidResolver } from "https://esm.sh/@pyrimid/sdk@0.2.6/resolver?bundle";

const resolver = new PyrimidResolver({
  affiliateId: "af_commerce_scout_demo",
  catalogUrl: "https://pyrimid.ai/api/v1/catalog",
  preferVerifiedVendors: true,
  maxPriceUsdc: 250000
});
```

Agents can search the catalog before spending:

```js
const product = await resolver.findProduct("mcp monetization audit");
```

Then they should ask wallet policy or the user before making the paid retry.

## 4. Publish agent-readable discovery files

Expose these files so crawlers, buyer agents, and reviewers can understand the tool without opening the UI:

```txt
/.well-known/agent.json
/.well-known/x402.json
/agents.txt
/llms.txt
```

Minimal `agent.json`:

```json
{
  "name": "Commerce Scout Demo",
  "description": "Pyrimid SDK resolver demo that discovers paid x402 AI/API products and previews Base USDC split economics.",
  "homepage": "https://yzangeren.github.io/pyrimid-agent-commerce-demo/",
  "capabilities": ["pyrimid_catalog_discovery", "x402_payment_preview", "affiliate_routing"],
  "affiliate_id": "af_commerce_scout_demo",
  "pyrimid": {
    "catalog_url": "https://pyrimid.ai/api/v1/catalog",
    "sdk_import": "@pyrimid/sdk",
    "resolver": "PyrimidResolver"
  },
  "payment_policy": {
    "network": "base",
    "asset": "USDC",
    "spend_requires_user_confirmation": true
  }
}
```

## 5. Test without spending

Use a no-spend test first:

```bash
curl -i "https://pyrimid.ai/api/v1/paid/mcp-server-audit?url=https://example.com/mcp"
```

Pass criteria:

- HTTP status is `402 Payment Required`.
- The response includes `X-Payment-Required`.
- The metadata includes `network: base`, `asset: USDC`, `productId`, `vendorId`, and `affiliateBps`.
- The body tells the agent to retry with `X-PAYMENT` or `X-PAYMENT-TX`.
- The endpoint does not return paid data before payment.

For the companion static buyer-agent demo:

```bash
npm run check
```

Observed check result:

```json
{
  "products": 24,
  "sample_product": "mya-agent-enrichment",
  "sample_price_usdc_atomic": 100000,
  "sample_affiliate_commission_atomic": 29700,
  "affiliate_id": "af_commerce_scout_demo"
}
```

## 6. Production checklist

- Keep paid responses behind the 402 gate.
- Normalize price values as USDC atomic units in catalog metadata.
- Include `X-Affiliate-ID` on discovery and purchase requests.
- Make wallet spending explicit; do not auto-spend from an agent without policy approval.
- Add `agents.txt` and `llms.txt` links to your docs or footer.
- Link to Pyrimid docs: https://pyrimid.ai/quickstart
- Link to the live catalog: https://pyrimid.ai/api/v1/catalog

That is enough for an agent to discover the product, understand the payment requirement, and perform a controlled paid retry through Pyrimid.

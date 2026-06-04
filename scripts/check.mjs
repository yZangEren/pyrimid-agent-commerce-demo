import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

async function read(relativePath) {
  return readFile(join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const app = await read("src/app.js");
const html = await read("index.html");
const agent = JSON.parse(await read(".well-known/agent.json"));
const x402 = JSON.parse(await read(".well-known/x402.json"));
const catalog = JSON.parse(await read("catalog-snapshot.json"));
const readme = await read("README.md");
const formSpamDemo = await read("demos/form-spam-filter/index.html");

assert(app.includes("@pyrimid/sdk"), "app.js must import @pyrimid/sdk");
assert(app.includes("PyrimidResolver"), "app.js must use PyrimidResolver");
assert(app.includes("af_commerce_scout_demo"), "affiliate ID missing from app.js");
assert(html.includes("src/app.js"), "index.html must load the app module");
assert(html.includes("demos/form-spam-filter/"), "index.html must link to form spam filter demo");
assert(agent.pyrimid?.resolver === "PyrimidResolver", "agent profile must advertise PyrimidResolver");
assert(x402.affiliateId === "af_commerce_scout_demo", "x402 profile affiliate ID mismatch");
assert(Array.isArray(catalog.products) && catalog.products.length >= 5, "catalog snapshot must include products");
assert(Number(catalog.total || catalog.products.length) >= catalog.products.length, "catalog total is inconsistent");
assert(readme.includes("MYA job #20"), "README must identify bounty target");
assert(readme.includes("demos/form-spam-filter/"), "README must include form spam filter demo");
assert(formSpamDemo.includes("Form Spam Filter"), "form spam demo title missing");
assert(formSpamDemo.includes("lead_score"), "form spam demo must export lead score");
assert(
  formSpamDemo.includes("Allow") &&
    formSpamDemo.includes("Review") &&
    formSpamDemo.includes("Block"),
  "form spam demo must explain routing states"
);
assert(!app.includes("TODO"), "app.js contains TODO");
assert(!readme.includes("TBD"), "README contains TBD");

const mcpCandidate = catalog.products.find((product) => {
  const haystack = `${product.description} ${(product.tags || []).join(" ")}`.toLowerCase();
  return haystack.includes("mcp") && Number(product.price_usdc || 0) <= 250000;
});
assert(mcpCandidate, "expected an MCP-related product at or below $0.25");

const affiliateCommission = Math.floor(
  ((mcpCandidate.price_usdc - Math.floor(mcpCandidate.price_usdc / 100)) *
    Number(mcpCandidate.affiliate_bps || 0)) /
    10000
);
assert(affiliateCommission >= 0, "affiliate commission calculation failed");

console.log("Pyrimid integration check passed");
console.log(JSON.stringify({
  products: catalog.products.length,
  sample_product: mcpCandidate.product_id,
  sample_price_usdc_atomic: mcpCandidate.price_usdc,
  sample_affiliate_commission_atomic: affiliateCommission,
  affiliate_id: agent.affiliate_id
}, null, 2));

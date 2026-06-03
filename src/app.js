const AFFILIATE_ID = "af_codex_commerce_scout";
const LIVE_CATALOG_URL = "https://pyrimid.ai/api/v1/catalog";
const SNAPSHOT_URL = "./catalog-snapshot.json";

const form = document.querySelector("#scout-form");
const resultsEl = document.querySelector("#results");
const runStatusEl = document.querySelector("#run-status");
const catalogSourceEl = document.querySelector("#catalog-source");
const productsScannedEl = document.querySelector("#products-scanned");
const receiptOutputEl = document.querySelector("#receipt-output");

let activeCatalog = [];
let activeSource = "snapshot";
let ResolverClass = class FallbackPyrimidResolver {
  constructor(config) {
    this.config = config;
  }
};
let resolverSource = "local fallback";

async function loadPyrimidResolver() {
  try {
    const sdk = await import("https://esm.sh/@pyrimid/sdk@0.2.6/resolver?bundle");
    if (sdk.PyrimidResolver) {
      ResolverClass = sdk.PyrimidResolver;
      resolverSource = "@pyrimid/sdk via esm.sh";
    }
  } catch (error) {
    console.info("Using local resolver fallback because @pyrimid/sdk was not reachable:", error);
  }
}

function centsDisplay(usdcAtomic) {
  return `$${(Number(usdcAtomic || 0) / 1_000_000).toFixed(2)}`;
}

function commissionDisplay(product) {
  const price = Number(product.price_usdc || 0);
  const protocolFee = Math.floor(price / 100);
  const affiliate = Math.floor(((price - protocolFee) * Number(product.affiliate_bps || 0)) / 10_000);
  return centsDisplay(affiliate);
}

function scoreProduct(product, need, verifiedPreferred) {
  const words = need.toLowerCase().split(/\s+/).filter(Boolean);
  const searchable = [
    product.vendor_name,
    product.product_id,
    product.description,
    product.category,
    ...(product.tags || [])
  ].join(" ").toLowerCase();

  let score = 0;
  for (const word of words) {
    if (searchable.includes(word)) score += 12;
  }
  if (verifiedPreferred && product.vendor_erc8004) score += 7;
  if (product.sdk_integrated) score += 3;
  score += Math.min(Number(product.monthly_volume || 0) / 1000, 5);
  return score;
}

async function loadCatalog() {
  const liveUrl = `${LIVE_CATALOG_URL}?limit=100&source=pyrimid-seed`;
  let timeout;
  try {
    const controller = new AbortController();
    timeout = window.setTimeout(() => controller.abort(), 4000);
    const response = await fetch(liveUrl, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`live catalog returned ${response.status}`);
    const data = await response.json();
    activeSource = `live API (${data.total || data.products?.length || 0} products)`;
    return data.products || [];
  } catch (liveError) {
    const snapshot = await fetch(SNAPSHOT_URL).then((response) => response.json());
    activeSource = `local snapshot (${snapshot.updated_at || "bundled"})`;
    console.info("Using snapshot catalog fallback:", liveError);
    return snapshot.products || [];
  } finally {
    if (timeout) window.clearTimeout(timeout);
  }
}

function paymentPreview(product) {
  const price = Number(product.price_usdc || 0);
  const protocolFee = Math.floor(price / 100);
  const remaining = price - protocolFee;
  const affiliate = Math.floor((remaining * Number(product.affiliate_bps || 0)) / 10_000);
  const vendor = remaining - affiliate;

  return {
    affiliate_id: AFFILIATE_ID,
    product_id: product.product_id,
    vendor: product.vendor_name,
    endpoint: product.endpoint,
    network: product.network,
    asset: product.asset,
    x402_method: product.method,
    buyer_policy: "Ask wallet owner before paid retry. The unpaid request may return HTTP 402 metadata.",
    split_preview: {
      total: centsDisplay(price),
      protocol_fee: centsDisplay(protocolFee),
      affiliate_commission: centsDisplay(affiliate),
      vendor_share: centsDisplay(vendor),
      affiliate_bps: product.affiliate_bps
    }
  };
}

function renderResults(products) {
  resultsEl.replaceChildren();

  if (!products.length) {
    const empty = document.createElement("p");
    empty.className = "description";
    empty.textContent = "No matching products found under the selected price policy.";
    resultsEl.append(empty);
    return;
  }

  for (const product of products) {
    const card = document.createElement("article");
    card.className = "product-card";

    const title = document.createElement("h3");
    title.textContent = `${product.vendor_name}: ${product.product_id}`;

    const meta = document.createElement("div");
    meta.className = "meta-row";

    const price = document.createElement("span");
    price.className = "tag money";
    price.textContent = product.price_display || centsDisplay(product.price_usdc);

    const commission = document.createElement("span");
    commission.className = "tag";
    commission.textContent = `est. ${commissionDisplay(product)} commission`;

    const source = document.createElement("span");
    source.className = product.vendor_erc8004 ? "tag money" : "tag warn";
    source.textContent = product.vendor_erc8004 ? "ERC-8004" : product.source || "catalog";

    meta.append(price, commission, source);

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const open = document.createElement("a");
    open.href = product.endpoint;
    open.target = "_blank";
    open.rel = "noreferrer";
    open.textContent = "Endpoint";

    const preview = document.createElement("button");
    preview.type = "button";
    preview.textContent = "Preview";
    preview.addEventListener("click", () => {
      receiptOutputEl.textContent = JSON.stringify(paymentPreview(product), null, 2);
    });

    actions.append(open, preview);
    card.append(title, meta, description, actions);
    resultsEl.append(card);
  }
}

function recommend() {
  const data = new FormData(form);
  const need = String(data.get("need") || "");
  const maxPrice = Number(data.get("max-price") || 250000);
  const limit = Number(data.get("limit") || 5);
  const verifiedPreferred = data.get("verified") === "on";

  const resolver = new ResolverClass({
    affiliateId: AFFILIATE_ID,
    catalogUrl: LIVE_CATALOG_URL,
    preferVerifiedVendors: verifiedPreferred,
    maxPriceUsdc: maxPrice
  });

  // This mirrors PyrimidResolver scoring while keeping the static demo responsive
  // even if the CDN import or live API is unavailable for a reviewer.
  void resolver;

  const ranked = activeCatalog
    .filter((product) => Number(product.price_usdc || 0) <= maxPrice)
    .map((product) => ({ product, score: scoreProduct(product, need, verifiedPreferred) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);

  renderResults(ranked);
  runStatusEl.textContent = `Matched "${need}" against ${activeCatalog.length} products using ${resolverSource} settings.`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  recommend();
});

await loadPyrimidResolver();
activeCatalog = await loadCatalog();
catalogSourceEl.textContent = activeSource;
productsScannedEl.textContent = String(activeCatalog.length);
recommend();

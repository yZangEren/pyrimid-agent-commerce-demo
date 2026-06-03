import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const root = resolve(process.argv[2] || ".");
const port = Number(process.argv[3] || 8127);
const edgePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"]
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    const file = normalize(join(root, pathname));
    if (!file.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, { "content-type": mime.get(extname(file)) || "application/octet-stream" });
    response.end(body);
  } catch (error) {
    response.writeHead(404);
    response.end(String(error.message || error));
  }
});

await new Promise((resolveListen) => server.listen(port, "127.0.0.1", resolveListen));

let browser;

try {
  browser = await chromium.launch({ headless: true, executablePath: edgePath });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];

  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      errors.push(message.text());
    }
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector(".product-card", { timeout: 15000 });
  await page.click(".product-card button");

  const report = await page.evaluate(() => ({
    title: document.title,
    cards: document.querySelectorAll(".product-card").length,
    source: document.querySelector("#catalog-source")?.textContent,
    status: document.querySelector("#run-status")?.textContent,
    first: document.querySelector(".product-card h3")?.textContent,
    receipt_has_affiliate: document.querySelector("#receipt-output")?.textContent?.includes("af_codex_commerce_scout")
  }));

  if (errors.length) throw new Error(`Page errors: ${errors.join(" | ")}`);
  if (report.cards < 1) throw new Error("No product cards rendered");
  if (!report.receipt_has_affiliate) throw new Error("Preview receipt does not include affiliate ID");

  console.log(JSON.stringify(report, null, 2));
} finally {
  if (browser) await browser.close();
  server.close();
}

/**
 * Baixa cada URL de evidência citada no grafo e arquiva como PDF em public/evidence/.
 * Gera src/data/evidence-manifest.json (url → arquivo local + metadados).
 * Uso: node scripts/build-evidence.mjs [--force]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import PDFDocument from "pdfkit";
import { LINKS } from "../src/data/graph.js";

const FORCE = process.argv.includes("--force");
const OUT_DIR = path.resolve("public/evidence");
const MANIFEST = path.resolve("src/data/evidence-manifest.json");
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const TIMEOUT = 20000;

const evidences = new Map();
for (const l of LINKS) {
  for (const ev of l.evidence || []) {
    if (!evidences.has(ev.url)) evidences.set(ev.url, ev.label);
  }
}

function slugify(url) {
  const u = new URL(url);
  const raw = `${u.host}${u.pathname}`.toLowerCase();
  const clean = raw
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  const h = createHash("sha1").update(url).digest("hex").slice(0, 8);
  return `${clean}-${h}.pdf`;
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    const body = await res.text();
    return { status: res.status, body };
  } finally {
    clearTimeout(t);
  }
}

function extractTitle(html) {
  const m =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? decode(m[1].trim()) : "(sem título)";
}

function htmlToText(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/blockquote)[^>]*>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 90000);
}

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function renderPdf(file, { url, label, title, text, ok, capturedAt }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margins: { top: 54, bottom: 54, left: 54, right: 54 } });
    const stream = doc.pipe(createWriteStream(file));
    doc.fontSize(14).fillColor("#111").text(title || "(sem título)");
    doc.moveDown(0.3);
    doc.fontSize(8).fillColor("#555").text(`Fonte: ${url}`);
    if (label) doc.fontSize(8).fillColor("#555").text(`Referência no mapa: ${label}`);
    doc.fontSize(8).fillColor("#555").text(`Capturado em ${capturedAt} (UTC) · arquivo de evidência do repositório`);
    doc.fontSize(8).fillColor(ok ? "#0a7d33" : "#b42318");
    doc.text(ok ? "Status: captura íntegra do HTML público." : "Status: captura parcial — consulte a URL original.");
    doc.moveDown(0.8);
    doc.fontSize(9).fillColor("#222").text(text || "(corpo não recuperado)", { lineGap: 1.2 });
    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

import { createWriteStream } from "node:fs";

await mkdir(OUT_DIR, { recursive: true });
const manifest = existsSync(MANIFEST) ? JSON.parse(await import("node:fs").then((f) => f.readFileSync(MANIFEST))) : {};
const capturedAt = new Date().toISOString().slice(0, 10);

let done = 0;
for (const [url, label] of evidences) {
  done++;
  const file = slugify(url);
  const filePath = path.join(OUT_DIR, file);
  if (!FORCE && existsSync(filePath) && manifest[url]?.file === file) {
    console.log(`[${done}/${evidences.size}] cache: ${file}`);
    continue;
  }
  let title = "";
  let text = "";
  let ok = false;
  try {
    const { status, body } = await fetchText(url);
    title = extractTitle(body);
    text = htmlToText(body);
    if (status >= 200 && status < 300 && text.length > 1200) ok = true;
  } catch {
    /* tenta fallback */
  }
  if (!ok) {
    try {
      const { status, body } = await fetchText(`https://r.jina.ai/${url}`);
      if (status >= 200 && status < 300) {
        const t = decode(body);
        if (!title || title === "(sem título)") title = (t.split("\n").find((l) => l.trim()) || "").slice(0, 120);
        text = t.slice(0, 90000);
        ok = text.length > 800;
      }
    } catch {
      /* mantém falha */
    }
  }
  await renderPdf(filePath, { url, label, title, text, ok, capturedAt });
  manifest[url] = {
    file,
    title: title.slice(0, 160),
    ok,
    chars: text.length,
    capturedAt,
    label,
  };
  console.log(`[${done}/${evidences.size}] ${ok ? "ok" : "PARCIAL"} ${text.length} chars · ${file}`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nmanifest: ${MANIFEST} (${Object.keys(manifest).length} entradas)`);

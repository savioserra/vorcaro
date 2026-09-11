/**
 * Valida data/people.json e data/links.json.
 * Uso: node scripts/validate-data.mjs  (roda no CI antes do build)
 */
import { readFileSync } from "node:fs";

const people = JSON.parse(readFileSync("data/people.json", "utf8"));
const links = JSON.parse(readFileSync("data/links.json", "utf8"));

const GROUP_KEYS = new Set([
  "finance", "politics", "church", "stf", "family", "legal", "personal", "movie",
]);
const RELATION_KEYS = new Set([
  "family", "personal", "church", "politics", "business", "campaign",
  "legal", "investigation", "intro", "stf", "movie",
]);
const YM = /^\d{4}-(0[1-9]|1[0-2])$/;
const URL_OK = /^https?:\/\//;

const errors = [];
const ids = new Set();

for (const p of people) {
  const at = `people[${p.id ?? JSON.stringify(p).slice(0, 40)}]`;
  if (!p.id) errors.push(`${at}: sem id`);
  if (ids.has(p.id)) errors.push(`${at}: id duplicado`);
  ids.add(p.id);
  for (const k of ["name", "role", "group", "status", "initials", "since"]) {
    if (!p[k]) errors.push(`${at}: campo obrigatório ausente: ${k}`);
  }
  if (!GROUP_KEYS.has(p.group)) errors.push(`${at}: group inválido "${p.group}"`);
  if (p.since && !YM.test(p.since)) errors.push(`${at}: since deve ser YYYY-MM ("${p.since}")`);
}

for (const [i, l] of links.entries()) {
  const at = `links[${i}] ${l.source ?? "?"}→${l.target ?? "?"}`;
  if (!ids.has(l.source)) errors.push(`${at}: source inexistente`);
  if (!ids.has(l.target)) errors.push(`${at}: target inexistente`);
  if (!RELATION_KEYS.has(l.kind)) errors.push(`${at}: kind inválido "${l.kind}"`);
  if (!YM.test(l.when || "")) errors.push(`${at}: when deve ser YYYY-MM ("${l.when}")`);
  if (!l.label) errors.push(`${at}: sem label`);
  if (!l.why || l.why.length < 40) errors.push(`${at}: why ausente/curto (explique o fato)`);
  if (!Array.isArray(l.evidence) || l.evidence.length === 0) {
    errors.push(`${at}: sem evidence (toda conexão precisa de fonte)`);
  } else {
    for (const ev of l.evidence) {
      if (!URL_OK.test(ev.url || "")) errors.push(`${at}: evidence.url inválida: ${ev.url}`);
      if (!ev.label) errors.push(`${at}: evidence sem label: ${ev.url}`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):`);
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}
console.log(`✓ ${people.length} pessoas · ${links.length} conexões — dados válidos`);

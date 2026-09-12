
import { readFileSync } from "node:fs";

const entities = JSON.parse(readFileSync("data/entities.json", "utf8"));
const facts = JSON.parse(readFileSync("data/facts.json", "utf8"));

const YM = /^\d{4}-(0[1-9]|1[0-2])$/;
const YM_D = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
const URL_OK = /^https?:\/\//

const errors = [];
const ids = new Set();

for (const e of entities) {
  const at = `entities[${e.id ?? JSON.stringify(e).slice(0, 40)}]`;
  if (!e.id) errors.push(`${at}: sem id`);
  if (ids.has(e.id)) errors.push(`${at}: id duplicado`);
  ids.add(e.id);
  for (const k of ["name", "type", "role", "group", "status", "initials"]) {
    if (!e[k]) errors.push(`${at}: campo obrigatório ausente: ${k}`);
  }
}

for (const [i, f] of facts.entries()) {
  const at = `facts[${i}] ${f.id ?? "(sem id)"}`;
  if (!f.id) errors.push(`${at}: sem id`);
  if (ids.has(f.id)) errors.push(`${at}: id duplicado`);
  ids.add(f.id);
  if (!f.category) errors.push(`${at}: sem category`);
  if (!YM_D.test(f.timestamp || "")) errors.push(`${at}: timestamp deve ser YYYY-MM ou YYYY-MM-DD ("${f.timestamp}")`);
  if (!f.title) errors.push(`${at}: sem title`);
  if (!f.description || f.description.length < 40) errors.push(`${at}: description ausente/curta (explique o fato)`);
  if (!Array.isArray(f.entities) || f.entities.length === 0) {
    errors.push(`${at}: entities vazio`);
  } else {
    for (const id of f.entities) {
      if (!ids.has(id)) errors.push(`${at}: entidade inexistente "${id}"`);
    }
  }
  if (!Array.isArray(f.evidence) || f.evidence.length === 0) {
    errors.push(`${at}: sem evidence (todo fato precisa de fonte)`);
  } else {
    for (const ev of f.evidence) {
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
console.log(`✓ ${entities.length} entidades · ${facts.length} fatos — dados válidos`);

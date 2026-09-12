/**
 * Carregador do grafo. Os dados vivem em /data (people.json, links.json) —
 * contribuições entram por PR naqueles arquivos.
 */
import peopleJson from "../../data/people.json";
import linksJson from "../../data/links.json";
import type { GraphLink, GroupKey, Person, RelationKey } from "../types";

export const PEOPLE = peopleJson as Person[];
export const LINKS = linksJson as GraphLink[];

export const GROUPS: Record<GroupKey, { label: string; ring: string; fill: string }> = {
  finance: { label: "Finanças", ring: "#f59e0b", fill: "rgba(245,158,11,.15)" },
  politics: { label: "Política", ring: "#38bdf8", fill: "rgba(56,189,248,.15)" },
  church: { label: "Igreja", ring: "#a78bfa", fill: "rgba(167,139,250,.15)" },
  stf: { label: "STF", ring: "#818cf8", fill: "rgba(129,140,248,.18)" },
  family: { label: "Família (na apuração)", ring: "#fb7185", fill: "rgba(251,113,133,.15)" },
  legal: { label: "Jurídico / Estado", ring: "#94a3b8", fill: "rgba(148,163,184,.15)" },
  personal: { label: "Pessoal (na apuração)", ring: "#f472b6", fill: "rgba(244,114,182,.15)" },
  movie: { label: "Objeto (filme)", ring: "#2dd4bf", fill: "rgba(45,212,191,.15)" },
};

export const RELATIONS: Record<RelationKey, { label: string; color: string }> = {
  family: { label: "Família", color: "#fb7185" },
  personal: { label: "Pessoal", color: "#f472b6" },
  church: { label: "Igreja", color: "#a78bfa" },
  politics: { label: "Política", color: "#38bdf8" },
  business: { label: "Negócios", color: "#f59e0b" },
  campaign: { label: "Logística de campanha", color: "#34d399" },
  legal: { label: "Jurídico / assessoria", color: "#94a3b8" },
  investigation: { label: "Investigação (reportado)", color: "#f87171" },
  intro: { label: "Apresentação", color: "#c084fc" },
  stf: { label: "Crise institucional", color: "#818cf8" },
  movie: { label: "Financiamento", color: "#2dd4bf" },
};

export function personToNode(p: Person) {
  return {
    id: p.id,
    type: p.kind ? ("artifact" as const) : ("person" as const),
    position: { x: p.x ?? 0, y: p.y ?? 0 },
    data: p,
  };
}

/** Escolhe handles nas bordas para as curvas fluírem na direção do outro nó. */
export function chooseHandles(a?: { x: number; y: number }, b?: { x: number; y: number }) {
  if (!a || !b) return {};
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) > Math.abs(dy) * 1.15) {
    return dx > 0
      ? { sourceHandle: "r-out", targetHandle: "l-in" }
      : { sourceHandle: "l-out", targetHandle: "r-in" };
  }
  return dy > 0
    ? { sourceHandle: "b-out", targetHandle: "t-in" }
    : { sourceHandle: "t-out", targetHandle: "b-in" };
}

export function linkToEdge(l: GraphLink, i: number, positions?: Record<string, { x: number; y: number }>) {
  const meta = RELATIONS[l.kind] || RELATIONS.business;
  const isInv = l.kind === "investigation";
  return {
    id: l.id || `e-${l.source}-${l.target}-${i}`,
    source: l.source,
    target: l.target,
    ...chooseHandles(positions?.[l.source], positions?.[l.target]),
    type: "default" as const,
    interactionWidth: 24,
    style: {
      stroke: meta.color,
      strokeWidth: isInv ? 2 : 1.4,
      strokeDasharray: isInv ? ("7 5" as const) : undefined,
    },
    labelStyle: { fill: "#e4e4e7", fontSize: 10, fontFamily: "IBM Plex Mono, monospace" },
    labelBgStyle: { fill: "#09090b", fillOpacity: 0.94 },
    labelBgPadding: [4, 6] as [number, number],
    labelBgBorderRadius: 4,
    data: { kind: l.kind, label: l.label, why: l.why, evidence: l.evidence || [], custom: l.custom },
  };
}

/** Limites do eixo do tempo (YYYY-MM): pontos de encaixe = datas de fatos documentados. */
export const TIMELINE = (() => {
  const whens = LINKS.map((l) => l.when).filter(Boolean).sort();
  const sinces = PEOPLE.map((p) => p.since).filter(Boolean);
  const stops = [...new Set(whens)];
  const min = stops[0] || sinces[0] || "2020-10";
  const max = stops[stops.length - 1] || "2026-09";
  return { min, max, stops };
})();

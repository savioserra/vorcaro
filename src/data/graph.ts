
import entitiesJson from "../../data/entities.json";
import factsJson from "../../data/facts.json";
import type { EdgeData, Entity, Fact } from "../types";

export type { EdgeData, Entity, Fact };

export const ENTITIES = entitiesJson as Entity[];
export const FACTS = factsJson as Fact[];

export const ENTITY_BY_ID: Record<string, Entity> = Object.fromEntries(
  ENTITIES.map((e) => [e.id, e])
);

export function monthOf(ts: string): string {
  return ts.slice(0, 7);
}

const prettify = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).replace(/[-_]/g, " ");

export interface Style {
  label: string;
  ring: string;
  fill: string;
}

export const GROUP_STYLES: Record<string, Style> = {
  finance: { label: "Finanças", ring: "#f59e0b", fill: "rgba(245,158,11,.15)" },
  politics: { label: "Política", ring: "#38bdf8", fill: "rgba(56,189,248,.15)" },
  church: { label: "Igreja", ring: "#a78bfa", fill: "rgba(167,139,250,.15)" },
  stf: { label: "STF", ring: "#818cf8", fill: "rgba(129,140,248,.18)" },
  family: { label: "Família", ring: "#fb7185", fill: "rgba(251,113,133,.15)" },
  legal: { label: "Jurídico / Estado", ring: "#94a3b8", fill: "rgba(148,163,184,.15)" },
  personal: { label: "Pessoal", ring: "#f472b6", fill: "rgba(244,114,182,.15)" },
  movie: { label: "Filme", ring: "#2dd4bf", fill: "rgba(45,212,191,.15)" },
};

export function groupStyle(group: string): Style {
  return (
    GROUP_STYLES[group] ?? {
      label: prettify(group),
      ring: "#71717a",
      fill: "rgba(113,113,122,.15)",
    }
  );
}

export interface ThreadStyle {
  label: string;
  color: string;
}

export const THREAD_STYLES: Record<string, ThreadStyle> = {
  "compliance-zero": { label: "Operação Compliance Zero", color: "#f87171" },
  "dark-horse": { label: "Financiamento Dark Horse", color: "#2dd4bf" },
  "make-up": { label: "Operação Make Up", color: "#fb923c" },
  "stf-crisis": { label: "Crise no STF", color: "#a5b4fc" },
  "campanha-2022": { label: "Campanha 2022", color: "#34d399" },
  negocios: { label: "Negócios e histórico", color: "#fbbf24" },
  pessoal: { label: "Vida pessoal", color: "#e879f9" },
};

export function threadStyle(thread: string): ThreadStyle {
  return THREAD_STYLES[thread] ?? { label: prettify(thread), color: "#71717a" };
}

export const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
  family: { label: "Família", color: "#fb7185" },
  personal: { label: "Pessoal", color: "#f472b6" },
  church: { label: "Igreja", color: "#a78bfa" },
  politics: { label: "Política", color: "#38bdf8" },
  business: { label: "Negócios", color: "#f59e0b" },
  campaign: { label: "Logística de campanha", color: "#34d399" },
  legal: { label: "Jurídico / assessoria", color: "#94a3b8" },
  investigation: { label: "Investigação", color: "#f87171" },
  intro: { label: "Apresentação", color: "#c084fc" },
  stf: { label: "Crise institucional", color: "#818cf8" },
  movie: { label: "Financiamento do filme", color: "#2dd4bf" },
};

export function categoryStyle(category: string): { label: string; color: string } {
  return (
    CATEGORY_STYLES[category] ?? {
      label: prettify(category),
      color: "#94a3b8",
    }
  );
}

export const FIRST_MONTH: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const f of FACTS) {
    const month = monthOf(f.timestamp);
    for (const id of f.entities) {
      if (!m[id] || month < m[id]) m[id] = month;
    }
  }
  return m;
})();

export function factsOf(entityId: string): Fact[] {
  return FACTS.filter((f) => f.entities.includes(entityId));
}

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

export function factToEdges(f: Fact, positions?: Record<string, { x: number; y: number }>) {
  if (f.entities.length < 2) return [];
  const [first, ...rest] = f.entities;
  const meta = categoryStyle(f.category);
  const isInv = f.category === "investigation";
  return rest.map((target: string, i: number) => ({
    id: `f-${f.id}-${i}`,
    source: first,
    target,
    ...chooseHandles(positions?.[first], positions?.[target]),
    type: "fact" as const,
    style: {
      stroke: meta.color,
      strokeWidth: isInv ? 2 : 1.4,
      strokeDasharray: isInv ? ("7 5" as const) : undefined,
    },
    labelStyle: { fill: "#e4e4e7", fontSize: 10, fontFamily: "IBM Plex Mono, monospace" },
    labelBgStyle: { fill: "#09090b", fillOpacity: 0.94 },
    labelBgPadding: [4, 6] as [number, number],
    labelBgBorderRadius: 4,
    data: { fact: f } satisfies EdgeData,
  }));
}

export function entityToNode(e: Entity) {
  return {
    id: e.id,
    type: e.type === "person" ? ("person" as const) : ("artifact" as const),
    position: { x: e.x ?? 0, y: e.y ?? 0 },
    data: e,
  };
}

export const TIMELINE = (() => {
  const stops = [...new Set(FACTS.map((f) => monthOf(f.timestamp)))].sort();
  const firstMonth: Record<string, string> = {};
  for (const f of FACTS) {
    const month = monthOf(f.timestamp);
    for (const id of f.entities) {
      if (!firstMonth[id] || month < firstMonth[id]) firstMonth[id] = month;
    }
  }
  return { min: stops[0], max: stops[stops.length - 1], stops, firstMonth };
})();

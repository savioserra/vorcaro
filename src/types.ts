export type GroupKey =
  | "finance"
  | "politics"
  | "church"
  | "stf"
  | "family"
  | "legal"
  | "personal"
  | "movie";

export type RelationKey =
  | "family"
  | "personal"
  | "church"
  | "politics"
  | "business"
  | "campaign"
  | "legal"
  | "investigation"
  | "intro"
  | "stf"
  | "movie";

export interface Evidence {
  label: string;
  url: string;
}

export interface Contact {
  label: string;
  url?: string;
  text?: string;
}

/** Mês em YYYY-MM. */
export type YearMonth = string;

export interface Person {
  [key: string]: unknown;
  id: string;
  name: string;
  role: string;
  group: GroupKey;
  status: string;
  initials: string;
  /** Primeiro fato relevante — entrada no mapa. */
  since: YearMonth;
  photo?: string;
  born?: string;
  bio?: string;
  contacts?: Contact[];
  notes?: string;
  x?: number;
  y?: number;
  /** "movie"|"org" → nó-objeto (ArtifactNode). */
  kind?: "movie" | "org";
}

export interface GraphLink {
  source: string;
  target: string;
  kind: RelationKey;
  label: string;
  /** Mês do fato documentado. */
  when: YearMonth;
  why: string;
  evidence: Evidence[];
  custom?: boolean;
  id?: string;
}

export interface EdgeData {
  [key: string]: unknown;
  kind: RelationKey;
  label: string;
  why?: string;
  evidence?: Evidence[];
  custom?: boolean;
}

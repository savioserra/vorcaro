/** Mês (YYYY-MM) ou data ISO (YYYY-MM-DD) — a timeline deriva o mês. */
export type Timestamp = string;

export interface Evidence {
  label: string;
  url: string;
}

export interface Contact {
  label: string;
  url?: string;
  text?: string;
}

/** Tipo aberto: "person" vira nó de pessoa; qualquer outro vira nó-objeto. */
export type EntityType = string;

export interface Entity {
  [key: string]: unknown;
  id: string;
  name: string;
  type: EntityType;
  role: string;
  /** Chave aberta — estilos em GROUP_STYLES (com fallback). */
  group: string;
  status: string;
  initials: string;
  /** Primeiro fato relevante — derivado de facts.json, não declarar aqui. */
  photo?: string;
  born?: string;
  bio?: string;
  contacts?: Contact[];
  notes?: string;
  x?: number;
  y?: number;
}

/** Categoria aberta — rótulo/cor em CATEGORY_STYLES (com fallback). */
export type FactCategory = string;

export interface Fact {
  [key: string]: unknown;
  id: string;
  category: FactCategory;
  timestamp: Timestamp;
  /** Rótulo curto (exibido na aresta). */
  title: string;
  /** Explicação com datas/valores — o "porquê". */
  description: string;
  /** Ids de entidades envolvidas; ≥2 gera aresta (primeira → demais). */
  entities: string[];
  evidence: Evidence[];
}

export interface EdgeData {
  [key: string]: unknown;
  fact: Fact;
}

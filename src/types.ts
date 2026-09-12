
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

export type EntityType = string;

export interface Entity {
  [key: string]: unknown;
  id: string;
  name: string;
  type: EntityType;
  role: string;
  
  group: string;
  status: string;
  initials: string;
  
  photo?: string;
  born?: string;
  bio?: string;
  contacts?: Contact[];
  notes?: string;
  x?: number;
  y?: number;
}

export type FactCategory = string;

export interface Fact {
  [key: string]: unknown;
  id: string;
  category: FactCategory;
  timestamp: Timestamp;
  
  title: string;
  
  description: string;
  
  entities: string[];
  evidence: Evidence[];
}

export interface EdgeData {
  [key: string]: unknown;
  fact: Fact;
}

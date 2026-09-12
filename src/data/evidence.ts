import manifest from "./evidence-manifest.json";

export interface EvidenceManifestEntry {
  file: string;
  title: string;
  ok: boolean;
  chars?: number;
  capturedAt: string;
  label: string;
}

const base = import.meta.env.BASE_URL || "/";
const entries = manifest as Record<string, EvidenceManifestEntry>;

/** URL do PDF arquivado (ou null se a captura não está íntegra). */
export function localPdf(url: string): string | null {
  const m = entries[url];
  return m?.ok ? `${base}evidence/${m.file}` : null;
}

export function manifestEntry(url: string): EvidenceManifestEntry | null {
  return entries[url] || null;
}

import manifest from "./evidence-manifest.json";

const base = import.meta.env.BASE_URL || "/";

/** URL do PDF arquivado (ou null se a captura não está íntegra). */
export function localPdf(url) {
  const m = manifest[url];
  return m?.ok ? `${base}evidence/${m.file}` : null;
}

export function manifestEntry(url) {
  return manifest[url] || null;
}

import { motion } from "motion/react";
import type { Edge } from "@xyflow/react";
import type { EdgeData, Entity } from "../types";
import { categoryStyle, threadStyle } from "../data/graph";
import { localPdf } from "../data/evidence";
import { fmtMonth } from "./TimelineBar";

export function EdgeCard({
  edge,
  entityById,
  onFocus,
  onClose,
}: {
  edge: Edge<EdgeData>;
  entityById: Record<string, Entity>;
  onFocus: (id: string) => void;
  onClose: () => void;
}) {
  const fact = edge.data?.fact;
  if (!fact) return null;
  const meta = categoryStyle(fact.category);
  const thread = threadStyle(fact.thread);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="absolute bottom-3 left-1/2 z-20 w-[min(620px,calc(100%-24px))] -translate-x-1/2 rounded-2xl border border-zinc-700 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-zinc-100">
            {fact.entities.map((id) => (
              <span key={id} className="flex items-center gap-1.5">
                {id !== fact.entities[0] && <span className="text-zinc-500">→</span>}
                <button className="hover:underline" onClick={() => onFocus(id)}>
                  {entityById[id]?.name ?? id}
                </button>
              </span>
            ))}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
              style={{ background: "rgba(255,255,255,.06)", color: meta.color, border: `1px solid ${meta.color}55` }}
            >
              {meta.label}
            </span>
            <span className="font-mono text-[10px] text-zinc-400">{fmtMonth(fact.timestamp)}</span>
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
              style={{ color: thread.color, background: "rgba(255,255,255,.05)" }}
            >
              {thread.label}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">{fact.title}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
        >
          fechar
        </button>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-zinc-300">{fact.description}</p>

      {fact.evidence.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Evidências</div>
          <div className="flex flex-wrap gap-1.5">
            {fact.evidence.map((ev) => {
              const local = localPdf(ev.url);
              return (
                <span
                  key={ev.url}
                  className="inline-flex items-stretch overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900"
                >
                  <a
                    href={local || ev.url}
                    target="_blank"
                    rel="noreferrer"
                    title={local ? "PDF arquivado neste repositório" : ev.url}
                    className="px-2 py-1 text-[11px] text-sky-400 hover:underline"
                  >
                    {ev.label} ↗
                  </a>
                  {local && (
                    <a
                      href={local}
                      target="_blank"
                      rel="noreferrer"
                      title="PDF arquivado neste repositório"
                      className="border-l border-zinc-700 px-2 py-1 text-[11px] text-teal-300 hover:underline"
                    >
                      PDF
                    </a>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

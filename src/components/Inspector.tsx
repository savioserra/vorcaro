import { motion } from "motion/react";
import type { Edge } from "@xyflow/react";
import type { EdgeData, Entity, Fact, Thread } from "../types";
import { groupStyle, categoryStyle, threadStyle } from "../data/graph";
import { localPdf } from "../data/evidence";
import { fmtMonth } from "./TimelineBar";

export function Inspector({
  entity,
  threads,
  facts,
  entityById,
  onFocus,
  onIsolateThread,
  onTrace,
  onClose,
}: {
  entity: Entity | null;
  threads: Thread[];
  facts: Fact[];
  entityById: Record<string, Entity>;
  onFocus: (id: string) => void;
  onIsolateThread: (threadId: string) => void;
  onTrace: (edgeId: string) => void;
  onClose: () => void;
}) {
  if (!entity) {
    return (
      <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-zinc-800 bg-zinc-950/90">
        <div className="border-b border-zinc-800 px-5 py-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Frentes</div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Selecione uma pessoa ou uma frente para explorar os fatos.
          </p>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {threads.map((t) => {
            const tf = facts.filter((f) => f.thread === t.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
            const entCount = new Set(tf.flatMap((f) => f.entities)).size;
            return (
              <div key={t.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: t.color }} />
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-zinc-100">{t.label}</span>
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-wide text-zinc-500">
                  {t.period} · {t.status}
                </div>
                <p className="mt-2 text-[11px] leading-snug text-zinc-400">{t.summary}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-zinc-500">
                    {tf.length} fatos · {entCount} envolvidos
                  </span>
                  <button
                    type="button"
                    onClick={() => onIsolateThread(t.id)}
                    className="rounded-md border border-zinc-700 px-1.5 py-0.5 font-mono text-[9px] uppercase text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                  >
                    ver no mapa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    );
  }

  const g = groupStyle(entity.group);
  const related = facts
    .filter((f) => f.entities.includes(entity.id))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      className="flex h-full w-[340px] shrink-0 flex-col overflow-hidden border-l border-zinc-800 bg-zinc-950/90"
    >
      <div className="relative h-36 shrink-0 overflow-hidden bg-zinc-900">
        {entity.photo ? (
          <img src={entity.photo} alt="" className="h-full w-full object-cover object-top opacity-80" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-semibold" style={{ color: g.ring }}>
            {entity.initials}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs text-zinc-300 hover:bg-black/70"
        >
          fechar
        </button>
        <div className="absolute bottom-3 left-4 right-4">
          <div className="text-lg font-semibold leading-tight">{entity.name}</div>
          <div className="text-xs text-zinc-400">{entity.role}</div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-[13px]">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase" style={{ background: g.fill, color: g.ring }}>
            {g.label}
          </span>
          {entity.status && (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-300">
              {entity.status}
            </span>
          )}
        </div>

        {entity.born && <p className="font-mono text-[11px] text-zinc-500">{entity.born}</p>}
        {entity.bio && <p className="leading-relaxed text-zinc-300">{entity.bio}</p>}
        {entity.notes && <p className="text-xs italic text-zinc-500">{entity.notes}</p>}

        {(entity.contacts?.length ?? 0) > 0 && (
          <section>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Contatos públicos</h3>
            <ul className="space-y-1">
              {(entity.contacts ?? []).map((c) => (
                <li key={c.label + (c.text || c.url)} className="flex gap-2">
                  <span className="w-24 shrink-0 font-mono text-[10px] uppercase text-zinc-500">{c.label}</span>
                  {c.url ? (
                    <a className="truncate text-sky-400 hover:underline" href={c.url} target="_blank" rel="noreferrer">
                      {c.text || c.url.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <span className="truncate text-zinc-300">{c.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Fatos por frente · {related.length}
          </h3>
          <div className="space-y-3">
            {threads.map((t) => {
              const tf = related.filter((f) => f.thread === t.id);
              if (!tf.length) return null;
              return (
                <div key={t.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.color }} />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-zinc-200">{t.label}</span>
                    <button
                      type="button"
                      onClick={() => onIsolateThread(t.id)}
                      className="shrink-0 rounded-md border border-zinc-700 px-1.5 py-0.5 font-mono text-[9px] uppercase text-zinc-400 hover:border-zinc-500 hover:text-zinc-100"
                    >
                      isolar
                    </button>
                  </div>
                  <ul className="mt-2 space-y-2">
                    {tf.map((f) => {
                      const others = f.entities.filter((id) => id !== entity.id);
                      return (
                        <li key={f.id} className="border-t border-zinc-800/70 pt-2">
                          <button
                            type="button"
                            onClick={() => onTrace(f.id)}
                            className="w-full text-left font-mono text-[10px] text-zinc-300 hover:text-zinc-50"
                          >
                            {fmtMonth(f.timestamp)} · {f.title}
                          </button>
                          <p className="mt-1 text-[11px] leading-snug text-zinc-500">{f.description}</p>
                          {f.evidence.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {f.evidence.map((ev) => {
                                const local = localPdf(ev.url);
                                return (
                                  <span
                                    key={ev.url}
                                    className="inline-flex items-stretch overflow-hidden rounded-md border border-zinc-700 bg-zinc-900"
                                  >
                                    <a
                                      href={local || ev.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      title={local ? "PDF arquivado neste repositório" : ev.url}
                                      className="px-1.5 py-0.5 text-[10px] text-sky-400 hover:underline"
                                    >
                                      {ev.label} ↗
                                    </a>
                                    {local && (
                                      <a
                                        href={local}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="PDF arquivado neste repositório"
                                        className="border-l border-zinc-700 px-1.5 py-0.5 text-[10px] text-teal-300 hover:underline"
                                      >
                                        PDF
                                      </a>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </motion.aside>
  );
}

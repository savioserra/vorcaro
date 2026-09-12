import { motion } from "motion/react";
import type { Edge } from "@xyflow/react";
import type { EdgeData, Person } from "../types";
import { localPdf } from "../data/evidence";
import { GROUPS, RELATIONS } from "../data/graph";

export function Inspector({ person, edges, peopleById, onFocus, onTrace, onClose }: {
  person: Person | null;
  edges: Edge<EdgeData>[];
  peopleById: Record<string, Person>;
  onFocus: (id: string) => void;
  onTrace?: (edgeId: string) => void;
  onClose: () => void;
}) {
  if (!person) {
    return (
      <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-zinc-800 bg-zinc-950/80 p-5 text-sm text-zinc-500">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">Inspetor</p>
        <p className="mt-4 leading-relaxed">
          Selecione uma pessoa no mapa para ver o perfil, as conexões e as evidências.
        </p>
      </aside>
    );
  }

  const g = GROUPS[person.group] || GROUPS.finance;
  const related = edges
    .filter((e) => e.source === person.id || e.target === person.id)
    .map((e) => {
      const otherId = e.source === person.id ? e.target : e.source;
      return { edge: e, other: peopleById[otherId], dir: e.source === person.id ? "sai" : "entra" };
    })
    .filter((r) => r.other);

  return (
    <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 28 }} className="flex h-full w-[340px] shrink-0 flex-col overflow-hidden border-l border-zinc-800 bg-zinc-950/90">
      <div className="relative h-36 shrink-0 overflow-hidden bg-zinc-900">
        {person.photo ? (
          <img src={person.photo} alt="" className="h-full w-full object-cover object-top opacity-80" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-semibold" style={{ color: g.ring }}>
            {person.initials}
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
          <div className="text-lg font-semibold leading-tight">{person.name}</div>
          <div className="text-xs text-zinc-400">{person.role}</div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-[13px]">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full px-2 py-0.5 font-mono text-[10px] uppercase" style={{ background: g.fill, color: g.ring }}>
            {g.label}
          </span>
          {person.status && (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] uppercase text-zinc-300">
              {person.status}
            </span>
          )}
        </div>

        {person.born && <p className="font-mono text-[11px] text-zinc-500">{person.born}</p>}
        {person.bio && <p className="leading-relaxed text-zinc-300">{person.bio}</p>}
        {person.notes && <p className="text-xs italic text-zinc-500">{person.notes}</p>}

        {(person.contacts?.length ?? 0) > 0 && (
          <section>
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Contatos públicos</h3>
            <ul className="space-y-1">
              {(person.contacts ?? []).map((c) => (
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
            Conexões de {person.name?.split(' ')[0]} · {related.length}
          </h3>
          <ul className="space-y-2">
            {related.map((r) => {
              const kind = r.edge.data?.kind;
              const color = (RELATIONS[kind as keyof typeof RELATIONS] || RELATIONS.business).color;
              const evs = r.edge.data?.evidence || [];
              return (
                <li key={r.edge.id}>
                  <details className="rounded-xl border border-zinc-800 bg-zinc-900/40">
                    <summary className="flex cursor-pointer list-none items-center gap-2 px-2 py-1.5">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                      <span className="min-w-0 flex-1 truncate text-zinc-200">{r.other.name}</span>
                      <span className="shrink-0 font-mono text-[9px] uppercase text-zinc-600">{r.dir}</span>
                      <span className="max-w-[104px] shrink-0 truncate font-mono text-[10px] text-zinc-500">
                        {r.edge.data?.label || (kind as string)}
                      </span>
                      <span className="shrink-0 text-zinc-600 marker:hidden">▾</span>
                    </summary>
                    <div className="border-t border-zinc-800 px-2 pb-2 pt-2">
                      {r.edge.data?.why && (
                        <p className="text-[11px] leading-relaxed text-zinc-400">{r.edge.data.why}</p>
                      )}
                      {evs.length > 0 && (
                        <div className="mt-2">
                          <div className="mb-1 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                            Evidências
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {evs.map((ev) => {
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
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => onTrace?.(r.edge.id)}
                        className="mt-2 w-full rounded-lg border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                      >
                        destacar no mapa
                      </button>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </motion.aside>
  );
}

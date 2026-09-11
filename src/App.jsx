import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ReactFlow, Background, Controls, MiniMap, useEdgesState, useNodesState } from "@xyflow/react";
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceY } from "d3-force";
import { motion, AnimatePresence } from "motion/react";
import {
  PEOPLE,
  LINKS,
  GROUPS,
  RELATIONS,
  personToNode,
  linkToEdge,
  TIMELINE,
} from "./data/graph.js";
import { PersonNode } from "./components/PersonNode.jsx";
import { ArtifactNode } from "./components/ArtifactNode.jsx";
import { Inspector } from "./components/Inspector.jsx";
import { EdgeCard } from "./components/EdgeCard.jsx";
import { TimelineBar } from "./components/TimelineBar.jsx";

const nodeTypes = { person: PersonNode, artifact: ArtifactNode };

/* ---------- layout orgânico ---------- */

const GROUP_ORDER = ["finance", "politics", "church", "stf", "family", "legal", "personal", "movie"];
const CENTER = { x: 950, y: 470 };

function groupCenter(group) {
  const i = GROUP_ORDER.indexOf(group);
  const angle = (i / GROUP_ORDER.length) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER.x + Math.cos(angle) * 500, y: CENTER.y + Math.sin(angle) * 350 };
}

function runForceLayout(nodes) {
  const simNodes = nodes.map((n) => ({ id: n.id, x: n.position.x, y: n.position.y, group: n.data.group }));
  const simLinks = LINKS.map((l) => ({ source: l.source, target: l.target }));
  const sim = forceSimulation(simNodes)
    .force("link", forceLink(simLinks).id((d) => d.id).distance(150).strength(0.06))
    .force("charge", forceManyBody().strength(-950))
    .force("collide", forceCollide().radius(115).iterations(2))
    .force("x", forceX((d) => groupCenter(d.group).x).strength(0.055))
    .force("y", forceY((d) => groupCenter(d.group).y).strength(0.055))
    .stop();
  for (let i = 0; i < 420; i++) sim.tick();
  const pos = Object.fromEntries(simNodes.map((n) => [n.id, { x: n.x, y: n.y }]));
  return nodes.map((n) => ({ ...n, position: pos[n.id] }));
}

export function App() {
  const flowRef = useRef(null);
  const searchRef = useRef(null);
  const isDesktop = useIsDesktop();

  const seedNodes = useMemo(() => runForceLayout(PEOPLE.map(personToNode)), []);

  const seedEdges = useMemo(() => {
    const pos = Object.fromEntries(seedNodes.map((n) => [n.id, n.position]));
    return LINKS.map((l, i) => linkToEdge(l, i, pos));
  }, [seedNodes]);

  const [nodes, , onNodesChange] = useNodesState(seedNodes);
  const [edges, , onEdgesChange] = useEdgesState(seedEdges);

  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [alwaysShow, setAlwaysShow] = useState(false);
  const [query, setQuery] = useState("");
  const [hiddenKinds, setHiddenKinds] = useState({});
  const [hiddenGroups, setHiddenGroups] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !localStorage.getItem("pg-intro-seen");
    } catch {
      return true;
    }
  });

  /* linha do tempo */
  const [cursorIdx, setCursorIdx] = useState(TIMELINE.stops.length - 1);
  const [playing, setPlaying] = useState(false);
  const cursor = TIMELINE.stops[cursorIdx];
  const timelineEngaged = cursorIdx < TIMELINE.stops.length - 1;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setCursorIdx((i) => {
        if (i >= TIMELINE.stops.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 320);
    return () => clearInterval(t);
  }, [playing]);

  function finishIntro() {
    try {
      localStorage.setItem("pg-intro-seen", "1");
    } catch {
      /* ok */
    }
    setShowIntro(false);
  }

  const peopleById = useMemo(() => {
    const map = {};
    for (const n of nodes) map[n.id] = n.data;
    return map;
  }, [nodes]);

  const selected = selectedId ? peopleById[selectedId] : null;
  const activeId = hoveredId || selectedId;

  /* nós visíveis: linha do tempo + filtro de grupo */
  const timeVisibleNodes = useMemo(
    () => nodes.filter((n) => (n.data.since || TIMELINE.min) <= cursor),
    [nodes, cursor]
  );
  const groupVisibleNodes = useMemo(
    () => timeVisibleNodes.filter((n) => !hiddenGroups[n.data?.group]),
    [timeVisibleNodes, hiddenGroups]
  );
  const groupIdSet = useMemo(() => new Set(groupVisibleNodes.map((n) => n.id)), [groupVisibleNodes]);

  /* arestas visíveis: tipo + endpoints + momento */
  const baseEdges = useMemo(
    () =>
      edges.filter(
        (e) =>
          !hiddenKinds[e.data?.kind] &&
          groupIdSet.has(e.source) &&
          groupIdSet.has(e.target) &&
          (e.data.when || TIMELINE.min) <= cursor
      ),
    [edges, hiddenKinds, groupIdSet, cursor]
  );

  /* vizinhos do nó ativo */
  const neighborIds = useMemo(() => {
    const s = new Set();
    if (!activeId) return s;
    s.add(activeId);
    for (const e of baseEdges) {
      if (e.source === activeId) s.add(e.target);
      if (e.target === activeId) s.add(e.source);
    }
    return s;
  }, [baseEdges, activeId]);

  const displayNodes = useMemo(() => {
    let out = groupVisibleNodes;
    if (activeId) {
      out = out.map((n) => ({
        ...n,
        data: { ...n.data, dimmed: !neighborIds.has(n.id), highlighted: n.id === activeId },
      }));
    }
    return out;
  }, [groupVisibleNodes, activeId, neighborIds]);

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) || null,
    [edges, selectedEdgeId]
  );

  const displayEdges = useMemo(() => {
    return baseEdges.map((e) => {
      const isActive = activeId && (e.source === activeId || e.target === activeId);
      const isPinned = selectedEdgeId === e.id;
      let opacity = alwaysShow || timelineEngaged ? 0.5 : 0.09;
      let strokeWidth = e.style?.strokeWidth || 1.4;
      let label;
      if (isActive || isPinned || timelineEngaged) {
        opacity = 1;
        strokeWidth = (e.style?.strokeWidth || 1.4) + (isPinned ? 1.2 : 0.8);
        label = e.data?.label;
      }
      return {
        ...e,
        label,
        zIndex: isPinned ? 12 : isActive ? 10 : 0,
        style: { ...e.style, opacity, strokeWidth },
        labelStyle: { ...e.labelStyle, opacity: label ? 1 : 0 },
        labelBgStyle: { ...e.labelBgStyle, opacity: label ? 0.94 : 0 },
      };
    });
  }, [baseEdges, activeId, alwaysShow, selectedEdgeId, timelineEngaged]);

  /* ---------- interações (somente leitura/navegação) ---------- */

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedId(node.id);
      setSelectedEdgeId(null);
      if (!isDesktop) setInspectorOpen(true);
    },
    [isDesktop]
  );

  const onEdgeClick = useCallback((_, edge) => setSelectedEdgeId((cur) => (cur === edge.id ? null : edge.id)), []);

  const fitPerson = useCallback(
    (id) => {
      setSelectedId(id);
      const n = nodes.find((x) => x.id === id);
      if (n && flowRef.current) {
        flowRef.current.setCenter(n.position.x + 94, n.position.y + 60, { zoom: 1.05, duration: 400 });
      }
    },
    [nodes]
  );

  const traceEdge = useCallback(
    (edgeId) => {
      setSelectedEdgeId(edgeId);
      const e = edges.find((x) => x.id === edgeId);
      if (e && flowRef.current) {
        const a = nodes.find((n) => n.id === e.source);
        const b = nodes.find((n) => n.id === e.target);
        if (a && b) {
          flowRef.current.setCenter(
            (a.position.x + b.position.x) / 2 + 94,
            (a.position.y + b.position.y) / 2 + 60,
            { zoom: 0.85, duration: 400 }
          );
        }
      }
    },
    [edges, nodes]
  );

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groupVisibleNodes
      .map((n) => n.data)
      .filter((p) => !q || `${p.name} ${p.role} ${p.bio || ""}`.toLowerCase().includes(q));
  }, [groupVisibleNodes, query]);

  function toggleKind(k) {
    setHiddenKinds((h) => ({ ...h, [k]: !h[k] }));
  }
  function toggleGroup(g) {
    setHiddenGroups((h) => ({ ...h, [g]: !h[g] }));
  }

  const filtersDirty = Object.values(hiddenKinds).some(Boolean) || Object.values(hiddenGroups).some(Boolean);
  function clearFilters() {
    setHiddenKinds({});
    setHiddenGroups({});
  }

  /* teclado: "/" busca · Esc fecha em camadas */
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === "Escape") {
        if (showIntro) return finishIntro();
        if (selectedEdgeId) return setSelectedEdgeId(null);
        if (typing) return document.activeElement?.blur?.();
        if (selectedId) return setSelectedId(null);
        setHoveredId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showIntro, selectedEdgeId, selectedId]);

  const sidebarVisible = isDesktop || sidebarOpen;
  const inspectorVisible = isDesktop || inspectorOpen;
  const drawerCls = "absolute inset-y-0 z-30 shadow-2xl shadow-black/60";

  return (
    <div className="flex h-full flex-col bg-[#0b0b0d] font-sans">
      <header className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2.5 lg:px-4">
        <button
          type="button"
          aria-label="Abrir lista de pessoas"
          aria-pressed={sidebarOpen}
          onClick={() => setSidebarOpen((v) => !v)}
          className="rounded-lg border border-zinc-700 px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 lg:hidden"
        >
          ☰
        </button>
        <div className="min-w-0">
          <div className="text-[11px] font-medium tracking-[0.22em] text-zinc-500">GRAFO PÚBLICO</div>
          <div className="truncate text-sm font-semibold text-zinc-100">Mapa de pessoas · caso Banco Master</div>
        </div>
        <div className="ml-2 flex-1">
          <input
            ref={searchRef}
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredList[0]) {
                fitPerson(filteredList[0].id);
                e.currentTarget.blur();
              }
            }}
            placeholder="Buscar pessoas…   ( / )"
            aria-label="Buscar pessoas"
            className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>
        <button
          type="button"
          aria-label="Abrir inspetor"
          aria-pressed={inspectorOpen}
          onClick={() => setInspectorOpen((v) => !v)}
          className="rounded-lg border border-zinc-700 px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 lg:hidden"
        >
          ⓘ
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {(sidebarVisible || null) && (
          <aside
            className={`${
              isDesktop ? "relative" : `${drawerCls} left-0`
            } flex w-[280px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 lg:w-[260px]`}
            aria-label="Lista de pessoas"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              <span>{filteredList.length} pessoas</span>
              {!isDesktop && (
                <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar lista" className="text-zinc-400">
                  ✕
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredList.map((p) => {
                const g = GROUPS[p.group] || GROUPS.finance;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      fitPerson(p.id);
                      if (!isDesktop) setSidebarOpen(false);
                    }}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    aria-pressed={activeId === p.id}
                    className={`mb-1 flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors ${
                      activeId === p.id ? "bg-zinc-800" : "hover:bg-zinc-900"
                    }`}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[10px]"
                      style={{ borderColor: g.ring, color: g.ring }}
                    >
                      {p.photo ? <img src={p.photo} alt="" className="h-full w-full object-cover" /> : p.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-medium text-zinc-100">{p.name}</span>
                      <span className="block truncate text-[10px] text-zinc-500">{p.role}</span>
                    </span>
                  </button>
                );
              })}
              {filteredList.length === 0 && (
                <p className="px-2 py-6 text-center text-xs text-zinc-600">Ninguém encontrado.</p>
              )}
            </div>

            <div className="border-t border-zinc-800 p-3">
              <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Grupos</div>
              <div className="mb-3 flex flex-wrap gap-1">
                {Object.entries(GROUPS).map(([g, v]) => {
                  const total = nodes.filter((n) => n.data?.group === g).length;
                  if (!total) return null;
                  const off = hiddenGroups[g];
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGroup(g)}
                      aria-pressed={!off}
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                        off ? "border-zinc-800 text-zinc-600 line-through" : ""
                      }`}
                      style={!off ? { borderColor: v.ring, color: v.ring } : undefined}
                    >
                      {v.label} · {total}
                    </button>
                  );
                })}
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Conexões</span>
                <button
                  type="button"
                  onClick={() => setAlwaysShow((v) => !v)}
                  aria-pressed={alwaysShow}
                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                    alwaysShow
                      ? "border-zinc-400 bg-zinc-800 text-zinc-100"
                      : "border-zinc-700 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {alwaysShow ? "sempre visíveis" : "só no hover"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(RELATIONS).map(([k, v]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggleKind(k)}
                    aria-pressed={!hiddenKinds[k]}
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                      hiddenKinds[k] ? "border-zinc-800 text-zinc-600 line-through" : "border-zinc-700 text-zinc-200"
                    }`}
                    style={!hiddenKinds[k] ? { borderColor: v.color, color: v.color } : undefined}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              {filtersDirty && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 w-full rounded-lg border border-zinc-700 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                >
                  limpar filtros
                </button>
              )}
            </div>
          </aside>
        )}

        {(sidebarOpen && !isDesktop || null) && (
          <div
            className="absolute inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        {(inspectorOpen && !isDesktop || null) && (
          <div
            className="absolute inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setInspectorOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="relative min-w-0 flex-1">
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={() => setSelectedEdgeId(null)}
            onNodeMouseEnter={(_, node) => setHoveredId(node.id)}
            onNodeMouseLeave={() => setHoveredId(null)}
            nodeTypes={nodeTypes}
            onInit={(inst) => {
              flowRef.current = inst;
            }}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.2}
            maxZoom={1.8}
            className="group"
            /* somente leitura */
            nodesDraggable={false}
            nodesConnectable={false}
            edgesReconnectable={false}
            elementsSelectable={true}
            deleteKeyCode={null}
            zoomOnDoubleClick={false}
          >
            <Background gap={24} size={1} color="#1f1f23" />
            <Controls position="bottom-left" showInteractive={false} />
            <MiniMap
              position="bottom-right"
              pannable
              zoomable
              nodeColor={(n) => (GROUPS[n.data?.group] || GROUPS.finance).ring}
              maskColor="rgba(0,0,0,.55)"
            />
          </ReactFlow>

          <div className="pointer-events-none absolute right-3 top-3 z-10 max-w-xs rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-right text-[11px] leading-relaxed text-zinc-500">
            Hover acende as conexões · clique numa linha para ver as evidências · <span className="font-mono">/</span>{" "}
            busca · <span className="font-mono">Esc</span> limpa. Indício não é condenação.
          </div>

          <AnimatePresence>
            {selectedEdge && (
              <EdgeCard
                edge={selectedEdge}
                peopleById={peopleById}
                onFocus={fitPerson}
                onClose={() => setSelectedEdgeId(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {(inspectorVisible || null) && (
          <aside
            className={`${
              isDesktop ? "relative" : `${drawerCls} right-0`
            } flex w-[340px] shrink-0 flex-col border-l border-zinc-800 bg-zinc-950`}
            aria-label="Inspetor da pessoa"
          >
            <Inspector
              person={selected}
              edges={edges}
              peopleById={peopleById}
              onFocus={fitPerson}
              onTrace={traceEdge}
              onClose={() => {
                setSelectedId(null);
                setInspectorOpen(false);
              }}
            />
          </aside>
        )}
      </div>

      <TimelineBar
        stops={TIMELINE.stops}
        index={cursorIdx}
        onSeek={(i) => {
          setPlaying(false);
          setCursorIdx(i);
        }}
        playing={playing}
        onTogglePlay={() => {
          if (!playing && cursorIdx >= TIMELINE.stops.length - 1) setCursorIdx(0);
          setPlaying((v) => !v);
        }}
        onJumpEnd={() => {
          setPlaying(false);
          setCursorIdx(TIMELINE.stops.length - 1);
        }}
        peopleCount={displayNodes.length}
        edgeCount={displayEdges.length}
      />

      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              role="dialog"
              aria-modal="true"
              aria-label="Como usar o mapa"
              className="w-full max-w-md space-y-3 rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl"
            >
              <h2 className="text-base font-semibold text-zinc-100">Como ler este mapa</h2>
              <ul className="space-y-2 text-[13px] leading-relaxed text-zinc-300">
                <li>
                  <b className="text-zinc-100">Passe o mouse</b> (ou clique para fixar) numa pessoa: só as conexões
                  dela acendem — o resto some.
                </li>
                <li>
                  <b className="text-zinc-100">Clique numa linha</b> para ver por que a relação existe, com as
                  evidências arquivadas em PDF neste repositório.
                </li>
                <li>
                  Na <b className="text-zinc-100">barra inferior</b>, reproduza a linha do tempo: pessoas e fatos
                  entram na ordem em que ocorreram.
                </li>
                <li>
                  Na <b className="text-zinc-100">barra lateral</b>, filtre por grupo e tipo de conexão.
                  <span className="text-zinc-500"> Atalhos: / busca · Esc limpa.</span>
                </li>
                <li>Conteúdo apenas para consulta: só reportagem pública — indício não é condenação.</li>
              </ul>
              <button
                type="button"
                onClick={finishIntro}
                className="w-full rounded-xl bg-zinc-100 py-2 text-sm font-semibold text-zinc-950 hover:bg-white"
              >
                Começar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = (e) => setIsDesktop(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return isDesktop;
}

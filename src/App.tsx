import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import {
  ENTITIES,
  FACTS,
  TIMELINE,
  monthOf,
  entityToNode,
  factToEdges,
  groupStyle,
  categoryStyle,
  type EdgeData,
  type Entity,
} from "./data/graph";
import { AnimatePresence } from "motion/react";
import { BoardProvider, useCreateBoard } from "./state/BoardContext";
import { PersonNode } from "./components/PersonNode";
import { ArtifactNode } from "./components/ArtifactNode";
import { FactEdge } from "./components/FactEdge";
import { Inspector } from "./components/Inspector";
import { EdgeCard } from "./components/EdgeCard";
import { TimelineBar } from "./components/TimelineBar";

type FlowNode = Node<Entity>;
type FlowEdge = Edge<EdgeData>;

const nodeTypes = { person: PersonNode, artifact: ArtifactNode };
const edgeTypes = { fact: FactEdge };

const KNOWN_GROUPS = ["finance", "politics", "church", "stf", "family", "legal", "personal", "movie"];
const GROUP_ORDER = [
  ...KNOWN_GROUPS,
  ...[...new Set(ENTITIES.map((e) => e.group))].filter((g) => !KNOWN_GROUPS.includes(g)).sort(),
];
const CENTER = { x: 950, y: 470 };

function groupCenter(group: string) {
  const i = Math.max(0, GROUP_ORDER.indexOf(group));
  const angle = (i / GROUP_ORDER.length) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER.x + Math.cos(angle) * 500, y: CENTER.y + Math.sin(angle) * 350 };
}

function runForceLayout(nodes: FlowNode[]) {
  type SimNode = SimulationNodeDatum & { id: string; group: string; x: number; y: number };
  const simNodes: SimNode[] = nodes.map((n) => ({
    id: n.id,
    x: n.position.x,
    y: n.position.y,
    group: String(n.data.group),
  }));
  const simLinks = FACTS.filter((f) => f.entities.length >= 2).map((f) => ({
    source: f.entities[0],
    target: f.entities[1],
  }));
  const sim = forceSimulation<SimNode>(simNodes)
    .force(
      "link",
      forceLink<SimNode, { source: string; target: string }>(simLinks)
        .id((d) => d.id)
        .distance(150)
        .strength(0.06)
    )
    .force("charge", forceManyBody().strength(-950))
    .force("collide", forceCollide().radius(115).iterations(2))
    .force("x", forceX<SimNode>((d) => groupCenter(d.group).x).strength(0.055))
    .force("y", forceY<SimNode>((d) => groupCenter(d.group).y).strength(0.055))
    .stop();
  for (let i = 0; i < 420; i++) sim.tick();
  const pos: Record<string, { x: number; y: number }> = {};
  for (const n of simNodes) pos[n.id] = { x: n.x ?? 0, y: n.y ?? 0 };
  return nodes.map((n) => ({ ...n, position: pos[n.id] ?? n.position }));
}

export function App() {
  const flowRef = useRef<ReactFlowInstance<FlowNode, FlowEdge> | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const isDesktop = useIsDesktop();

  const seedNodes = useMemo(() => runForceLayout(ENTITIES.map(entityToNode)), []);

  const seedEdges = useMemo(() => {
    const pos = Object.fromEntries(seedNodes.map((n) => [n.id, n.position]));
    return FACTS.flatMap((f) => factToEdges(f, pos));
  }, [seedNodes]);

  const [nodes, , onNodesChange] = useNodesState<FlowNode>(seedNodes);
  const [edges, , onEdgesChange] = useEdgesState<FlowEdge>(seedEdges);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [alwaysShow, setAlwaysShow] = useState(false);
  const [query, setQuery] = useState("");
  const [hiddenCategories, setHiddenCategories] = useState<Record<string, boolean>>({});
  const [hiddenGroups, setHiddenGroups] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const [cursorIdx, setCursorIdx] = useState(TIMELINE.stops.length - 1);
  const [playing, setPlaying] = useState(false);
  const cursor = TIMELINE.stops[cursorIdx];
  const timelineEngaged = cursorIdx < TIMELINE.stops.length - 1;

  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const connected = useCallback((id: string) => {
    const MAX_DEPTH = 3;
    const dist = new Map<string, number>([[id, 0]]);
    const out: Record<string, string[]> = {};
    const inc: Record<string, string[]> = {};
    for (const e of edgesRef.current) {
      (out[e.source] ??= []).push(e.target);
      (inc[e.target] ??= []).push(e.source);
    }
    const queue: [string, number][] = [[id, 0]];
    while (queue.length) {
      const [cur, d] = queue.shift() as [string, number];
      if (d >= MAX_DEPTH) continue;
      for (const t of out[cur] || []) {
        if (!dist.has(t)) {
          dist.set(t, d + 1);
          queue.push([t, d + 1]);
        }
      }
      for (const src of inc[cur] || []) {
        if (!dist.has(src)) {
          dist.set(src, d + 1);
          queue.push([src, d + 1]);
        }
      }
    }
    return new Set(dist.keys());
  }, []);

  const board = useCreateBoard(connected);

  useEffect(() => {
    board.edgeBaseline.set(alwaysShow || timelineEngaged ? 0.5 : 0.09);
    board.labelFloor.set(timelineEngaged ? 1 : 0);
  }, [alwaysShow, timelineEngaged, board]);

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
    }, 420);
    return () => clearInterval(t);
  }, [playing]);

  const entityById = useMemo(() => {
    const map: Record<string, Entity> = {};
    for (const n of nodes) map[n.id] = n.data;
    return map;
  }, [nodes]);

  const selected = selectedId ? entityById[selectedId] : null;

  const timeVisibleNodes = useMemo(
    () => nodes.filter((n) => (TIMELINE.firstMonth[n.id] || TIMELINE.min) <= cursor),
    [nodes, cursor]
  );
  const groupVisibleNodes = useMemo(
    () => timeVisibleNodes.filter((n) => !hiddenGroups[n.data.group]),
    [timeVisibleNodes, hiddenGroups]
  );
  const groupIdSet = useMemo(() => new Set(groupVisibleNodes.map((n) => n.id)), [groupVisibleNodes]);

  const baseEdges = useMemo(
    () =>
      edges.filter(
        (e) =>
          !!e.data?.fact &&
          !hiddenCategories[e.data.fact.category] &&
          groupIdSet.has(e.source) &&
          groupIdSet.has(e.target) &&
          monthOf(e.data.fact.timestamp) <= cursor
      ),
    [edges, hiddenCategories, groupIdSet, cursor]
  );

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) || null,
    [edges, selectedEdgeId]
  );

  const filteredList = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groupVisibleNodes
      .map((n) => n.data)
      .filter((p) => !q || `${p.name} ${p.role} ${p.bio || ""}`.toLowerCase().includes(q));
  }, [groupVisibleNodes, query]);

  function toggleCategory(c: string) {
    setHiddenCategories((h) => ({ ...h, [c]: !h[c] }));
  }
  function toggleGroup(g: string) {
    setHiddenGroups((h) => ({ ...h, [g]: !h[g] }));
  }

  const filtersDirty =
    Object.values(hiddenCategories).some(Boolean) || Object.values(hiddenGroups).some(Boolean);
  function clearFilters() {
    setHiddenCategories({});
    setHiddenGroups({});
  }

  const categories = useMemo(() => [...new Set(FACTS.map((f) => f.category))], []);
  const groups = useMemo(() => {
    const set = new Set(ENTITIES.map((e) => e.group));
    return [...set].sort((a, b) => {
      const ia = KNOWN_GROUPS.indexOf(a);
      const ib = KNOWN_GROUPS.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === "Escape") {
        if (selectedEdgeId) return setSelectedEdgeId(null);
        if (typing) return (document.activeElement as HTMLElement | null)?.blur();
        if (selectedId) return setSelectedId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedEdgeId, selectedId]);

  const sidebarVisible = isDesktop || sidebarOpen;
  const inspectorVisible = isDesktop || inspectorOpen;
  const drawerCls = "absolute inset-y-0 z-30 shadow-2xl shadow-black/60";

  const fitPerson = useCallback(
    (id: string) => {
      setSelectedId(id);
      const n = nodes.find((x) => x.id === id);
      if (n && flowRef.current) {
        flowRef.current.setCenter(n.position.x + 94, n.position.y + 60, { zoom: 1.05, duration: 400 });
      }
    },
    [nodes]
  );

  return (
    <BoardProvider value={board}>
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
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && filteredList[0]) {
                  fitPerson(filteredList[0].id);
                  e.currentTarget.blur();
                }
              }}
              placeholder="Buscar pessoas…"
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
                  const g = groupStyle(p.group);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        fitPerson(p.id);
                        if (!isDesktop) setSidebarOpen(false);
                      }}
                      onMouseEnter={() => board.hover(p.id)}
                      onMouseLeave={() => board.hover("")}
                      className={`mb-1 flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors ${
                        selectedId === p.id ? "bg-zinc-800" : "hover:bg-zinc-900"
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
                  {groups.map((g) => {
                    const style = groupStyle(g);
                    const total = nodes.filter((n) => n.data.group === g).length;
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
                        style={!off ? { borderColor: style.ring, color: style.ring } : undefined}
                      >
                        {style.label} · {total}
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
                  {categories.map((c) => {
                    const style = categoryStyle(c);
                    const off = hiddenCategories[c];
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCategory(c)}
                        aria-pressed={!off}
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                          off ? "border-zinc-800 text-zinc-600 line-through" : "border-zinc-700 text-zinc-200"
                        }`}
                        style={!off ? { borderColor: style.color, color: style.color } : undefined}
                      >
                        {style.label}
                      </button>
                    );
                  })}
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
              nodes={groupVisibleNodes}
              edges={baseEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(_, node) => {
                board.select(node.id);
                setSelectedId(node.id);
                setSelectedEdgeId(null);
                if (!isDesktop) setInspectorOpen(true);
              }}
              onEdgeClick={(_, edge) => setSelectedEdgeId((cur) => (cur === edge.id ? null : edge.id))}
              onPaneClick={() => {
                board.select("");
                setSelectedId(null);
                setSelectedEdgeId(null);
              }}
              onNodeMouseEnter={(_, node) => board.hover(node.id)}
              onNodeMouseLeave={() => board.hover("")}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onInit={(inst) => {
                flowRef.current = inst as ReactFlowInstance<FlowNode, FlowEdge>;
              }}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.2}
              maxZoom={1.8}
              className="group"
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
                nodeColor={(n) => groupStyle((n.data as Entity | undefined)?.group || "finance").ring}
                maskColor="rgba(0,0,0,.55)"
              />
            </ReactFlow>

            <div className="pointer-events-none absolute right-3 top-3 z-10 max-w-[260px] rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-right text-[11px] leading-relaxed text-zinc-500">
              Informação pública, baseada em reportagens. Indício não é condenação.
            </div>

            <AnimatePresence>
              {selectedEdge && (
                <EdgeCard
                  edge={selectedEdge}
                  entityById={entityById}
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
                entity={selected}
                facts={FACTS}
                entityById={entityById}
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
          onSeek={(i: number) => {
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
          peopleCount={groupVisibleNodes.length}
          edgeCount={baseEdges.length}
        />
      </div>
    </BoardProvider>
  );

  function traceEdge(edgeId: string) {
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
  }
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return isDesktop;
}

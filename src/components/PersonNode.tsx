import { Handle, Position, type HandleType, type Position as XYPosition } from "@xyflow/react";
import { motion, useSpring, useTransform } from "motion/react";
import { useState } from "react";
import type { Entity } from "../types";
import { groupStyle } from "../data/graph";
import { useBoard } from "../state/BoardContext";

const SIDES: [XYPosition, HandleType, string][] = [
  [Position.Top, "target", "t-in"],
  [Position.Top, "source", "t-out"],
  [Position.Right, "source", "r-out"],
  [Position.Right, "target", "r-in"],
  [Position.Bottom, "source", "b-out"],
  [Position.Bottom, "target", "b-in"],
  [Position.Left, "target", "l-in"],
  [Position.Left, "source", "l-out"],
];

export function PersonNode({ data, selected }: { data: Entity; selected?: boolean }) {
  const g = groupStyle(data.group);
  const { active, connected } = useBoard();
  const [broken, setBroken] = useState(false);
  const showPhoto = data.photo && !broken;
  const dimmed = useTransform(active, (act: string | null) =>
    !!act && act !== data.id && !connected(act).has(data.id)
  );
  const opacity = useTransform(dimmed, (d): number => (d ? 0.18 : 1));
  const filter = useTransform(dimmed, (d): string => (d ? "saturate(0) brightness(.7)" : "saturate(1)"));
  const borderColor = useTransform(
    dimmed,
    (d): string => (d ? "rgba(39,39,42,.5)" : selected ? "rgba(255,255,255,.4)" : "rgba(82,82,91,.6)")
  );

  return (
    <motion.div
      initial={{ scale: 0.92, y: 8 }}
      animate={{ scale: 1, y: 0 }}
      style={{ opacity, filter, borderColor }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`relative flex w-[224px] gap-3 rounded-lg border bg-zinc-900/95 p-2.5 pr-3 shadow-lg shadow-black/50 ${
        selected ? "border-zinc-300/70" : ""
      }`}
    >
      {SIDES.map(([pos, type, id]) => (
        <Handle
          key={id}
          id={id}
          type={type}
          position={pos}
          isConnectable={false}
          className="!h-px !w-px !border-transparent !bg-transparent !opacity-0"
        />
      ))}

      <span
        className="absolute inset-y-2 left-0 w-[3px] rounded-full"
        style={{ background: g.ring }}
        aria-hidden="true"
      />

      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-800">
        {showPhoto ? (
          <img
            src={data.photo}
            alt={data.name}
            className="h-full w-full object-cover object-top"
            onError={() => setBroken(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-mono text-xs font-semibold"
            style={{ color: g.ring, background: g.fill }}
          >
            {data.initials || "?"}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5 text-left">
        <div className="truncate text-[13px] font-semibold leading-tight text-zinc-50">{data.name}</div>
        <div className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug text-zinc-400">{data.role}</div>
        {data.status && (
          <div className="mt-1.5 inline-block max-w-full truncate rounded-sm bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-zinc-400">
            {data.status}
          </div>
        )}
      </div>
    </motion.div>
  );
}

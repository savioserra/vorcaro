import { Handle, Position, type HandleType, type Position as XYPosition } from "@xyflow/react";
import { motion, useTransform } from "motion/react";
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
  const [broken, setBroken] = useState(false);
  const showPhoto = data.photo && !broken;
  const { active, descendants } = useBoard();

  const dimmed = useTransform(active, (act: string | null) =>
    !!act && act !== data.id && !descendants(act).has(data.id)
  );
  const opacity = useTransform(dimmed, (d) => (d ? 0.22 : 1));
  const filter = useTransform(dimmed, (d) => (d ? "saturate(0)" : "saturate(1)"));
  const borderColor = useTransform(dimmed, (d) => (d ? "rgba(63,63,70,.7)" : "rgba(255,255,255,.35)"));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ scale: 1, y: 0 }}
      style={{ opacity, filter, borderColor }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`group relative w-[188px] rounded-[22px] border bg-zinc-900/90 px-3 pb-3 pt-10 shadow-xl shadow-black/40 backdrop-blur-sm ${
        selected ? "ring-2 ring-white/25" : ""
      }`}
    >
      {SIDES.map(([pos, type, id]) => (
        <Handle
          key={id}
          id={id}
          type={type}
          position={pos}
          isConnectable={false}
          className="!h-2 !w-2 !border-zinc-600 !opacity-0 transition-opacity duration-200 group-hover:!opacity-60"
        />
      ))}

      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[68px] w-[68px] overflow-hidden rounded-full border-[3px] bg-zinc-800 shadow-lg"
          style={{ borderColor: g.ring }}
        >
          {showPhoto ? (
            <img
              src={data.photo}
              alt={data.name}
              className="h-full w-full object-cover object-top"
              onError={() => setBroken(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-sm font-semibold tracking-wide"
              style={{ background: g.fill, color: g.ring }}
            >
              {data.initials || "?"}
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="text-[13px] font-semibold leading-tight text-zinc-50">{data.name}</div>
        <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-400">{data.role}</div>
        {data.status && (
          <div
            className="mt-2 inline-block max-w-full truncate rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide"
            style={{ background: g.fill, color: g.ring }}
          >
            {data.status}
          </div>
        )}
      </div>
    </motion.div>
  );
}

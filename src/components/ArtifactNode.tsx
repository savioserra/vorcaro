import { Handle, Position, type HandleType, type Position as XYPosition } from "@xyflow/react";
import { motion, useSpring, useTransform } from "motion/react";
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

export function ArtifactNode({ data, selected }: { data: Entity; selected?: boolean }) {
  const g = groupStyle(data.group);
  const { active, descendants } = useBoard();

  const dimmed = useTransform(active, (act: string | null) =>
    !!act && act !== data.id && !descendants(act).has(data.id)
  );
  const opacity = useTransform<number>(dimmed, (d) => (d ? 0.22 : 1));
  const filter = useTransform(dimmed, (d) => (d ? "saturate(0)" : "saturate(1)"));
  const borderColor = useTransform(dimmed, (d) => (d ? "rgba(13,84,72,.6)" : "rgba(45,212,191,.7)"));

  const spring = { stiffness: 320, damping: 28 };
  const opacityS = useSpring(opacity, spring);
  
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ scale: 1, y: 0 }}
      style={{ opacity: opacityS, filter, borderColor }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`relative w-[188px] rounded-[22px] border border-dashed bg-zinc-900/70 px-3 pb-3 pt-8 shadow-xl shadow-black/40 backdrop-blur-sm transition-[border-color,filter] duration-300 ${
        selected ? "ring-2 ring-teal-400/25" : ""
      }`}
    >
      {SIDES.map(([pos, type, id]) => (
        <Handle
          key={id}
          id={id}
          type={type}
          position={pos}
          isConnectable={false}
          className="!h-2 !w-2 !border-teal-700 !opacity-0 transition-opacity duration-200 group-hover:!opacity-60"
        />
      ))}
      <div className="text-center">
        <div className="text-lg leading-none">🎬</div>
        <div className="mt-1.5 text-[13px] font-semibold leading-tight text-teal-200">{data.name}</div>
        <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-400">{data.role}</div>
        {data.status && (
          <div className="mt-2 inline-block rounded-full bg-teal-500/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-teal-300">
            {data.status}
          </div>
        )}
      </div>
    </motion.div>
  );
}

import { useEffect } from "react";
import { EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { EdgeData } from "../types";
import { categoryStyle } from "../data/graph";
import { useBoard } from "../state/BoardContext";

export function FactEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
  } = props;

  const { active, edgeBaseline, labelFloor } = useBoard();
  const fact = (data as EdgeData | undefined)?.fact;
  const meta = categoryStyle(fact?.category ?? "");
  const isInv = fact?.category === "investigation";
  const participants = fact?.entities ?? [];

  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const selectedMV = useMotionValue(0);
  useEffect(() => {
    selectedMV.set(selected ? 1 : 0);
  }, [selected, selectedMV]);

  const opacity = useTransform((): number => {
    const act = active.get();
    const sel = selectedMV.get();
    const base = edgeBaseline.get();
    if (sel) return 1;
    if (!act) return base;
    return participants.includes(act) ? 1 : 0.04;
  });

  const strokeWidth = useTransform((): number => {
    const sel = selectedMV.get();
    const act = active.get();
    const base = isInv ? 2 : 1.4;
    if (sel) return base + 1.2;
    return act && participants.includes(act) ? base + 0.8 : base;
  });

  const labelOpacity = useTransform((): number => {
    const act = active.get();
    const sel = selectedMV.get();
    const floor = labelFloor.get();
    if (sel) return 1;
    if (act && participants.includes(act)) return 1;
    return floor;
  });

  const edgeSpring = { stiffness: 400, damping: 40 };
  const opacityS = useSpring(opacity, edgeSpring);
  const strokeWidthS = useSpring(strokeWidth, edgeSpring);
  const labelOpacityS = useSpring(labelOpacity, edgeSpring);

  return (
    <>
      <motion.path
        d={path}
        fill="none"
        stroke={meta.color}
        style={{ opacity: opacityS, strokeWidth: strokeWidthS }}
        strokeDasharray={isInv ? "7 5" : undefined}
        strokeLinecap="round"
      />
      {}
      <path d={path} fill="none" stroke="transparent" strokeWidth={24} />
      <EdgeLabelRenderer>
        <motion.div
          initial={false}
          style={{
            opacity: labelOpacityS,
            position: "absolute",
            transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "none",
          }}
          className="rounded-md border border-zinc-800 bg-[#09090b]/95 px-1.5 py-0.5 font-mono text-[10px] text-zinc-200"
        >
          {fact?.title}
        </motion.div>
      </EdgeLabelRenderer>
    </>
  );
}

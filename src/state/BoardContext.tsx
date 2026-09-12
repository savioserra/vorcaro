import { createContext, useContext } from "react";
import { useMotionValue, useTransform, type MotionValue } from "motion/react";

export interface BoardController {
  hovered: MotionValue<string | null>;
  selected: MotionValue<string | null>;
  
  active: MotionValue<string | null>;
  
  edgeBaseline: MotionValue<number>;
  
  labelFloor: MotionValue<number>;
  hover: (id: string | null) => void;
  select: (id: string | null) => void;
  
  descendants: (id: string) => Set<string>;
}

const Ctx = createContext<BoardController | null>(null);

export const BoardProvider = Ctx.Provider;

export function useBoard(): BoardController {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBoard deve ser usado dentro de <BoardProvider>");
  return ctx;
}

export function useActiveValue(
  hovered: MotionValue<string | null>,
  selected: MotionValue<string | null>
): MotionValue<string | null> {
  const active: MotionValue<string | null> = useTransform(() => hovered.get() ?? selected.get() ?? null);
  return active;
}

export function useCreateBoard(descendants: (id: string) => Set<string>) {
  const hovered = useMotionValue<string | null>(null);
  const selected = useMotionValue<string | null>(null);
  const edgeBaseline = useMotionValue(0.09);
  const labelFloor = useMotionValue(0);
  const active = useActiveValue(hovered, selected);
  return {
    hovered,
    selected,
    active,
    edgeBaseline,
    labelFloor,
    hover: (id: string | null) => hovered.set(id),
    select: (id: string | null) => selected.set(id),
    descendants,
  };
}

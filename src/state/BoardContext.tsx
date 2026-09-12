import { createContext, useContext } from "react";
import { useMotionValue, useTransform, type MotionValue } from "motion/react";

export interface BoardController {
  hovered: MotionValue<string>;
  selected: MotionValue<string>;
  active: MotionValue<string>;
  edgeBaseline: MotionValue<number>;
  labelFloor: MotionValue<number>;
  hover: (id: string) => void;
  select: (id: string) => void;
  descendants: (id: string) => Set<string>;
}

const Ctx = createContext<BoardController | null>(null);

export const BoardProvider = Ctx.Provider;

export function useBoard(): BoardController {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBoard deve ser usado dentro de <BoardProvider>");
  return ctx;
}

export function useCreateBoard(descendants: (id: string) => Set<string>) {
  const hovered = useMotionValue("");
  const selected = useMotionValue("");
  const edgeBaseline = useMotionValue(0.09);
  const labelFloor = useMotionValue(0);
  const active = useTransform(() => hovered.get() || selected.get() || "");

  return {
    hovered,
    selected,
    active,
    edgeBaseline,
    labelFloor,
    hover: (id: string) => hovered.set(id),
    select: (id: string) => selected.set(id),
    descendants,
  };
}

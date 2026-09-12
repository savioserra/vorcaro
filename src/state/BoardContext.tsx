import { createContext, useContext } from "react";
import { useMotionValue, useTransform, type MotionValue } from "motion/react";

export interface PinnedPair {
  a: string;
  b: string;
}

export interface BoardController {
  hovered: MotionValue<string>;
  selected: MotionValue<string>;
  active: MotionValue<string>;
  pinnedPair: MotionValue<PinnedPair | null>;
  edgeBaseline: MotionValue<number>;
  labelFloor: MotionValue<number>;
  hover: (id: string) => void;
  select: (id: string) => void;
  pin: (pair: PinnedPair | null) => void;
  litFor: (id: string) => Set<string>;
}

const Ctx = createContext<BoardController | null>(null);

export const BoardProvider = Ctx.Provider;

export function useBoard(): BoardController {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBoard deve ser usado dentro de <BoardProvider>");
  return ctx;
}

export function useCreateBoard(litFor: (id: string) => Set<string>) {
  const hovered = useMotionValue("");
  const selected = useMotionValue("");
  const pinnedPair = useMotionValue<PinnedPair | null>(null);
  const edgeBaseline = useMotionValue(0.09);
  const labelFloor = useMotionValue(0);
  const active = useTransform(() => hovered.get() || selected.get() || "");

  return {
    hovered,
    selected,
    active,
    pinnedPair,
    edgeBaseline,
    labelFloor,
    hover: (id: string) => hovered.set(id),
    select: (id: string) => selected.set(id),
    pin: (pair: PinnedPair | null) => pinnedPair.set(pair),
    litFor,
  };
}

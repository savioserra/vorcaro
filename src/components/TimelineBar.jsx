import { motion, AnimatePresence } from "motion/react";

const MES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export function fmtMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  return `${MES[m - 1]} ${y}`;
}

export function TimelineBar({ months, index, onSeek, playing, onTogglePlay, onJumpEnd, peopleCount, edgeCount }) {
  const cursor = months[index];
  const years = [];
  months.forEach((m, i) => {
    const y = m.slice(0, 4);
    if (!years.length || years[years.length - 1].y !== y) years.push({ y, i });
  });
  const pct = (i) => (i / (months.length - 1)) * 100;

  return (
    <motion.footer
      initial={{ y: 64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="flex shrink-0 items-center gap-3 border-t border-zinc-800 bg-zinc-950/95 px-3 py-2 lg:px-4"
    >
      <motion.button
        type="button"
        onClick={onTogglePlay}
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.06 }}
        aria-label={playing ? "Pausar linha do tempo" : "Reproduzir linha do tempo"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm text-zinc-950"
      >
        {playing ? "⏸" : "▶"}
      </motion.button>
      <motion.button
        type="button"
        onClick={onJumpEnd}
        whileTap={{ scale: 0.94 }}
        className="shrink-0 rounded-lg border border-zinc-700 px-2 py-1.5 font-mono text-[10px] uppercase tracking-wide text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
      >
        hoje
      </motion.button>

      <div className="relative min-w-0 flex-1 pb-4">
        <input
          type="range"
          min={0}
          max={months.length - 1}
          value={index}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Linha do tempo do caso"
          className="w-full accent-zinc-300"
        />
        <div className="pointer-events-none absolute inset-x-0 top-[22px] h-3">
          {years.map(({ y, i }) => (
            <span
              key={y}
              className="absolute -translate-x-1/2 font-mono text-[9px] text-zinc-600"
              style={{ left: `${pct(i)}%` }}
            >
              {y}
            </span>
          ))}
        </div>
      </div>

      <div className="w-24 shrink-0 text-right">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={cursor}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="block font-mono text-xs font-semibold text-zinc-100"
          >
            {fmtMonth(cursor)}
          </motion.span>
        </AnimatePresence>
        <span className="block font-mono text-[10px] text-zinc-500">
          {peopleCount} pessoas · {edgeCount} conexões
        </span>
      </div>
    </motion.footer>
  );
}

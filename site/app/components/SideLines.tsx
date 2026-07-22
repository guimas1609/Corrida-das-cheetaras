"use client";

import { useEffect, useRef } from "react";

// Linhas verticais decorativas nas laterais do hero (só desktop) — reagem
// à posição do cursor: deslocam verticalmente (parallax) e acendem mais
// quando o mouse se aproxima do lado correspondente.
const SIDE_LINE_GRADIENT =
  "linear-gradient(to bottom, transparent, var(--color-cheetara-pink) 35%, var(--color-cheetara-purple) 65%, transparent)";

const LINES = [
  { side: "left" as const, offset: "5%", top: "12%", height: "35%", depth: 0.6 },
  { side: "left" as const, offset: "11%", top: "52%", height: "30%", depth: 1.1 },
  { side: "left" as const, offset: "18%", top: "28%", height: "40%", depth: 0.85 },
  { side: "right" as const, offset: "5%", top: "18%", height: "32%", depth: 0.7 },
  { side: "right" as const, offset: "11%", top: "50%", height: "38%", depth: 1 },
  { side: "right" as const, offset: "18%", top: "10%", height: "28%", depth: 0.9 },
];

export default function SideLines() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      const proximityLeft = Math.max(0, -x);
      const proximityRight = Math.max(0, x);

      LINES.forEach((line, i) => {
        const el = refs.current[i];
        if (!el) return;
        const proximity = line.side === "left" ? proximityLeft : proximityRight;
        el.style.transform = `translateY(${y * line.depth * 34}px)`;
        el.style.opacity = String(0.16 + proximity * 0.55);
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/4 sm:block">
        {LINES.map((line, i) =>
          line.side !== "left" ? null : (
            <span
              key={`l-${i}`}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="absolute w-px"
              style={{
                left: line.offset,
                top: line.top,
                height: line.height,
                background: SIDE_LINE_GRADIENT,
              }}
            />
          )
        )}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 sm:block">
        {LINES.map((line, i) =>
          line.side !== "right" ? null : (
            <span
              key={`r-${i}`}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="absolute w-px"
              style={{
                right: line.offset,
                top: line.top,
                height: line.height,
                background: SIDE_LINE_GRADIENT,
              }}
            />
          )
        )}
      </div>
    </>
  );
}

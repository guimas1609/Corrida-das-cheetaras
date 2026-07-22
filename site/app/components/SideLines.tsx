"use client";

import { useEffect, useRef } from "react";

// Linhas verticais decorativas nas laterais do hero (só desktop). Duas
// camadas de movimento por linha:
//  - camada externa: drift + pulso de opacidade idle, sempre rodando
//    (animate-side-line, CSS) — nunca fica parada.
//  - camada interna: balanço horizontal + "acende" quando o mouse se
//    aproxima do lado correspondente (JS, via ref — sem re-render).
const SIDE_LINE_GRADIENT =
  "linear-gradient(to bottom, transparent, var(--color-cheetara-pink) 35%, var(--color-cheetara-purple) 65%, transparent)";

const LINES = [
  { side: "left" as const, offset: "5%", top: "12%", height: "35%", duration: "5s", delay: "0s" },
  { side: "left" as const, offset: "11%", top: "52%", height: "30%", duration: "6.2s", delay: "0.8s" },
  { side: "left" as const, offset: "18%", top: "28%", height: "40%", duration: "4.4s", delay: "1.6s" },
  { side: "right" as const, offset: "5%", top: "18%", height: "32%", duration: "5.6s", delay: "0.4s" },
  { side: "right" as const, offset: "11%", top: "50%", height: "38%", duration: "4.8s", delay: "1.2s" },
  { side: "right" as const, offset: "18%", top: "10%", height: "28%", duration: "6.6s", delay: "2s" },
];

export default function SideLines() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const proximityLeft = Math.max(0, -x);
      const proximityRight = Math.max(0, x);

      LINES.forEach((line, i) => {
        const el = refs.current[i];
        if (!el) return;
        const proximity = line.side === "left" ? proximityLeft : proximityRight;
        const sway = (line.side === "left" ? proximity : -proximity) * 8;
        el.style.transform = `translateX(${sway}px) scaleX(${1 + proximity * 1.6})`;
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
              className="animate-side-line absolute"
              style={{
                left: line.offset,
                top: line.top,
                height: line.height,
                animationDuration: line.duration,
                animationDelay: line.delay,
              }}
            >
              <span
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="block h-full w-px transition-transform duration-200 ease-out will-change-transform"
                style={{ background: SIDE_LINE_GRADIENT }}
              />
            </span>
          )
        )}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 sm:block">
        {LINES.map((line, i) =>
          line.side !== "right" ? null : (
            <span
              key={`r-${i}`}
              className="animate-side-line absolute"
              style={{
                right: line.offset,
                top: line.top,
                height: line.height,
                animationDuration: line.duration,
                animationDelay: line.delay,
              }}
            >
              <span
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="block h-full w-px transition-transform duration-200 ease-out will-change-transform"
                style={{ background: SIDE_LINE_GRADIENT }}
              />
            </span>
          )
        )}
      </div>
    </>
  );
}

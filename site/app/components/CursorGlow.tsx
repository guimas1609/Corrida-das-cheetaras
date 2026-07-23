"use client";

import { useEffect, useRef } from "react";
import { subscribeCursor } from "../lib/cursorTracker";

/**
 * Rastro fino rosa/roxo que persegue o cursor pelo site inteiro, por trás
 * da logo (cursor customizado, ver `cursor` em globals.css) — fica atrás
 * de todo o conteúdo (mesma camada do fundo holográfico, ver layout.tsx),
 * então nunca compete com texto/imagens. Só desktop: no mobile não tem
 * cursor de verdade, e ficaria uma mancha parada num canto sem função.
 *
 * Cada segmento do rastro recebe a mesma posição por frame (via o
 * rastreador compartilhado, cursorTracker — mesmo listener de pointermove
 * que a logo e as linhas laterais), mas com uma `transition-duration`
 * crescente: o primeiro chega quase junto com o cursor, os próximos vão
 * ficando pra trás cada vez mais, formando uma cauda fina que se afina e
 * apaga. Offset de centralização calculado em px direto no `translate3d`
 * (não via classe `-translate-x-1/2`) porque `element.style.transform`
 * setado via JS sobrescreve qualquer `transform` vindo de classe CSS —
 * combinar os dois não funcionaria.
 *
 * `zIndexClassName` existe porque o hero tem fundo opaco (foto) por cima
 * da camada global -z-10 — o rastro nunca apareceria lá. O hero renderiza
 * uma segunda instância com z-index positivo, entre a foto e o conteúdo.
 */
const TRAIL = [
  { size: 9, opacity: 0.6, durationMs: 0, color: "var(--color-cheetara-pink)" },
  { size: 7, opacity: 0.5, durationMs: 60, color: "var(--color-cheetara-pink)" },
  { size: 6, opacity: 0.4, durationMs: 120, color: "var(--color-cheetara-purple)" },
  { size: 5, opacity: 0.3, durationMs: 190, color: "var(--color-cheetara-purple)" },
  { size: 4, opacity: 0.2, durationMs: 260, color: "var(--color-cheetara-purple)" },
  { size: 3, opacity: 0.12, durationMs: 340, color: "var(--color-cheetara-purple)" },
] as const;

export default function CursorGlow({
  zIndexClassName = "-z-10",
}: {
  zIndexClassName?: string;
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    return subscribeCursor((x, y) => {
      TRAIL.forEach((segment, i) => {
        const el = refs.current[i];
        if (!el) return;
        const half = segment.size / 2;
        el.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`;
      });
    });
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 hidden overflow-hidden sm:block ${zIndexClassName}`}
    >
      {TRAIL.map((segment, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute top-0 left-0 rounded-full blur-[2px] will-change-transform"
          style={{
            width: segment.size,
            height: segment.size,
            opacity: segment.opacity,
            background: segment.color,
            transitionProperty: "transform",
            transitionDuration: `${segment.durationMs}ms`,
            transitionTimingFunction: "ease-out",
          }}
        />
      ))}
    </div>
  );
}

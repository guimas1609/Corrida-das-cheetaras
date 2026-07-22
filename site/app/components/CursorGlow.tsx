"use client";

import { useEffect, useRef } from "react";
import { subscribeCursor } from "../lib/cursorTracker";

/**
 * Faixa de luz rosa/roxa que acompanha o cursor pelo site inteiro — fica
 * atrás de todo o conteúdo (mesma camada do fundo holográfico, ver
 * layout.tsx), então nunca compete com texto/imagens. Só desktop: no
 * mobile não tem cursor de verdade, e ficaria uma mancha parada num canto
 * sem função. Usa o rastreador compartilhado (cursorTracker) — mesmo
 * listener de pointermove que a logo e as linhas laterais, agrupado por
 * frame em vez de recalcular a cada evento cru.
 *
 * `zIndexClassName` existe porque o hero tem fundo opaco (foto) por cima
 * da camada global -z-10 — o glow nunca aparecia lá. O hero renderiza uma
 * segunda instância com z-index positivo, entre a foto e o conteúdo.
 */
export default function CursorGlow({
  zIndexClassName = "-z-10",
}: {
  zIndexClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeCursor((x, y) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 hidden overflow-hidden sm:block ${zIndexClassName}`}
    >
      <div
        ref={ref}
        className="absolute top-0 left-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[70px] transition-transform duration-300 ease-out will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(240,32,144,0.55), rgba(96,32,136,0.4) 45%, transparent 72%)",
        }}
      />
    </div>
  );
}

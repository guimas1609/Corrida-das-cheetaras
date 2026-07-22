"use client";

import { useEffect, useRef } from "react";

/**
 * Faixa de luz rosa/roxa que acompanha o cursor pelo site inteiro — fica
 * atrás de todo o conteúdo (mesma camada do fundo holográfico, ver
 * layout.tsx), então nunca compete com texto/imagens. `transition` no
 * transform dá o efeito de "seguir com atraso", não teleporte.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={ref}
        className="absolute top-0 left-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[100px] transition-transform duration-300 ease-out will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(240,32,144,0.55), rgba(96,32,136,0.4) 45%, transparent 72%)",
        }}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Botão de inscrição que acompanha o usuário na rolagem — some enquanto o
 * hero (que já tem seu próprio CTA) está visível, aparece a partir daí. Só
 * desktop: no mobile quem cuida desse papel é EnrollLedBar.tsx (barra fixa
 * no rodapé), pra não empilhar dois CTAs flutuantes. Mesma linguagem
 * visual de EnrollLedBar (outline claro + borda que se desenha em SVG),
 * mas aqui a linha só desenha no hover (`group-hover`) em vez de ficar em
 * loop — desktop tem cursor, não precisa da versão automática.
 */
export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#museu"
      aria-label="Quero me inscrever"
      className={`group fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 rounded-xl border border-black/10 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 sm:block sm:bottom-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {/* Borda animada — recolhida em repouso, desenha a borda inteira ao
          passar o mouse (ver EnrollLedBar.tsx pro equivalente em loop, só
          mobile). */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="floating-cta-border-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-cheetara-pink)" />
            <stop offset="100%" stopColor="var(--color-cheetara-purple)" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="11"
          fill="none"
          stroke="url(#floating-cta-border-gradient)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          pathLength={100}
          strokeDasharray={100}
          className="[stroke-dashoffset:100] transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0]"
        />
      </svg>

      <span className="relative flex items-center gap-2 px-6 py-3 font-medium text-foreground">
        Quero me inscrever
        <svg
          aria-hidden
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="8 7 17 7 17 16" />
        </svg>
      </span>
    </a>
  );
}

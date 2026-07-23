"use client";

import { useEffect, useState } from "react";

/**
 * Botão de inscrição fixo no rodapé do viewport — só mobile. Outline claro
 * (fundo translúcido, borda em gradiente, texto neutro + seta), inspirado
 * numa referência do usuário: um botão retangular onde uma linha desenha a
 * borda inteira ao interagir. No desktop (FloatingCTA.tsx / CTA do hero em
 * ScrollJaguarSection.tsx) isso acontece de verdade no hover, via SVG;
 * aqui no mobile, sem hover pra disparar sob demanda, a borda é 100% CSS
 * (`.enroll-gradient-border` em globals.css, técnica de mask-composite —
 * sem SVG) pulsando de opacidade em loop constante (`.animate-border-draw`).
 * Nada de SVG de propósito: essa é a segunda versão do componente — a
 * primeira usava um `<rect>` de SVG pra borda e reproduziu mais de um bug
 * de renderização (calc() em atributo SVG ignorado, tamanho provavelmente
 * vazando pro cálculo do pai) especificamente num iPhone 15 Pro Max.
 * Centralizado via `left-1/2` + `-translate-x-1/2` (mesma técnica de
 * FloatingCTA.tsx). Aparece já no carregamento (não espera rolagem) e
 * some de novo perto do fim da página, senão sobrepõe o crédito no
 * footer (mesmo `FOOTER_CLEARANCE_PX` de FloatingCTA.tsx).
 */
const FOOTER_CLEARANCE_PX = 140;

export default function EnrollLedBar() {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const distanceToBottom =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      setVisible(distanceToBottom > FOOTER_CLEARANCE_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const shown = loaded && visible;

  return (
    <a
      href="#museu"
      aria-label="Inscreva-se"
      aria-hidden={!shown}
      className={`enroll-gradient-border fixed left-1/2 bottom-20 z-40 w-[calc(100%-2rem)] max-w-[220px] rounded-xl bg-white/95 shadow-sm transition-[transform,opacity] duration-300 sm:hidden ${
        shown
          ? "-translate-x-1/2 translate-y-0 opacity-100"
          : "pointer-events-none -translate-x-1/2 translate-y-4 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <span className="relative flex items-center justify-center gap-1.5 px-4 py-2.5 text-center text-sm font-semibold tracking-wide text-foreground">
        INSCREVA-SE
        <svg
          aria-hidden
          width="13"
          height="13"
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

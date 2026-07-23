"use client";

import { useEffect, useState } from "react";

/**
 * Botão de inscrição fixo no rodapé do viewport — só mobile. Outline claro
 * (fundo translúcido, borda em gradiente, texto neutro + seta), inspirado
 * numa referência do usuário: um botão retangular onde uma linha desenha a
 * borda inteira ao interagir. No desktop (FloatingCTA.tsx / CTA do hero em
 * ScrollJaguarSection.tsx) isso acontece de verdade no hover, via SVG;
 * aqui no mobile, sem hover pra disparar sob demanda, a borda é 100% CSS
 * (`.enroll-gradient-border::before` em globals.css, técnica de
 * mask-composite — sem SVG) pulsando de opacidade em loop constante.
 *
 * Zero `transform` neste elemento de propósito (nem pra centralizar, nem
 * pra animar entrada). `position: fixed` + `transform` é uma combinação
 * com bug conhecido e antigo no Chrome iOS (que roda sobre WebKit, igual
 * Safari, mas tem seu próprio histórico de esticar/deformar elementos
 * `fixed` transformados) — bateu exatamente com o botão renderizando bem
 * maior que o esperado especificamente no Chrome iOS, mesmo já correto no
 * Safari iOS. Centralização via `left: 50%` + `margin-left` negativo
 * (metade da largura fixa) em vez de `-translate-x-1/2`; entrada só por
 * `opacity` (sem slide via `translate-y`).
 *
 * Aparece já no carregamento (não espera rolagem) e some de novo perto do
 * fim da página, senão sobrepõe o crédito no footer (mesmo
 * `FOOTER_CLEARANCE_PX` de FloatingCTA.tsx — esse aqui pode usar
 * `transform`/`translate-x` à vontade, é `sm:block`, não aparece no
 * Chrome iOS/mobile).
 */
const FOOTER_CLEARANCE_PX = 140;
const WIDTH_PX = 220;

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
      className={`enroll-gradient-border fixed bottom-20 z-40 rounded-xl bg-white/95 shadow-sm transition-opacity duration-300 sm:hidden ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        left: "50%",
        marginLeft: `-${WIDTH_PX / 2}px`,
        width: `${WIDTH_PX}px`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
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

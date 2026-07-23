"use client";

import { useEffect, useState } from "react";

/**
 * Botão de inscrição fixo no rodapé do viewport — só mobile. Outline claro
 * (fundo translúcido, borda em gradiente, texto neutro + seta), inspirado
 * numa referência do usuário: um botão retangular onde uma linha desenha a
 * borda inteira. No desktop (FloatingCTA.tsx / CTA do hero em
 * ScrollJaguarSection.tsx) isso acontece de verdade no hover, via SVG
 * (`stroke-dasharray`/`stroke-dashoffset`, `pathLength=100` pra não depender
 * do perímetro real em px); aqui no mobile, sem hover pra disparar sob
 * demanda, o mesmo traço fica desenhando e recolhendo em loop constante
 * (`.animate-border-draw` em globals.css).
 *
 * Duas tentativas 100% CSS (sem SVG) vieram antes desta e falharam: uma
 * borda com `-webkit-mask`/`mask-composite`, que deforma no Chrome Android
 * durante o repaint do scroll (viewport recalculado quando a barra de
 * endereço some/aparece); depois uma faixa de cor animada via
 * `background-position`/`conic-gradient`, que não reproduzia o efeito de
 * "linha se desenhando" que o usuário queria (igual ao do desktop). O SVG
 * volta aqui, mas evitando o bug antigo que o tirou de cena (calc() em
 * atributo de SVG sendo ignorado, tamanho intrínseco de SVG sem
 * width/height explícitos vazando pro auto-sizing do pai): `WIDTH_PX` e
 * `HEIGHT_PX` abaixo são constantes fixas aplicadas tanto no CSS do botão
 * quanto no `viewBox`/`width`/`height` do SVG, numa correspondência 1:1 —
 * nada de `calc()` em atributo SVG, nada de porcentagem, nada de tamanho
 * dependente de conteúdo pro navegador "adivinhar".
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
const HEIGHT_PX = 44;
const BORDER_PX = 1.5;

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
      className={`fixed bottom-20 z-40 transition-opacity duration-300 sm:hidden ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{
        left: "50%",
        marginLeft: `-${WIDTH_PX / 2}px`,
        width: `${WIDTH_PX}px`,
        height: `${HEIGHT_PX}px`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <span className="relative block h-full w-full rounded-xl bg-white/95 shadow-sm">
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={WIDTH_PX}
          height={HEIGHT_PX}
          viewBox={`0 0 ${WIDTH_PX} ${HEIGHT_PX}`}
        >
          <defs>
            <linearGradient id="enroll-border-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-cheetara-pink)" />
              <stop offset="100%" stopColor="var(--color-cheetara-purple)" />
            </linearGradient>
          </defs>
          <rect
            x={BORDER_PX / 2}
            y={BORDER_PX / 2}
            width={WIDTH_PX - BORDER_PX}
            height={HEIGHT_PX - BORDER_PX}
            rx="11"
            fill="none"
            stroke="url(#enroll-border-gradient)"
            strokeWidth={BORDER_PX}
            pathLength={100}
            strokeDasharray={100}
            className="animate-border-draw"
          />
        </svg>

        <span className="relative z-10 flex h-full items-center justify-center gap-1.5 px-4 text-center text-sm font-semibold tracking-wide text-foreground">
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
      </span>
    </a>
  );
}

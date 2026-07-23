"use client";

import { useEffect, useState } from "react";

/**
 * Botão de inscrição fixo no rodapé do viewport — só mobile. Outline claro
 * (fundo translúcido, borda fina, texto neutro + seta), inspirado numa
 * referência do usuário: um botão retangular onde uma linha desenha a
 * borda inteira ao interagir. Como mobile não tem hover, a linha (SVG,
 * técnica de stroke-dasharray/dashoffset com pathLength=100 pra não
 * depender do perímetro real em px) fica em loop constante — ver
 * `.animate-border-draw` em globals.css. Aparece já no carregamento (não
 * espera rolagem, ao contrário de FloatingCTA.tsx, que cuida só do
 * desktop) e fica montado.
 */
export default function EnrollLedBar() {
  const [visible, setVisible] = useState(false);
  // Pausa a animação da borda (stroke-dashoffset força repaint, não é uma
  // propriedade que o compositor acelera) enquanto o usuário está
  // rolando. Um elemento `fixed` já é caro pro Safari mobile recompor a
  // cada frame de scroll — empilhar um repaint contínuo em cima disso é
  // uma causa plausível do botão "deformar"/piscar durante a rolagem,
  // reproduzido especificamente num iPhone 15 Pro Max (tela ProMotion
  // 120Hz — não é bug de responsividade/breakpoint, é engine do Safari
  // recompondo `fixed` mais instável em telas de refresh mais alto).
  // Também tirado `transform-gpu`/`will-change-transform` que estavam
  // aqui antes: forçar uma camada de composição própria num elemento
  // `fixed` no iOS é documentadamente mais causa desse tipo de artefato
  // do que cura. Volta a rodar 150ms depois que o scroll para.
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let idleId: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(idleId);
      idleId = setTimeout(() => setScrolling(false), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idleId);
    };
  }, []);

  return (
    <a
      href="#museu"
      aria-label="Inscreva-se"
      aria-hidden={!visible}
      className={`fixed inset-x-4 bottom-20 z-40 mx-auto max-w-[220px] rounded-xl border border-black/10 bg-white/95 shadow-sm transition-[transform,opacity] duration-300 sm:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Borda animada — desenha e recolhe em loop por cima da borda fixa
          de baixo. Sem `calc()` nos atributos do rect: Safari mobile não
          resolve calc() de forma confiável em atributos SVG (não-CSS),
          o que fazia o rect cair pra tamanho inválido e a linha nem
          aparecer — só x/y/width/height simples (100%), sem inset. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="enroll-border-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-cheetara-pink)" />
            <stop offset="100%" stopColor="var(--color-cheetara-purple)" />
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="11"
          fill="none"
          stroke="url(#enroll-border-gradient)"
          strokeWidth="1.5"
          pathLength={100}
          strokeDasharray={100}
          className="animate-border-draw"
          style={{ animationPlayState: scrolling ? "paused" : "running" }}
        />
      </svg>

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

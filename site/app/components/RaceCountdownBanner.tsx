"use client";

import { useEffect, useState } from "react";

// Mês 0-indexado: 7 = agosto.
const RACE_DATE = new Date(2026, 7, 29);
const DAY_MS = 86_400_000;

// Faixa quadriculada (padrão de bandeira/linha de largada) via CSS puro —
// dois `repeating-linear-gradient` cruzados formam o tabuleiro, sem
// precisar de nenhum asset de imagem novo.
const CHECKERED_PATTERN = {
  backgroundImage: [
    "repeating-linear-gradient(45deg, #000 0 6px, transparent 6px 12px)",
    "repeating-linear-gradient(-45deg, #000 0 6px, transparent 6px 12px)",
  ].join(", "),
  backgroundColor: "#fff",
  backgroundSize: "12px 12px",
};

/**
 * Placa de contagem regressiva — só mobile, pendurada visualmente abaixo
 * da navbar do hero, como se fosse uma faixa de linha de chegada. Calcula
 * os dias no client (useEffect, não no render): `Date.now()` no render
 * causaria incompatibilidade de hidratação entre o que o servidor
 * calculou e o que o client recalcula ao montar. Some/aparece uma vez ao
 * carregar (não é sticky, não recolhe sozinha depois).
 */
export default function RaceCountdownBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // As duas atualizações ficam dentro do setTimeout (não direto no corpo
    // do efeito) — setState síncrono ali dispara um lint de cascata de
    // renders. O delay também já serve pra "descer" depois que a navbar
    // assentou, na mesma sequência de entrada do logo/CTA (Reveal / Reveal
    // delay={200} em ScrollJaguarSection.tsx).
    const id = setTimeout(() => {
      setDaysLeft(Math.ceil((RACE_DATE.getTime() - Date.now()) / DAY_MS));
      setVisible(true);
    }, 350);
    return () => clearTimeout(id);
  }, []);

  if (daysLeft === null || daysLeft < 0) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`absolute top-20 left-1/2 z-20 -translate-x-1/2 overflow-hidden rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-700 ease-out sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
      }`}
    >
      {/* Faixa quadriculada no topo — remete à linha de chegada. */}
      <div aria-hidden className="h-2.5 w-full" style={CHECKERED_PATTERN} />

      <div className="flex flex-col items-center gap-0.5 bg-neutral-900 px-6 py-3">
        <span className="text-3xl font-black text-gradient-cheetara">{daysLeft}</span>
        <span className="text-[11px] font-semibold tracking-widest text-white/80 uppercase">
          dias pra corrida
        </span>
      </div>

      {/* Faixa quadriculada embaixo também, fechando a moldura. */}
      <div aria-hidden className="h-2.5 w-full" style={CHECKERED_PATTERN} />
    </div>
  );
}

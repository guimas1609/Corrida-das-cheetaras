"use client";

import { useEffect, useState } from "react";

// Mês 0-indexado: 7 = agosto.
const RACE_DATE = new Date(2026, 7, 29);
const DAY_MS = 86_400_000;

/**
 * Contagem regressiva — só mobile, pendurada visualmente abaixo da navbar
 * do hero, como um pórtico de linha de largada (duas hastes + um cabo com
 * leve caimento no topo, remetendo às treliças reais da foto de fundo) com
 * o número flutuando no meio, sem placa/fundo atrás. Calcula os dias no
 * client (useEffect, não no render): `Date.now()` no render causaria
 * incompatibilidade de hidratação entre o que o servidor calculou e o que
 * o client recalcula ao montar. Aparece uma vez ao carregar (não é sticky,
 * não recolhe sozinha depois).
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
      className={`absolute top-20 left-1/2 z-20 -translate-x-1/2 transition-all duration-700 ease-out sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
      }`}
    >
      <div className="relative h-[90px] w-[280px]">
        {/* Pórtico: duas hastes + cabo com leve caimento no topo — cinza
            metálico, fino, remetendo às treliças reais da foto de fundo em
            vez de uma placa sólida "brutona". */}
        <svg
          aria-hidden
          viewBox="0 0 280 90"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <path
            d="M20 20 Q140 48 260 20"
            stroke="#9CA3AF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line x1="20" y1="18" x2="20" y2="90" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
          <line
            x1="260"
            y1="18"
            x2="260"
            y2="90"
            stroke="#9CA3AF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Número flutua no meio, sem placa atrás — só o texto em vermelho,
            com uma sombra escura pra continuar legível em qualquer trecho
            da foto. */}
        <div className="absolute inset-x-0 top-10 flex flex-col items-center">
          <span
            className="text-4xl font-black text-red-600 [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]"
          >
            {daysLeft}
          </span>
          <span className="text-[11px] font-bold tracking-widest text-red-600 uppercase [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
            dias pra corrida
          </span>
        </div>
      </div>
    </div>
  );
}

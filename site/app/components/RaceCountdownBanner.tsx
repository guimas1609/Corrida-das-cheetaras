"use client";

import { useEffect, useState } from "react";
import { VT323 } from "next/font/google";

// Fonte pixelada estilo relógio/timer digital — só usada nos dígitos do
// placar, não no resto do site (que segue Geist).
const digitFont = VT323({ weight: "400", subsets: ["latin"] });

// Mês 0-indexado: 7 = agosto.
const RACE_DATE = new Date(2026, 7, 29);
const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

type TimeLeft = { days: number; hours: number; minutes: number };

function computeTimeLeft(): TimeLeft {
  const diff = RACE_DATE.getTime() - Date.now();
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / HOUR_MS),
    minutes: Math.floor((diff % HOUR_MS) / MINUTE_MS),
  };
}

/** Um par de dígitos com "fantasma" (8 apagado) atrás do valor aceso — imita
 * display de 7 segmentos sem precisar de fonte digital custom. */
function LedPair({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div
        className={`${digitFont.className} relative text-2xl leading-none tabular-nums sm:text-3xl`}
      >
        <span aria-hidden className="text-[#173025]">
          88
        </span>
        <span className="absolute inset-0 text-[#39ff6a] [text-shadow:0_0_3px_currentColor]">
          {text}
        </span>
      </div>
      <span className="mt-0.5 text-[8px] font-bold tracking-widest text-[#2c6b45] uppercase sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

/**
 * Placar LED de contagem regressiva, preso embaixo da navbar (mesmo wrapper
 * de largura em ScrollJaguarSection.tsx) — presente em mobile e desktop,
 * um pouco maior nesse último (ver classes `sm:`). Mostra
 * dias:horas:minutos, atualizando a cada minuto. Calcula no client
 * (useEffect, não no render): `Date.now()` no render causaria
 * incompatibilidade de hidratação entre servidor e client. Entra com um
 * slide-down de altura (grid-rows) pouco depois do carregamento, na mesma
 * sequência de entrada do logo/CTA (Reveal / Reveal delay={200} em
 * ScrollJaguarSection.tsx), e fica montada (não recolhe sozinha depois).
 */
export default function RaceCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const openId = setTimeout(() => {
      setTimeLeft(computeTimeLeft());
      setVisible(true);
    }, 350);

    const intervalId = setInterval(() => {
      setTimeLeft(computeTimeLeft());
    }, MINUTE_MS);

    return () => {
      clearTimeout(openId);
      clearInterval(intervalId);
    };
  }, []);

  if (timeLeft === null || timeLeft.days < 0) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`grid ${visible ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      style={{ transition: "grid-template-rows 700ms ease-out" }}
    >
      <div className="flex justify-center overflow-hidden">
        <div
          className={`relative flex items-center justify-center gap-3 rounded-b-2xl border-x border-b border-black/20 bg-[#0a1710] px-4 py-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-opacity duration-500 sm:gap-4 sm:px-6 sm:py-2 ${
            visible ? "opacity-100 delay-150" : "opacity-0"
          }`}
        >
          {/* Traço de brand no topo da placa, colada na navbar. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-cheetara"
          />
          <LedPair value={timeLeft.days} label="dias" />
          <span
            className={`${digitFont.className} mb-3 text-xl text-[#39ff6a] [text-shadow:0_0_3px_currentColor] sm:mb-4 sm:text-2xl`}
          >
            :
          </span>
          <LedPair value={timeLeft.hours} label="horas" />
          <span
            className={`${digitFont.className} mb-3 text-xl text-[#39ff6a] [text-shadow:0_0_3px_currentColor] sm:mb-4 sm:text-2xl`}
          >
            :
          </span>
          <LedPair value={timeLeft.minutes} label="min" />
        </div>
      </div>
    </div>
  );
}

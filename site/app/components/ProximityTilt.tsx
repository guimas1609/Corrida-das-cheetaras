"use client";

import { useEffect, useRef } from "react";

/**
 * Mesmo truque do HeroLogo (tilt 3D via CSS conforme o cursor se
 * aproxima), generalizado pra qualquer elemento: perspective +
 * rotateX/rotateY calculados a partir da distância do ponteiro até o
 * centro do próprio elemento — não precisa clicar nem arrastar, só
 * aproximar. Usa `pointermove` (não `mousemove`) pra também reagir ao
 * dedo no touch enquanto ele se move sobre a tela, cobrindo mobile sem
 * precisar de um listener separado.
 */
const RADIUS = 420;
const MAX_TILT_DEG = 14;
const MAX_TRANSLATE = 10;

export default function ProximityTilt({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / RADIUS));
      const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / RADIUS));
      const rotateY = x * MAX_TILT_DEG;
      const rotateX = -y * MAX_TILT_DEG;
      const translateX = x * MAX_TRANSLATE;
      const translateY = y * MAX_TRANSLATE;
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
    };

    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return (
    // Wrapper externo só existe pra flutuação idle do mobile (ver
    // .animate-tilt-idle no globals.css) — desliga em sm: pra não somar
    // com o tilt por proximidade do mouse, que já dá movimento no
    // desktop.
    <div className="animate-tilt-idle sm:animate-none">
      <div
        ref={ref}
        className={`transition-transform duration-500 ease-out will-change-transform ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

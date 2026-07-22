"use client";

import { useRef, type PointerEvent } from "react";

/**
 * Logo do hero: no desktop, reage ao mouse encostando nela — tilt 3D +
 * leve deslocamento calculados a partir da posição do cursor dentro da
 * própria imagem (não da janela inteira), tipo card tilt. Some de volta ao
 * neutro quando o mouse sai. Aplicado via ref (não state) pra não
 * re-renderizar a cada pointermove.
 */
export default function HeroLogo() {
  const ref = useRef<HTMLImageElement>(null);

  const onPointerMove = (e: PointerEvent<HTMLImageElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1..1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const rotateY = x * 22;
    const rotateX = -y * 22;
    const translateX = x * 12;
    const translateY = y * 12;
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px) scale(1.04)`;
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    // Wrapper só balança sozinho no desktop (sm:) — no mobile o próprio
    // <img> já flutua (animate-logo-float), sem envolver nada aqui.
    <div className="sm:animate-hero-logo-idle">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        src="/api/drive-image?id=11y8Ot9i6RQqv7q8OdAUxeptlTcNrA7Hi&w=800"
        alt="Corrida das Cheetaras"
        className="h-56 w-auto animate-logo-float cursor-pointer transition-transform duration-200 ease-out will-change-transform sm:h-80 sm:animate-none"
      />
    </div>
  );
}

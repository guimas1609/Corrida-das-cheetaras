"use client";

import { useRef, type PointerEvent } from "react";

/**
 * Logo do hero: no desktop, reage ao mouse encostando nela — tilt 3D +
 * leve deslocamento calculados a partir da posição do cursor. A área que
 * "escuta" o mouse é maior que a imagem visível (via padding invisível no
 * wrapper) pra não exigir precisão de pixel pra disparar o efeito; o
 * cálculo do ângulo continua baseado no tamanho real da imagem, com clamp
 * pra não passar do tilt máximo quando o cursor está na borda dessa área
 * extra. Some de volta ao neutro quando o mouse sai. Aplicado via ref (não
 * state) pra não re-renderizar a cada pointermove.
 */
export default function HeroLogo() {
  const imgRef = useRef<HTMLImageElement>(null);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const x = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1);
    const rotateY = x * 22;
    const rotateX = -y * 22;
    const translateX = x * 12;
    const translateY = y * 12;
    img.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px) scale(1.04)`;
  };

  const onPointerLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.transform = "";
  };

  return (
    // Wrapper só balança sozinho no desktop (sm:) — no mobile o próprio
    // <img> já flutua (animate-logo-float), sem envolver nada aqui. O
    // padding extra amplia a área que reage ao mouse sem alterar o layout
    // (o -m-8/-m-12 compensa o espaço que o padding acrescentaria).
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="-m-8 p-8 sm:animate-hero-logo-idle sm:-m-12 sm:p-12"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/api/drive-image?id=11y8Ot9i6RQqv7q8OdAUxeptlTcNrA7Hi&w=800"
        alt="Corrida das Cheetaras"
        className="h-56 w-auto animate-logo-float cursor-pointer transition-transform duration-200 ease-out will-change-transform sm:h-80 sm:animate-none"
      />
    </div>
  );
}

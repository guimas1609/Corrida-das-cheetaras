"use client";

import { useEffect, useRef } from "react";

/**
 * Logo do hero: no desktop, reage à posição do cursor na janela inteira
 * (não só ao passar exatamente por cima dela) — tilt 3D + leve
 * deslocamento, tipo vitrine de produto. Global em vez de hover-only pra
 * não depender de precisão de mouse pra disparar o efeito. Aplicado via
 * ref (não state) pra não re-renderizar a cada pointermove.
 */
export default function HeroLogo() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      const rotateY = x * 18;
      const rotateX = -y * 18;
      const translateX = x * 16;
      const translateY = y * 16;
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    // Wrapper só balança sozinho no desktop (sm:) — no mobile o próprio
    // <img> já flutua (animate-logo-float), sem envolver nada aqui.
    <div className="sm:animate-hero-logo-idle">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src="/api/drive-image?id=11y8Ot9i6RQqv7q8OdAUxeptlTcNrA7Hi&w=800"
        alt="Corrida das Cheetaras"
        className="h-56 w-auto animate-logo-float cursor-pointer transition-transform duration-200 ease-out will-change-transform sm:h-80 sm:animate-none"
      />
    </div>
  );
}

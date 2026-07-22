"use client";

import { useEffect, useRef } from "react";

/**
 * Logo do hero: no desktop, reage à posição do cursor na janela inteira —
 * tilt 3D + leve deslocamento, tipo vitrine de produto. Listener próprio
 * (não usa o rastreador compartilhado) de propósito: é o efeito mais
 * cobrado/testado do site, então fica isolado, simples e fácil de
 * depurar — sem depender de nenhum módulo externo.
 */
export default function HeroLogo() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Raio (em px) em que o tilt atinge o máximo — baseado na posição da
    // própria logo, não da janela inteira. Do jeito antigo (clientX /
    // innerWidth), como a logo fica no centro da tela, o cursor perto dela
    // sempre dava x,y ~0 e o tilt sumia exatamente onde deveria ser mais
    // forte.
    const RADIUS = 260;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / RADIUS));
      const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / RADIUS));
      const rotateY = x * 24;
      const rotateX = -y * 24;
      const translateX = x * 18;
      const translateY = y * 18;
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
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
        className="h-56 w-auto animate-logo-float cursor-pointer transition-transform duration-100 ease-out will-change-transform sm:h-80 sm:animate-none"
      />
    </div>
  );
}

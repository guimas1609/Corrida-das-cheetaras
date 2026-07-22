"use client";

import { useEffect, useRef } from "react";

/**
 * Logo do hero: reage à posição do cursor na janela inteira (não só ao
 * passar por cima dela) com um leve tilt 3D + deslocamento, tipo vitrine de
 * produto. Aplicado via ref/CSS var (não state) pra não re-renderizar a
 * cada pointermove.
 */
export default function HeroLogo() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      const rotateY = x * 14;
      const rotateX = -y * 14;
      const translateX = x * 14;
      const translateY = y * 14;
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/api/drive-image?id=11y8Ot9i6RQqv7q8OdAUxeptlTcNrA7Hi&w=800"
      alt="Corrida das Cheetaras"
      className="h-40 w-auto cursor-pointer transition-transform duration-300 ease-out will-change-transform sm:h-60"
    />
  );
}

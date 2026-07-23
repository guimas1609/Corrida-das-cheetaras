"use client";

import { useEffect, useRef } from "react";

/**
 * `<video autoPlay muted>` sozinho às vezes não é suficiente pro autoplay
 * no Safari/Chrome mobile: `muted` é uma propriedade do DOM, não um
 * atributo refletido, e o React não garante que ela esteja sincronizada
 * a tempo da política de autoplay avaliar o elemento. Mantém `autoPlay` +
 * `muted` nativos no JSX (sinal imediato pro navegador, sem esperar JS) e
 * reforça com `.muted = true` + `.play()` via ref no mount — se o
 * navegador ignorar os atributos por algum motivo, o efeito força de novo.
 */
export default function HeroBackgroundVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={className}
    />
  );
}

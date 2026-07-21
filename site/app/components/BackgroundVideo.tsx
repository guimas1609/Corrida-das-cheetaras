"use client";

import { useEffect, useRef } from "react";

/**
 * <video autoPlay muted loop> puro falha silenciosamente no Safari/iOS: o
 * React só define `muted` como propriedade do DOM depois de hidratar, mas o
 * Safari decide se autoplay é permitido olhando o atributo HTML no momento
 * em que o elemento é criado — nesse instante ainda não está mutado, então
 * ele barra o autoplay e mostra o ícone de play parado. Definir `.muted`
 * via ref antes de chamar `.play()` evita essa corrida.
 */
export default function BackgroundVideo({
  className,
  src,
}: {
  className?: string;
  src: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;

    const tryPlay = () => video.play().catch(() => {});
    tryPlay();

    const resume = () => tryPlay();
    document.addEventListener("touchstart", resume, { once: true });
    document.addEventListener("click", resume, { once: true });

    // Sem o atributo `loop`: no WebKit/Safari ele às vezes trava parado no
    // exato ponto de reinício (o vídeo fica pausado no frame 0 depois da
    // primeira volta). Controlando o loop manualmente pelo `ended` isso
    // não acontece.
    const onEnded = () => {
      video.currentTime = 0;
      tryPlay();
    };
    video.addEventListener("ended", onEnded);

    return () => {
      document.removeEventListener("touchstart", resume);
      document.removeEventListener("click", resume);
      video.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      aria-hidden
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      src={src}
    />
  );
}

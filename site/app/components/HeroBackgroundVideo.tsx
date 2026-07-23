"use client";

import { useEffect, useRef } from "react";

/**
 * `<video autoPlay muted>` sozinho às vezes não é suficiente pro autoplay
 * no Safari/Chrome mobile: `muted` é uma propriedade do DOM, não um
 * atributo refletido, e o React não garante que ela esteja sincronizada
 * a tempo da política de autoplay avaliar o elemento. Mantém `autoPlay` +
 * `muted` nativos no JSX (sinal imediato pro navegador, sem esperar JS) e
 * reforça com `.muted = true` + `.play()` via ref.
 *
 * Isso ainda não é garantia em todo aparelho: iOS em Modo de Baixo Consumo
 * e o "Data Saver" do Chrome Android bloqueiam autoplay mesmo mudo, sem
 * disparar nenhum evento de erro pra reagir depois — o vídeo só fica
 * pausado no primeiro frame, silenciosamente. Por isso tenta `.play()` de
 * novo em `loadeddata`/`canplay` (caso o primeiro chute em cima da hora
 * tenha falhado por falta de dados ainda carregados) e, como último
 * recurso, no primeiro toque/scroll do usuário na página inteira (gesto
 * real sempre libera video.play(), mesmo quando a política de autoplay
 * bloqueou tudo antes) — os listeners saem assim que o vídeo realmente
 * começa a tocar (evento `playing`).
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
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    tryPlay();

    const gestureEvents = ["touchstart", "pointerdown", "scroll"] as const;
    const cleanup = () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      gestureEvents.forEach((type) =>
        window.removeEventListener(type, tryPlay)
      );
    };

    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("playing", cleanup, { once: true });
    gestureEvents.forEach((type) =>
      window.addEventListener(type, tryPlay, { passive: true, once: true })
    );

    return cleanup;
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

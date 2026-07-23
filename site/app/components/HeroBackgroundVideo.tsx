"use client";

import { useEffect, useRef } from "react";

/**
 * `<video autoPlay muted>` sozinho não é confiável pro autoplay no
 * Safari/Chrome mobile: `muted` é uma propriedade do DOM, não um atributo
 * refletido, e o React não a serializa no HTML gerado pelo SSR — no
 * primeiro parse da página (antes da hidratação) o navegador ainda não
 * considera o vídeo mudo e bloqueia o autoplay; quando o React hidrata e
 * seta a propriedade via JS, a política de autoplay já rodou e não tenta
 * de novo (vídeo fica parado no primeiro frame). Setar `.muted = true` e
 * chamar `.play()` direto via ref, no mount, contorna isso.
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
      muted
      loop
      playsInline
      preload="auto"
      className={className}
    />
  );
}

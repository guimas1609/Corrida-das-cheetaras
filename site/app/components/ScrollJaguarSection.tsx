"use client";

import { useEffect, useRef, useState } from "react";
import CheetaraHead3D from "./CheetaraHead3D";

// Vídeo de fundo em loop. Fonte original veio do Google Drive do organizador,
// mas é servido a partir daqui (public/video/), não em proxy ao vivo: vídeo
// depende de Range requests para tocar/dar seek, e o Drive não garante
// suporte a isso em toda requisição — proxiar ao vivo (como as imagens)
// travaria ou pioraria o carregamento. Original intacto fica em
// assets-brutos/video/hero-loop-original.mp4.
//
// No mobile o vídeo é o quadro vertical completo, sem corte. No desktop
// (sm+) usa a versão recortada só com a arena/banner (sem a pessoa em
// primeiro plano), porque o quadro completo em tela larga jogaria o rosto
// dela direto atrás do 3D/texto.
const BG_VIDEO_MOBILE = "/video/hero-loop-vertical.mp4";
const BG_VIDEO_DESKTOP = "/video/hero-loop.mp4";

export default function ScrollJaguarSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        setProgress(p);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-black">
        {/* Fundo desfocado, preenche as bordas que sobrarem no letterbox */}
        <video
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl sm:hidden"
          src={BG_VIDEO_MOBILE}
        />
        {/* Mobile: vídeo vertical completo, sem cortar nenhuma borda */}
        <video
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-contain sm:hidden"
          src={BG_VIDEO_MOBILE}
        />
        {/* Desktop (sm+): recorte só com a arena/banner, preenchendo a tela */}
        <video
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 hidden h-full w-full object-cover sm:block"
          src={BG_VIDEO_DESKTOP}
        />
        {/* Overlay pra leitura do texto e tom da marca */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80"
        />

        <div className="relative z-10 h-[32vh] w-full max-w-xs sm:h-[38vh] sm:max-w-sm">
          <CheetaraHead3D progress={progress} />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center gap-3 px-6 pt-2 pb-10 text-center bg-[radial-gradient(ellipse_55%_85%_at_center,rgba(0,0,0,0.7),transparent_80%)]">
          {/* Lettering oficial, direto do Drive; o PNG tem margem transparente
              grande, compensada com scale (não afeta layout) */}
          <h1 className="relative aspect-[7/3] w-full max-w-2xl overflow-hidden sm:max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/drive-image?id=1No2iKYxW_5C4XCkVbJza_XRpxwUnnbAc&w=1200"
              alt="Corrida das Cheetaras"
              className="absolute top-1/2 left-1/2 w-full max-w-none -translate-x-1/2 -translate-y-1/2 scale-[1.9] [filter:drop-shadow(0_0_16px_rgba(255,255,255,0.5))_drop-shadow(0_2px_10px_rgba(0,0,0,0.8))]"
            />
          </h1>
        </div>
      </div>
    </section>
  );
}

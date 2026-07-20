"use client";

import { useEffect, useRef, useState } from "react";
import CheetaraHead3D from "./CheetaraHead3D";

// Foto oficial da largada (drone). O arquivo mora no Google Drive e é
// servido via /api/drive-image (proxy com cache — ver comentário na rota).
const BG_URL =
  "/api/drive-image?id=1_hmb4Z2o-9wb54lkDmY4PJR5QUaqRm9w&w=1920";

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
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* Foto da largada como fundo */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_URL})` }}
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
          <p className="text-lg font-medium text-white/90">
            A maior corrida do Maranhão
          </p>
          <p className="text-sm tracking-wide text-white/70 uppercase">
            Bacabal · Maranhão
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import CheetaraHead3D from "./CheetaraHead3D";

// Foto oficial da largada (drone), servida direto do Google Drive por opção
// do organizador — se o link quebrar, mover o arquivo para public/images/.
const BG_URL =
  "https://drive.google.com/thumbnail?id=1_hmb4Z2o-9wb54lkDmY4PJR5QUaqRm9w&sz=w1920";

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
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70"
        />

        <div className="relative z-10 h-[55vh] w-full max-w-xl">
          <CheetaraHead3D progress={progress} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3 px-6 pb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Corrida das Cheetaras
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

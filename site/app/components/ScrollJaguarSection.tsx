"use client";

import { useEffect, useRef, useState } from "react";
import CheetaraHead3D from "./CheetaraHead3D";

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
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6">
        <div className="h-72 w-72 sm:h-[26rem] sm:w-[26rem]">
          <CheetaraHead3D progress={progress} />
        </div>
        <p
          className="max-w-xs text-center text-xs text-muted-foreground transition-opacity duration-500"
          style={{ opacity: progress > 0.15 ? 1 : 0 }}
        >
          Prévia 3D estilizada — o modelo definitivo da nossa onça vem por aí.
        </p>
      </div>
    </section>
  );
}

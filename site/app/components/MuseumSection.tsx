"use client";

import { useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";

const PHOTOS = [
  "/api/drive-image?id=17BHab8cPQFn7xGyEa_EbNdN_sb4fa_Xj&w=800",
  "/api/drive-image?id=1NbSpLvCx1CRXEqPJOxVuf8PoAPcAqwQK&w=800",
  "/api/drive-image?id=1Q8TUFSdoFD9DoLjHx0J8XMhXwY3VfDO7&w=800",
  "/api/drive-image?id=1OOVFUAxA6pi2C8jvOQwAhwPzUk7q4g7V&w=800",
  "/api/drive-image?id=1lTcDUy1ySWuWd9Kz5UrjAOtDuW2q1PJE&w=800",
  "/api/drive-image?id=1wTI0_0pCDxY_gFtib5Yg1Smt8N3BtX4y&w=800",
];

const AUTOPLAY_MS = 4000;

export default function MuseumSection() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => {
    setIndex((next + PHOTOS.length) % PHOTOS.length);
  }, []);

  // Reinicia a contagem sempre que o índice muda (autoplay ou clique
  // manual), assim navegar na mão não faz o carrossel pular logo em seguida.
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % PHOTOS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index]);

  return (
    <section
      id="museu"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-8 px-6 py-24 text-center sm:max-w-3xl sm:py-32"
    >
      <Reveal>
        <span className="text-xs font-semibold tracking-widest text-cheetara-pink uppercase">
          Museu Cheetaras
        </span>
        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gradient-cheetara sm:text-6xl">
          Relembre as edições
        </h2>
      </Reveal>

      <Reveal delay={120} className="relative flex w-full max-w-xs items-center justify-center sm:max-w-2xl">
        <button
          type="button"
          aria-label="Foto anterior"
          onClick={() => go(index - 1)}
          className="absolute left-0 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-foreground shadow-[0_4px_16px_rgba(96,32,136,0.2)] backdrop-blur-sm transition hover:bg-white"
        >
          ‹
        </button>

        <div className="aspect-[3/4] w-full overflow-hidden rounded-3xl bg-black/5 shadow-[0_8px_30px_rgba(96,32,136,0.15)] sm:aspect-[16/9]">
          {/* object-contain: mostra a foto inteira, sem cortar rosto/corpo
              quando a proporção original não bate com o card (retrato no
              mobile, bem mais largo no desktop). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS[index]}
            alt={`Foto do Museu Cheetaras, edição ${index + 1}`}
            className="h-full w-full object-contain"
          />
        </div>

        <button
          type="button"
          aria-label="Próxima foto"
          onClick={() => go(index + 1)}
          className="absolute right-0 z-10 flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-foreground shadow-[0_4px_16px_rgba(96,32,136,0.2)] backdrop-blur-sm transition hover:bg-white"
        >
          ›
        </button>
      </Reveal>

      <div className="flex gap-2">
        {PHOTOS.map((photo, i) => (
          <button
            key={photo}
            type="button"
            aria-label={`Ir para foto ${i + 1}`}
            onClick={() => go(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? "bg-gradient-cheetara" : "bg-black/15"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

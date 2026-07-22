"use client";

import { useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import MuseumCarouselDesktop from "./MuseumCarouselDesktop";

const PHOTOS = [
  "/api/drive-image?id=17BHab8cPQFn7xGyEa_EbNdN_sb4fa_Xj&w=800",
  "/api/drive-image?id=1NbSpLvCx1CRXEqPJOxVuf8PoAPcAqwQK&w=800",
  "/api/drive-image?id=1Q8TUFSdoFD9DoLjHx0J8XMhXwY3VfDO7&w=800",
  "/api/drive-image?id=1OOVFUAxA6pi2C8jvOQwAhwPzUk7q4g7V&w=800",
  "/api/drive-image?id=1lTcDUy1ySWuWd9Kz5UrjAOtDuW2q1PJE&w=800",
  "/api/drive-image?id=1wTI0_0pCDxY_gFtib5Yg1Smt8N3BtX4y&w=800",
];

// Desktop pede fotos maiores (galeria quase full-width) — mesmos IDs, só
// troca a largura pedida ao proxy (1200 já está em ALLOWED_WIDTHS, então
// não exige nenhuma mudança em app/api/drive-image/route.ts).
const PHOTOS_DESKTOP = PHOTOS.map((url) => url.replace("w=800", "w=1200"));

const AUTOPLAY_MS = 4000;

// Mobile e desktop são duas árvores completamente independentes (mesmo
// padrão de ScrollJaguarSection.tsx: elementos irmãos gateados por
// `sm:hidden` / `hidden sm:block`, sem detecção de viewport via JS). O
// mobile é o carrossel original, sem nenhuma alteração de comportamento; o
// desktop é a experiência premium nova (MuseumCarouselDesktop.tsx), com seu
// próprio estado — não faz sentido compartilhar índice entre os dois, já
// que só um está visível/interativo por vez.
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
    <section id="museu" className="mx-auto w-full px-6 py-24 sm:py-32">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 text-center sm:hidden">
        <Reveal
          delay={120}
          className="relative flex w-full max-w-xs shrink-0 items-center justify-center"
        >
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => go(index - 1)}
            className="absolute left-0 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-foreground shadow-[0_4px_16px_rgba(96,32,136,0.2)] backdrop-blur-sm transition hover:bg-white"
          >
            ‹
          </button>

          <div className="aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-[0_8px_30px_rgba(96,32,136,0.15)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS[index]}
              alt={`Foto do Museu Cheetaras, edição ${index + 1}`}
              className="h-full w-full object-cover"
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

        <div className="flex flex-col items-center gap-6">
          <Reveal>
            <RevealText
              as="h2"
              className="block text-5xl font-bold tracking-tight text-gradient-cheetara"
            >
              Museu Cheetaras
            </RevealText>
            <RevealText
              as="span"
              className="mt-2 block text-sm font-semibold tracking-widest text-cheetara-pink uppercase"
            >
              Relembre as edições
            </RevealText>
          </Reveal>

          <div className="flex gap-3">
            {PHOTOS.map((photo, i) => (
              <button
                key={photo}
                type="button"
                aria-label={`Ir para foto ${i + 1}`}
                onClick={() => go(i)}
                className={`h-3.5 w-3.5 rounded-full transition-colors ${
                  i === index ? "bg-gradient-cheetara" : "bg-black/15"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <MuseumCarouselDesktop photos={PHOTOS_DESKTOP} />
      </div>
    </section>
  );
}

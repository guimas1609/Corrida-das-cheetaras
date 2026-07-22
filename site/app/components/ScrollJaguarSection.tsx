"use client";

import CheetaraHead3D from "./CheetaraHead3D";
import BackgroundVideo from "./BackgroundVideo";
import HeroPodiumScene from "./HeroPodiumScene";

// Vídeo de fundo em loop, só no mobile (quadro vertical completo, sem
// corte). Fonte original veio do Google Drive do organizador, mas é servido
// a partir daqui (public/video/), não em proxy ao vivo: vídeo depende de
// Range requests para tocar/dar seek, e o Drive não garante suporte a isso
// em toda requisição — proxiar ao vivo (como as imagens) travaria ou
// pioraria o carregamento. Original intacto fica em
// assets-brutos/video/hero-loop-original.mp4.
//
// No desktop (sm+) não tem vídeo nem foto de fundo — o pódio é 3D de
// verdade (HeroPodiumScene.tsx), na mesma cena do mark.
const BG_VIDEO_MOBILE = "/video/hero-loop-vertical.mp4";

/** Lettering oficial, recortado em duas peças (assets tirados do Drive,
    sem margem) pra "CHEETARAS" poder ficar maior que o subtítulo, cada uma
    preenchendo a largura sem cortar nada. Reaproveitado no bloco mobile
    (fluxo normal) e no overlay desktop (sobre a cena 3D). */
function Lettering() {
  return (
    <h1 className="flex w-full flex-col items-center gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/cheetaras-lettering-top.png"
        alt="Corrida das"
        className="w-full max-w-[170px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:max-w-[230px]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo/cheetaras-lettering-bottom.png"
        alt="Cheetaras"
        className="w-full max-w-[230px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:max-w-[300px]"
      />
    </h1>
  );
}

export default function ScrollJaguarSection() {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
      {/* Header fixo no topo do hero: logo à esquerda, menu hambúrguer
          (degradê da marca) à direita */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/cheetaras-mark.png"
          alt="Corrida das Cheetaras"
          className="h-10 w-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        />
        <button type="button" aria-label="Abrir menu" className="flex flex-col gap-1.5 p-1">
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
        </button>
      </header>

      {/* Vídeo sutil no mobile: quadro vertical completo, sem corte */}
      <BackgroundVideo
        className="absolute inset-0 h-full w-full object-cover opacity-25 sm:hidden"
        src={BG_VIDEO_MOBILE}
      />
      {/* Leve clareamento pra unificar o vídeo apagado (mobile) com o
          fundo holográfico ao redor. Desktop não usa: o piso do
          HeroPodiumScene já cobre visualmente essa área. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/60 sm:hidden"
      />

      {/* Mobile: mark pequeno isolado (sem pódio) + lettering abaixo, no
          fluxo normal — igual ao comportamento de sempre. */}
      <div className="relative z-10 h-[11vh] w-full max-w-[110px] sm:hidden">
        <CheetaraHead3D />
      </div>
      <div className="relative z-10 flex w-full flex-col items-center gap-1 px-6 pt-2 pb-10 text-center sm:hidden">
        <Lettering />
      </div>

      {/* Desktop: pódio + mark na mesma cena 3D (HeroPodiumScene.tsx), com
          o lettering sobreposto por cima, perto da base — igual a uma
          legenda sobre a peça, sem depender de alinhar DOM com imagem. */}
      <div className="relative z-10 hidden h-[70vh] w-full max-w-3xl sm:block">
        <HeroPodiumScene />
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-1 px-6 text-center">
          <Lettering />
        </div>
      </div>

      {/* Indicador de scroll, só desktop — rola suavemente até o Museu
          Cheetaras (próxima seção). */}
      <a
        href="#museu"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 z-10 hidden animate-bounce text-3xl text-gradient-cheetara sm:block"
      >
        ⌄
      </a>
    </section>
  );
}

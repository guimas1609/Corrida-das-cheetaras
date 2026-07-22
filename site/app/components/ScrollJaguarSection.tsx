"use client";

import CheetaraHead3D from "./CheetaraHead3D";
import BackgroundVideo from "./BackgroundVideo";
import HeroPodium from "./HeroPodium";

// Vídeo de fundo em loop, só no mobile (quadro vertical completo, sem
// corte). Fonte original veio do Google Drive do organizador, mas é servido
// a partir daqui (public/video/), não em proxy ao vivo: vídeo depende de
// Range requests para tocar/dar seek, e o Drive não garante suporte a isso
// em toda requisição — proxiar ao vivo (como as imagens) travaria ou
// pioraria o carregamento. Original intacto fica em
// assets-brutos/video/hero-loop-original.mp4.
//
// No desktop (sm+) não tem vídeo — vira o pódio (HeroPodium) por trás do
// 3D, com o fundo holográfico global aparecendo.
const BG_VIDEO_MOBILE = "/video/hero-loop-vertical.mp4";

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

      {/* Vídeo bem sutil por cima do fundo holográfico (não mais o fundo
          principal) — só no mobile: quadro vertical completo, sem corte.
          Desktop (sm+) fica só no fundo holográfico + pódio, sem vídeo. */}
      <BackgroundVideo
        className="absolute inset-0 h-full w-full object-cover opacity-25 sm:hidden"
        src={BG_VIDEO_MOBILE}
      />
      {/* Leve clareamento pra unificar o vídeo apagado com o fundo
          holográfico ao redor */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/60"
      />

      {/* 3D independente de scroll: gira sozinha e também pode ser
          arrastada com o dedo/mouse a qualquer momento */}
      <div className="relative z-10 h-[11vh] w-full max-w-[110px] sm:h-[16vh] sm:max-w-[160px]">
        <CheetaraHead3D />
      </div>

      {/* Pódio (1º/2º/3º lugar), só desktop — fica logo abaixo do 3D, que
          parece estar de pé sobre o bloco central (1º lugar). */}
      <HeroPodium />

      <div className="relative z-10 flex w-full flex-col items-center gap-1 px-6 pt-2 pb-10 text-center">
        {/* Lettering oficial, recortado em duas peças (assets tirados do
            Drive, sem margem) pra "CHEETARAS" poder ficar maior que o
            subtítulo, cada uma preenchendo a largura sem cortar nada. */}
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

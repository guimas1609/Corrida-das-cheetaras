"use client";

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
  return (
    <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-black">
      {/* Mobile: vídeo vertical completo, preenchendo a tela de ponta a
          ponta (o recorte é só uma aparada mínima nas laterais, não corta
          nada em cima/embaixo) */}
      <video
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
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

      {/* 3D independente de scroll: gira sozinha e também pode ser
          arrastada com o dedo/mouse a qualquer momento */}
      <div className="relative z-10 h-[11vh] w-full max-w-[110px] sm:h-[16vh] sm:max-w-[160px]">
        <CheetaraHead3D />
      </div>

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
    </section>
  );
}

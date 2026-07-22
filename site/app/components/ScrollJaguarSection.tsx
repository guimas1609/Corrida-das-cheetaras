"use client";

import CheetaraHead3D from "./CheetaraHead3D";

// Fundo do hero é sempre foto real da corrida (organizador, via proxy do
// Drive) — uma versão pro mobile, outra pro desktop. Fica dentro desta
// seção (h-screen), não no fundo global — assim some assim que rola pra
// próxima seção e volta pro holográfico (HolographicBackground.tsx).
const BG_IMAGE_MOBILE = "/api/drive-image?id=1ZI1NzWXc09eyG-BhC6xhsMCPH9stvqUz&w=1200";
const BG_IMAGE_DESKTOP = "/api/drive-image?id=1iQJr1iNY857BgnCsJEaF7w48OVpIz-fG&w=1920";

export default function ScrollJaguarSection() {
  return (
    <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
      {/* Navbar flutuante, quase transparente, com uma "mini elevação"
          (blur + sombra suave) — mobile e desktop. */}
      <header className="absolute inset-x-4 top-4 z-20 flex items-center justify-between rounded-2xl border border-white/25 bg-white/10 px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md sm:inset-x-8 sm:top-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/cheetaras-mark.png"
          alt="Corrida das Cheetaras"
          className="h-9 w-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        />
        <button type="button" aria-label="Abrir menu" className="flex flex-col gap-1.5 p-1">
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
        </button>
      </header>

      {/* Foto de fundo, cobrindo só esta seção — mobile e desktop com
          recortes diferentes */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src={BG_IMAGE_MOBILE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src={BG_IMAGE_DESKTOP}
        alt=""
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
      />
      {/* Escurece o fundo (em vez de clarear) — o mark precisa ser o
          elemento mais iluminado da tela, a foto fica mais de "cenário".
          Vinheta radial reforça o centro, estilo hero premium. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/45"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]"
      />

      {/* Mark é a peça principal do hero, dentro de uma vitrine de vidro 3D
          de verdade (GlassCase, dentro de CheetaraHead3D.tsx) — em pé, gira
          sozinho e também pode ser arrastado, independente de scroll. */}
      <div className="relative z-10 h-[30vh] w-full max-w-[15rem] sm:h-[34vh] sm:max-w-[22rem]">
        {/* Halo roxo bem sutil atrás da vitrine, como se fosse uma luz do
            próprio evento refletindo no vidro */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[80%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(96,32,136,0.35),transparent_70%)] blur-2xl" />
        </div>
        {/* Sombra difusa sob a vitrine, pra "ancorar" ela na foto de fundo */}
        <div
          aria-hidden
          className="absolute bottom-4 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-[50%] bg-black/30 blur-xl"
        />
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

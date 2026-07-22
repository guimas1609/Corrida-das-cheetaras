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
          recortes diferentes. Leve blur simula perda de foco no fundo
          (aproximação em CSS de um depth-of-field discreto). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src={BG_IMAGE_MOBILE}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px] sm:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src={BG_IMAGE_DESKTOP}
        alt=""
        className="absolute inset-0 hidden h-full w-full scale-105 object-cover blur-[2px] sm:block"
      />
      {/* Escurece ~35% (a logo precisa ser o ponto focal) + vinheta radial
          suave — centro um pouco mais claro, bordas mais escuras. */}
      <div aria-hidden className="absolute inset-0 bg-black/35" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.5)_100%)]"
      />

      {/* Mark é a peça central do hero, "flutuando" sozinha — sem caixa,
          card ou container ao redor. Tudo (halo, sombra, poeira luminosa,
          tilt pelo mouse) vem de dentro da própria cena 3D
          (CheetaraHead3D.tsx), não de camadas CSS por fora. */}
      <div className="relative z-10 h-[38vh] w-full max-w-[20rem] sm:h-[50vh] sm:max-w-[30rem]">
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

import Reveal from "./Reveal";
import HeroLogo from "./HeroLogo";
import SiteMenu from "./SiteMenu";
import SideLines from "./SideLines";
import CursorGlow from "./CursorGlow";

// Fundo do hero é sempre foto real da corrida (organizador, via proxy do
// Drive) — uma versão pro mobile, outra pro desktop. Fica dentro desta
// seção (h-screen), não no fundo global — assim some assim que rola pra
// próxima seção e volta pro holográfico (HolographicBackground.tsx).
const BG_IMAGE_MOBILE = "/api/drive-image?id=1ZI1NzWXc09eyG-BhC6xhsMCPH9stvqUz&w=1200";
const BG_IMAGE_DESKTOP = "/api/drive-image?id=1iQJr1iNY857BgnCsJEaF7w48OVpIz-fG&w=1920";

// Camada que dissolve a foto em branco nas quatro bordas + vinheta radial
// central — a foto deve "emergir" do fundo branco, sem corte perceptível.
// A área realmente "nítida" fica pequena e concentrada no centro; o resto
// já começa a se perder em branco bem antes da borda.
const FADE_TO_WHITE = {
  background: [
    "linear-gradient(to bottom, var(--background) 0%, transparent 30%, transparent 62%, var(--background) 100%)",
    "linear-gradient(to right, var(--background) 0%, transparent 18%, transparent 82%, var(--background) 100%)",
    "radial-gradient(ellipse 55% 48% at 50% 42%, transparent 0%, transparent 25%, var(--background) 78%)",
  ].join(", "),
};

export default function ScrollJaguarSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background sm:bg-transparent">
      {/* Navbar flutuante, discreta — leve translucidez e blur suave, sem
          competir com o hero claro. */}
      <header className="absolute inset-x-4 top-4 z-20 flex items-center justify-between rounded-2xl border border-black/5 bg-white/50 px-5 py-3 shadow-sm backdrop-blur-sm sm:inset-x-8 sm:top-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo/cheetaras-mark.png"
          alt="Corrida das Cheetaras"
          className="h-9 w-9"
        />
        <SiteMenu />
      </header>

      {/* Foto de fundo: alto brilho, baixa saturação, contraste moderado —
          leve, nunca dramática. Zoom lento tipo Ken Burns, contido pelo
          overflow-hidden do wrapper. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden sm:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_IMAGE_MOBILE}
          alt=""
          className="h-full w-full scale-100 animate-hero-zoom object-cover brightness-[1.4] contrast-[0.9] saturate-[0.2]"
        />
      </div>

      {/* Desktop (teste): sem foto de fundo full-bleed — a seção agora é
          `sm:bg-transparent` (ver className acima), então o fundo
          holográfico global (HolographicBackground.tsx, o mesmo usado no
          resto do site) aparece atrás. Sobra só a foto do card abaixo como
          único objeto de foco, em vez de duas fotos competindo. */}

      {/* Desktop (teste): a foto do hero vira um card contido, tamanho
          moderado, centralizado — como se "flutuasse" atrás da logo (que
          já fica centralizada no mesmo ponto via flex, no wrapper de
          conteúdo abaixo). Nítida/natural, sem lavar em branco — não tem
          mais outra camada full-bleed pra competir visualmente. z-index
          entre o fundo e o conteúdo (z-10), então a logo aparece por cima
          do card. */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 z-[6] hidden h-[85vh] w-[90%] max-w-7xl -translate-x-1/2 -translate-y-1/2 sm:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_IMAGE_DESKTOP}
          alt=""
          // Fade nas bordas (correção): o raio da elipse (70% 70%) media
          // 70% da caixa a partir do centro — como a borda da imagem fica a
          // só 50% do centro, o mask nunca chegava a "transparent" dentro
          // da própria caixa, então a borda continuava com um corte reto
          // (só um pouco mais escura). Com raio menor (40%), o degradê
          // termina ANTES da borda, sobrando uma margem de transparência de
          // verdade. Sem cor (grayscale) + brilho bem alto + opacidade
          // geral menor, pra ficar bem mais branca e a logo se destacar.
          style={{
            maskImage:
              "radial-gradient(ellipse 40% 40% at 50% 50%, black 20%, rgba(0,0,0,0.5) 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 40% 40% at 50% 50%, black 20%, rgba(0,0,0,0.5) 55%, transparent 100%)",
          }}
          className="h-full w-full object-cover opacity-70 grayscale brightness-[1.6] contrast-[1.05]"
        />
      </div>

      {/* Véu branco uniforme por cima de toda a foto — só mobile agora
          (o desktop não tem mais foto full-bleed pra clarear). */}
      <div aria-hidden className="absolute inset-0 bg-background/55 sm:hidden" />

      {/* Dissolve a foto em branco nas bordas — só mobile agora; no
          desktop o fundo holográfico global já é a base calma da cena. */}
      <div aria-hidden className="absolute inset-0 sm:hidden" style={FADE_TO_WHITE} />

      {/* Faixa de luz local — no mobile o fundo opaco da seção esconde a
          instância global (ver layout.tsx), então o hero tem a sua
          própria, acima da foto e abaixo do conteúdo (z-10). No desktop
          convive normalmente com o holográfico que já aparece atrás. */}
      <CursorGlow zIndexClassName="z-[5]" />

      {/* Linhas verticais nas laterais — só desktop, reagem ao mouse. */}
      <SideLines />

      {/* Conteúdo central: logo (já traz o nome por extenso) e CTA — muito
          espaço negativo, entrada em sequência (logo → botão) via Reveal. */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-32 text-center sm:gap-12">
        <Reveal>
          <HeroLogo />
        </Reveal>

        {/* Só no desktop — no mobile o CTA imediato some daqui e quem
            assume é o FloatingCTA, que só aparece depois que a pessoa rola
            a tela (ver FloatingCTA.tsx). */}
        <Reveal delay={200} className="hidden sm:block">
          <a
            href="#museu"
            className="relative block overflow-hidden border border-white/40 bg-gradient-to-br from-cheetara-pink/90 to-cheetara-purple/90 px-10 py-3 text-base font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_30px_rgba(96,32,136,0.4)] backdrop-blur-md transition [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] hover:from-cheetara-pink hover:to-cheetara-purple"
          >
            {/* Sheen de vidro/gel — realce claro na metade de cima. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full animate-button-shine bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.65)_50%,transparent_65%)]"
            />
            <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
              Quero me inscrever
            </span>
          </a>
        </Reveal>
      </div>

      {/* Indicador de scroll, só desktop — rola suavemente até o Museu
          Cheetaras (próxima seção). */}
      <a
        href="#museu"
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 z-10 hidden animate-bounce text-2xl text-muted-foreground sm:block"
      >
        ⌄
      </a>
    </section>
  );
}

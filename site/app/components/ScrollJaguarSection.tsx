import Reveal from "./Reveal";
import HeroLogo from "./HeroLogo";
import SiteMenu from "./SiteMenu";
import SideLines from "./SideLines";
import CursorGlow from "./CursorGlow";
import RaceCountdownBanner from "./RaceCountdownBanner";

// Fundo do hero: vídeo real da corrida no mobile (loop, mudo — ver
// public/video/), foto no desktop (organizador, via proxy do Drive). Fica
// dentro desta seção (h-screen), não no fundo global — assim some assim
// que rola pra próxima seção e volta pro holográfico
// (HolographicBackground.tsx). O vídeo é servido estático de public/video/
// (não via proxy do Drive) porque precisa de Range requests pra dar seek,
// que o Drive não garante (ver CLAUDE.md).
const BG_VIDEO_MOBILE = "/video/hero-mobile.mp4";
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
          competir com o hero claro. Agrupada num wrapper com a placa de
          contagem regressiva pra elas nascerem com a mesma largura e
          cantos emendados, em vez de duas posições absolutas "chutadas"
          independentemente. */}
      <div className="absolute inset-x-4 top-4 z-20 sm:inset-x-8 sm:top-6">
        <header className="relative z-10 flex items-center justify-between rounded-t-2xl border border-black/5 bg-white/50 px-5 py-3 shadow-sm backdrop-blur-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/cheetaras-mark.png"
            alt="Corrida das Cheetaras"
            className="h-9 w-9"
          />
          <SiteMenu />
        </header>

        {/* Placa de contagem regressiva, presa embaixo da navbar (mobile
            e desktop). */}
        <RaceCountdownBanner />
      </div>

      {/* Vídeo de fundo: mesmo tratamento visual (brilho/contraste/
          saturação) e zoom lento tipo Ken Burns que a foto tinha antes —
          troca só a fonte, a "vibe" clara/esbranquiçada continua igual.
          autoPlay+muted+playsInline é o que permite autoplay em iOS/Android
          sem gesto do usuário; loop fecha o ciclo sem controles visíveis. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden sm:hidden">
        <video
          src={BG_VIDEO_MOBILE}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
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
          {/* Mesma linguagem visual de FloatingCTA.tsx e EnrollLedBar.tsx —
              outline claro + borda que se desenha em SVG no hover
              (group-hover), pra os CTAs do site ficarem consistentes. */}
          <a
            href="#museu"
            className="group relative block rounded-2xl border border-black/10 bg-white/80 px-10 py-3 text-base font-medium text-foreground shadow-sm backdrop-blur-sm transition"
          >
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="hero-cta-border-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-cheetara-pink)" />
                  <stop offset="100%" stopColor="var(--color-cheetara-purple)" />
                </linearGradient>
              </defs>
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="15"
                fill="none"
                stroke="url(#hero-cta-border-gradient)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                pathLength={100}
                strokeDasharray={100}
                className="[stroke-dashoffset:100] transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0]"
              />
            </svg>

            <span className="relative flex items-center justify-center gap-2">
              Quero me inscrever
              <svg
                aria-hidden
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="8 7 17 7 17 16" />
              </svg>
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

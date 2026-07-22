import Reveal from "./Reveal";
import HeroLogo from "./HeroLogo";
import SiteMenu from "./SiteMenu";
import SideLines from "./SideLines";

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
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
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
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_IMAGE_MOBILE}
          alt=""
          className="h-full w-full scale-100 animate-hero-zoom object-cover brightness-[1.4] contrast-[0.9] saturate-[0.2] sm:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_IMAGE_DESKTOP}
          alt=""
          className="hidden h-full w-full scale-100 animate-hero-zoom object-cover brightness-[1.4] contrast-[0.9] saturate-[0.2] sm:block"
        />
      </div>

      {/* Véu branco uniforme por cima de toda a foto — garante leveza e
          contraste pro texto em qualquer ponto, não só nas bordas. */}
      <div aria-hidden className="absolute inset-0 bg-background/55" />

      {/* Dissolve a foto em branco nas bordas — a única "moldura" é o
          próprio fundo do site. */}
      <div aria-hidden className="absolute inset-0" style={FADE_TO_WHITE} />

      {/* Linhas verticais nas laterais — só desktop, reagem ao mouse. */}
      <SideLines />

      {/* Conteúdo central: logo (já traz o nome por extenso) e CTA — muito
          espaço negativo, entrada em sequência (logo → botão) via Reveal. */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-10 px-6 py-32 text-center sm:gap-12">
        <Reveal>
          <HeroLogo />
        </Reveal>

        <Reveal delay={200}>
          <a
            href="#museu"
            className="relative block overflow-hidden rounded-none border border-white/40 bg-gradient-to-br from-cheetara-pink/55 to-cheetara-purple/55 px-16 py-4 text-lg font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_30px_rgba(96,32,136,0.25)] backdrop-blur-md transition hover:from-cheetara-pink/70 hover:to-cheetara-purple/70"
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

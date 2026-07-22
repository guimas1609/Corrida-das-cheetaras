import Reveal from "./Reveal";

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
        <button type="button" aria-label="Abrir menu" className="flex flex-col gap-1.5 p-1">
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
          <span className="h-0.5 w-7 rounded-full bg-gradient-cheetara" />
        </button>
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

      {/* Conteúdo central: logo, nome, chamada e CTA — muito espaço
          negativo, entrada em sequência (logo → título → subtítulo →
          botão) via Reveal. */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-7 px-6 py-32 text-center sm:gap-8">
        <Reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/cheetaras-mark-512.png"
            alt="Corrida das Cheetaras"
            className="h-16 w-16 sm:h-20 sm:w-20"
          />
        </Reveal>

        <Reveal delay={150}>
          <h1 className="text-4xl font-bold tracking-tight text-gradient-cheetara sm:text-6xl">
            V Corrida das Cheetaras
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="text-lg font-light tracking-wide text-muted-foreground sm:text-xl">
            A maior corrida de rua de Bacabal.
          </p>
        </Reveal>

        <Reveal delay={450}>
          <a
            href="#museu"
            className="rounded-full bg-cheetara-purple px-8 py-3.5 font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md"
          >
            Quero me inscrever
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

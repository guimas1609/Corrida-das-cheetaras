import RevealText from "./RevealText";

// Distâncias oficiais da Corrida das Cheetaras. Faixas etárias ainda são
// genéricas — substituir pelos números oficiais quando definidos.
const DISTANCES = [
  { km: "2,5", label: "Caminhada/Corrida" },
  { km: "5", label: "Corrida" },
];

const AGE_GROUPS = [
  "18 a 29 anos",
  "30 a 39 anos",
  "40 a 49 anos",
  "50 a 59 anos",
  "60+ anos",
];

export default function RouteSection() {
  return (
    <section id="percurso" className="relative w-full overflow-hidden">
      {/* Fundo separado do conteúdo de propósito: o mask-image de entrada
          (só mobile, ver .route-carpet-fade em globals.css) fica só
          aqui — se estivesse na <section> inteira, mascararia o texto
          junto (que começa bem antes do fundo terminar de "nascer" numa
          seção alta assim), ficando ilegível no topo. */}
      <div
        aria-hidden
        className="route-carpet-bg route-carpet-fade absolute inset-0 z-0"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
        <div className="text-center">
          <RevealText
            as="span"
            className="text-sm font-semibold tracking-widest text-white/80 uppercase"
          >
            Percurso
          </RevealText>
          <RevealText
            as="h2"
            className="mt-3 block text-5xl font-black tracking-tight text-white sm:text-6xl"
          >
            Escolha sua distância
          </RevealText>
          <RevealText
            as="p"
            className="mx-auto mt-5 block max-w-md text-lg text-white/70"
          >
            Duas modalidades pra todo mundo participar.
          </RevealText>
        </div>

        <div className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-5 sm:grid-cols-2">
          {DISTANCES.map((d) => (
            <div
              key={d.km}
              className="flex flex-col items-center gap-1 rounded-3xl border border-white/20 bg-white/10 py-10 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-sm"
            >
              <span className="text-7xl font-black text-white">
                <RevealText as="span">{d.km}</RevealText>
                <RevealText as="span" className="text-3xl align-top">
                  km
                </RevealText>
              </span>
              <RevealText as="span" className="block text-base text-white/70">
                {d.label}
              </RevealText>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <RevealText as="h3" className="block text-2xl font-bold text-white">
            Faixas etárias
          </RevealText>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {AGE_GROUPS.map((group) => (
              <RevealText
                key={group}
                as="span"
                className="rounded-full border border-white/25 bg-white/15 px-5 py-2.5 text-base text-white backdrop-blur-sm"
              >
                {group}
              </RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

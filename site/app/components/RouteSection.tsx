import RevealText from "./RevealText";

// Distâncias oficiais da Corrida das Cheetaras. Faixas etárias ainda são
// genéricas — substituir pelos números oficiais quando definidos.
const DISTANCES = [
  { km: "2,5", label: "Caminhada/Corrida" },
  { km: "5", label: "Corrida" },
];

const AGE_GROUPS = [
  "Até 17 anos",
  "18 a 29 anos",
  "30 a 39 anos",
  "40 a 49 anos",
  "50 a 59 anos",
  "60+ anos",
];

export default function RouteSection() {
  return (
    <section id="percurso" className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
      <div className="text-center">
        <RevealText
          as="span"
          className="text-sm font-semibold tracking-widest text-cheetara-pink uppercase"
        >
          Percurso
        </RevealText>
        <RevealText
          as="h2"
          className="mt-3 block text-5xl font-black tracking-tight text-foreground sm:text-6xl"
        >
          Escolha sua distância
        </RevealText>
        <RevealText
          as="p"
          className="mx-auto mt-5 block max-w-md text-lg text-muted-foreground"
        >
          Duas modalidades pra todo mundo participar.
        </RevealText>
      </div>

      <div className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-5 sm:grid-cols-2">
        {DISTANCES.map((d) => (
          <div
            key={d.km}
            className="flex flex-col items-center gap-1 rounded-3xl border border-black/5 bg-white/50 py-10 shadow-[0_8px_30px_rgba(96,32,136,0.1)] backdrop-blur-sm"
          >
            <span className="text-gradient-cheetara text-7xl font-black">
              <RevealText as="span">{d.km}</RevealText>
              <RevealText as="span" className="text-3xl align-top">
                km
              </RevealText>
            </span>
            <RevealText as="span" className="block text-base text-muted-foreground">
              {d.label}
            </RevealText>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <RevealText as="h3" className="block text-2xl font-bold text-foreground">
          Faixas etárias
        </RevealText>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {AGE_GROUPS.map((group) => (
            <RevealText
              key={group}
              as="span"
              className="rounded-full border border-black/5 bg-white/60 px-5 py-2.5 text-base text-foreground backdrop-blur-sm"
            >
              {group}
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

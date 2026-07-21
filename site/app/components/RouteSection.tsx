import Reveal from "./Reveal";

// Valores genéricos (distâncias e faixas etárias comuns em corridas de
// rua) — substituir pelos números oficiais da Corrida das Cheetaras.
const DISTANCES = [
  { km: "5", label: "Corrida/Caminhada" },
  { km: "10", label: "Corrida" },
  { km: "21", label: "Meia Maratona" },
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
    <section className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32">
      <Reveal className="text-center">
        <span className="text-sm font-semibold tracking-widest text-cheetara-pink uppercase">
          Percurso
        </span>
        <h2 className="mt-3 text-5xl font-black tracking-tight text-foreground sm:text-6xl">
          Escolha sua distância
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
          Valores de exemplo — o percurso e as distâncias oficiais serão
          divulgados em breve.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {DISTANCES.map((d) => (
            <div
              key={d.km}
              className="flex flex-col items-center gap-1 rounded-3xl border border-black/5 bg-white/50 py-10 shadow-[0_8px_30px_rgba(96,32,136,0.1)] backdrop-blur-sm"
            >
              <span className="text-gradient-cheetara text-7xl font-black">
                {d.km}
                <span className="text-3xl align-top">km</span>
              </span>
              <span className="text-base text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={220}>
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground">
            Faixas etárias
          </h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {AGE_GROUPS.map((group) => (
              <span
                key={group}
                className="rounded-full border border-black/5 bg-white/60 px-5 py-2.5 text-base text-foreground backdrop-blur-sm"
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

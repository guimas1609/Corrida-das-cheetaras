import PhotoPlaceholder from "./PhotoPlaceholder";
import Reveal from "./Reveal";

const ITEMS = [
  { icon: "🏆", label: "Troféu de Campeão" },
  { icon: "🥇", label: "Medalha de Ouro" },
  { icon: "🥈", label: "Medalha de Prata" },
  { icon: "🥉", label: "Medalha de Bronze" },
  { icon: "🎽", label: "Medalha Finisher" },
];

/** Galeria horizontal com scroll — conteúdo genérico até termos as fotos reais. */
export default function TrophyGallery() {
  return (
    <section className="py-24 sm:py-32">
      <Reveal className="mx-auto max-w-5xl px-6 text-center">
        <span className="text-xs font-semibold tracking-widest text-cheetara-pink uppercase">
          Premiação
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Troféu e medalhas
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Arraste pro lado pra ver todas.
        </p>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex w-48 shrink-0 snap-center flex-col items-center gap-3 sm:w-56"
            >
              <PhotoPlaceholder icon={item.icon} className="aspect-square w-full" />
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

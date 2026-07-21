import PhotoPlaceholder from "./PhotoPlaceholder";
import Reveal from "./Reveal";

/** Conteúdo genérico — substituir por texto/fotos reais do organizador. */
export default function MuseumSection() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-24 sm:py-32 md:flex-row md:gap-16">
      <Reveal className="w-full md:w-1/2">
        <PhotoPlaceholder icon="🏛️" className="aspect-[4/5] w-full" />
      </Reveal>

      <Reveal delay={120} className="w-full md:w-1/2">
        <span className="text-xs font-semibold tracking-widest text-cheetara-pink uppercase">
          Museu Cheetara
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          A história de cada edição, guardada com carinho.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Um espaço dedicado à trajetória da Corrida das Cheetaras — troféus,
          recordes, fotos de largada e chegada, e as memórias de quem já
          fez parte dessa história. Em breve, um acervo completo das
          edições anteriores.
        </p>
      </Reveal>
    </section>
  );
}

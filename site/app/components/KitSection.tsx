import Reveal from "./Reveal";
import RevealText from "./RevealText";

const SHIRT_URL = "/api/drive-image?id=19ISR32JWRHrT4u1u4P-Fhfyw71LEtoYQ&w=1200";

export default function KitSection() {
  return (
    <section
      id="kit"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-24 sm:py-32 md:flex-row md:gap-16"
    >
      <Reveal className="w-full md:w-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SHIRT_URL}
          alt="Camiseta oficial da Corrida das Cheetaras 2026"
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-[0_8px_30px_rgba(96,32,136,0.15)]"
        />
      </Reveal>

      <Reveal delay={120} className="w-full md:w-1/2">
        <RevealText
          as="span"
          className="text-sm font-semibold tracking-widest text-cheetara-pink uppercase"
        >
          Kit oficial
        </RevealText>
        <RevealText
          as="h2"
          className="mt-3 block text-5xl font-black tracking-tight text-gradient-cheetara sm:text-6xl"
        >
          Kit Cheetaras 2026
        </RevealText>
        <RevealText
          as="p"
          className="mt-5 block text-lg leading-relaxed text-muted-foreground"
        >
          A camiseta oficial da VI Corrida das Cheetaras, sua companheira do
          aquecimento até a linha de chegada.
        </RevealText>
      </Reveal>
    </section>
  );
}

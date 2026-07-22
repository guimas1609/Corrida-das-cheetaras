import Reveal from "./Reveal";

const TROPHY_URL = "/api/drive-image?id=1P0Z5S8son1FKHLjtUolab3v_rYfJGIEP&w=1200";
const MEDAL_URL = "/api/drive-image?id=1D_YfWTZWyAdSzIEFK8Jps0u6OiJuvkoW&w=1200";

export default function TrophyGallery() {
  return (
    <section
      id="premiacao"
      className="mx-auto flex w-full max-w-3xl flex-col items-center gap-28 px-6 py-24 text-center sm:py-32"
    >
      <div className="flex flex-col items-center gap-10">
        <Reveal>
          <span className="text-sm font-semibold tracking-widest text-cheetara-pink uppercase">
            Premiação
          </span>
          <h2 className="mt-3 text-6xl font-black tracking-tight text-gradient-cheetara sm:text-7xl">
            TROFÉU 2026
          </h2>
        </Reveal>
        <Reveal delay={150} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={TROPHY_URL}
            alt="Troféu oficial da Corrida das Cheetaras 2026"
            className="mx-auto w-full max-w-sm drop-shadow-[0_25px_50px_rgba(96,32,136,0.25)]"
          />
        </Reveal>
      </div>

      <div className="flex flex-col items-center gap-10">
        <Reveal>
          <span className="text-sm font-semibold tracking-widest text-cheetara-pink uppercase">
            Premiação
          </span>
          <h2 className="mt-3 text-6xl font-black tracking-tight text-gradient-cheetara sm:text-7xl">
            MEDALHA 2026
          </h2>
        </Reveal>
        <Reveal delay={150} className="w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MEDAL_URL}
            alt="Medalha oficial da Corrida das Cheetaras 2026"
            className="mx-auto w-full max-w-xs drop-shadow-[0_25px_50px_rgba(96,32,136,0.25)]"
          />
        </Reveal>
      </div>
    </section>
  );
}

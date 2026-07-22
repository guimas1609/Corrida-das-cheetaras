import type { CSSProperties } from "react";
import ProximityTilt from "./ProximityTilt";
import Reveal from "./Reveal";
import RevealText from "./RevealText";

const TROPHY_URL = "/api/drive-image?id=1P0Z5S8son1FKHLjtUolab3v_rYfJGIEP&w=1200";
const MEDAL_URL = "/api/drive-image?id=1D_YfWTZWyAdSzIEFK8Jps0u6OiJuvkoW&w=1200";

// A foto da medalha corta a fita seca, num retângulo — dissolve o topo em
// transparência (mask, não opacity: opacity esmaeceria a medalha inteira)
// pra fita "dissipar" no fundo em vez de terminar num corte reto.
const MEDAL_RIBBON_FADE: CSSProperties = {
  maskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%)",
};

export default function TrophyGallery() {
  return (
    <section
      id="premiacao"
      className="mx-auto flex w-full max-w-3xl flex-col items-center gap-28 px-6 py-24 text-center sm:py-32"
    >
      <div className="flex flex-col items-center gap-10">
        <div>
          <RevealText
            as="span"
            className="text-sm font-semibold tracking-widest text-cheetara-pink uppercase"
          >
            Premiação
          </RevealText>
          <RevealText
            as="h2"
            className="mt-3 block text-6xl font-black tracking-tight text-gradient-cheetara sm:text-7xl"
          >
            TROFÉU 2026
          </RevealText>
        </div>
        <Reveal delay={150} className="w-full">
          <ProximityTilt className="mx-auto w-full max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TROPHY_URL}
              alt="Troféu oficial da Corrida das Cheetaras 2026"
              draggable={false}
              className="w-full select-none drop-shadow-[0_25px_50px_rgba(96,32,136,0.25)]"
            />
          </ProximityTilt>
        </Reveal>
      </div>

      <div className="flex flex-col items-center gap-10">
        <div>
          <RevealText
            as="span"
            className="text-sm font-semibold tracking-widest text-cheetara-pink uppercase"
          >
            Premiação
          </RevealText>
          <RevealText
            as="h2"
            className="mt-3 block text-6xl font-black tracking-tight text-gradient-cheetara sm:text-7xl"
          >
            MEDALHA 2026
          </RevealText>
        </div>
        <Reveal delay={150} className="w-full">
          <ProximityTilt className="mx-auto w-full max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MEDAL_URL}
              alt="Medalha oficial da Corrida das Cheetaras 2026"
              draggable={false}
              style={MEDAL_RIBBON_FADE}
              className="w-full select-none drop-shadow-[0_12px_20px_rgba(96,32,136,0.12)]"
            />
          </ProximityTilt>
        </Reveal>
      </div>
    </section>
  );
}

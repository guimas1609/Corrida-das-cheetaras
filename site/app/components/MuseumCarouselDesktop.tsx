"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useVelocity,
} from "framer-motion";
import Reveal from "./Reveal";
import RevealText from "./RevealText";

const AUTOPLAY_MS = 4000;
const SLIDE_GAP = 340; // px entre os centros de dois slides vizinhos
const WHEEL_SENSITIVITY = 300; // px de wheel-delta pra cobrir 1 slide inteiro
const WHEEL_IDLE_MS = 120; // silêncio do wheel antes de assentar no slide mais próximo
const SETTLE_DURATION = 0.72; // segundos — mesma família de duration-700 usada em Reveal/RevealText
const SETTLE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Distância circular de `slideIndex` até a posição virtual `vp`, dando a
// volta pelo array (ex: com 6 fotos, a foto 0 fica a +1 de distância da
// foto 5, não a -5) — assim o "deck" nunca precisa resetar/pular.
function circularOffset(slideIndex: number, vp: number, count: number) {
  const raw = slideIndex - vp;
  const wrapped = ((raw % count) + count) % count;
  return wrapped > count / 2 ? wrapped - count : wrapped;
}

function Slide({
  slideIndex,
  virtualPosition,
  skewX,
  photo,
  total,
  reducedMotion,
  onClick,
}: {
  slideIndex: number;
  virtualPosition: ReturnType<typeof useMotionValue<number>>;
  skewX: ReturnType<typeof useTransform<number, number>>;
  photo: string;
  total: number;
  reducedMotion: boolean;
  onClick: () => void;
}) {
  const offset = useTransform(virtualPosition, (vp) =>
    circularOffset(slideIndex, vp, total)
  );
  const x = useTransform(offset, (o) => o * SLIDE_GAP);
  const scale = useTransform(
    offset,
    [-1, 0, 1],
    reducedMotion ? [1, 1, 1] : [0.82, 1, 0.82],
    { clamp: true }
  );
  const y = useTransform(offset, [-1, 0, 1], reducedMotion ? [0, 0, 0] : [14, 0, 14], {
    clamp: true,
  });
  const opacity = useTransform(
    offset,
    [-1.5, -1, 0, 1, 1.5],
    reducedMotion ? [0, 1, 1, 1, 0] : [0, 0.45, 1, 0.45, 0],
    { clamp: true }
  );
  // Foto central "acorda" um pouco no hover — camada separada da que já
  // controla escala pela posição virtual, senão as duas fontes de scale
  // brigariam entre si.
  const initialIsCenter = Math.abs(offset.get()) < 0.05;
  const isCenterRef = useRef(initialIsCenter);
  const [isCenter, setIsCenter] = useState(initialIsCenter);
  useEffect(() => {
    return offset.on("change", (o) => {
      const center = Math.abs(o) < 0.05;
      if (center !== isCenterRef.current) {
        isCenterRef.current = center;
        setIsCenter(center);
      }
    });
  }, [offset]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 aspect-[3/4] w-[22rem] -translate-x-1/2 -translate-y-1/2"
      style={{ x, y, scale, skewX, opacity, willChange: "transform, opacity" }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-hidden={!isCenter}
        tabIndex={isCenter ? 0 : -1}
        whileHover={isCenter ? { scale: 1.03 } : undefined}
        className={`block h-full w-full overflow-hidden rounded-3xl transition-shadow duration-300 ${
          isCenter
            ? "cursor-grab shadow-[0_25px_60px_rgba(96,32,136,0.3)] active:cursor-grabbing"
            : "cursor-pointer"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          draggable={false}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </motion.button>
    </motion.div>
  );
}

export default function MuseumCarouselDesktop({ photos }: { photos: string[] }) {
  const virtualPosition = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const wheelIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartVP = useRef(0);
  const reducedMotion = useReducedMotion() ?? false;
  const total = photos.length;

  // "Deforma" a foto na borda enquanto arrasta: quanto mais rápido o gesto
  // (arraste ou snap do settle), mais as fotos inclinam, tipo elástico —
  // volta a 0 assim que o movimento desacelera, sem estado extra pra
  // gerenciar (é só a velocidade do próprio virtualPosition).
  const positionVelocity = useVelocity(virtualPosition);
  const skewX = useTransform(positionVelocity, (v) =>
    reducedMotion ? 0 : Math.max(-10, Math.min(10, v * 1.4))
  );

  const settle = useCallback(
    (target: number) => {
      const wrapped = ((target % total) + total) % total;
      setCurrentIndex(wrapped);
      animate(virtualPosition, target, {
        duration: reducedMotion ? 0 : SETTLE_DURATION,
        ease: SETTLE_EASE,
      });
    },
    [total, virtualPosition, reducedMotion]
  );

  const go = useCallback(
    (delta: number) => {
      setIsInteracting(false);
      settle(Math.round(virtualPosition.get()) + delta);
    },
    [settle, virtualPosition]
  );

  // Autoplay — só roda em telas desktop (mesmo sem o bloco estar visível, o
  // React continua montando os dois carrosséis; sem esse gate o timer do
  // desktop ficaria "tiquetaqueando" à toa em telas mobile). Reregistra a
  // cada `settle`, igual ao padrão já usado no carrossel mobile.
  useEffect(() => {
    if (isInteracting) return;
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    const id = setInterval(() => {
      settle(Math.round(virtualPosition.get()) + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isInteracting, currentIndex, settle, virtualPosition]);

  // Wheel nativo (não o onWheel sintético) porque precisamos de
  // preventDefault de verdade — mas só quando o gesto é claramente
  // horizontal (trackpad/shift+scroll). Um wheel vertical comum (rolar a
  // página) tem que passar direto: interceptar delta vertical aqui
  // travava a rolagem da página inteira sempre que o mouse estivesse em
  // cima da galeria.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontalGesture || e.deltaX === 0) return;
      e.preventDefault();
      setIsInteracting(true);
      virtualPosition.set(virtualPosition.get() + e.deltaX / WHEEL_SENSITIVITY);
      if (wheelIdleTimer.current) clearTimeout(wheelIdleTimer.current);
      wheelIdleTimer.current = setTimeout(() => {
        setIsInteracting(false);
        settle(Math.round(virtualPosition.get()));
      }, WHEEL_IDLE_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [settle, virtualPosition]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Reveal className="text-center">
        <RevealText
          as="h2"
          className="block text-6xl font-bold tracking-tight text-gradient-cheetara sm:text-7xl"
        >
          Museu Cheetaras
        </RevealText>
        <RevealText
          as="span"
          className="mt-2 block text-sm font-semibold tracking-widest text-cheetara-pink uppercase"
        >
          Relembre as edições
        </RevealText>
      </Reveal>

      {/* overflow só no eixo X (não `overflow-hidden` cru): esse container
          tem quase a mesma altura da foto central, e cortar nos dois eixos
          cortava a sombra da foto por cima/baixo bem rente, ficando com
          aspecto de sombra "cortada". Só o eixo X precisa recortar (é o que
          esconde as fotos vizinhas fora do "quase full-width"). */}
      <div className="relative w-full max-w-[1800px] overflow-x-hidden overflow-y-visible px-6">
        <motion.div
          ref={trackRef}
          drag="x"
          dragElastic={0}
          dragMomentum={false}
          // Sem isso o Framer também move a própria track (transform próprio
          // dele, por cima do x que a gente já controla por slide via
          // virtualPosition) — dava um "duplo deslocamento" que ficava
          // torto/descentralizado depois de arrastar. Trava em 0 pra só
          // aproveitar o gesto (onDrag/onDragEnd continuam disparando
          // normalmente), sem deixar a track em si se mexer.
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => {
            setIsInteracting(true);
            dragStartVP.current = virtualPosition.get();
          }}
          onDrag={(_, info) => {
            virtualPosition.set(dragStartVP.current - info.offset.x / SLIDE_GAP);
          }}
          onDragEnd={(_, info) => {
            const projected =
              virtualPosition.get() - info.velocity.x / SLIDE_GAP / 8;
            settle(Math.round(projected));
            setIsInteracting(false);
          }}
          className="relative h-[40rem] w-full cursor-grab touch-pan-y active:cursor-grabbing"
        >
          {photos.map((photo, i) => (
            <Slide
              key={photo}
              slideIndex={i}
              virtualPosition={virtualPosition}
              skewX={skewX}
              photo={photo}
              total={total}
              reducedMotion={reducedMotion}
              onClick={() => go(i - currentIndex)}
            />
          ))}
        </motion.div>

        <button
          type="button"
          aria-label="Foto anterior"
          onClick={() => go(-1)}
          className="absolute left-8 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-foreground shadow-[0_4px_16px_rgba(96,32,136,0.2)] backdrop-blur-sm transition hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Próxima foto"
          onClick={() => go(1)}
          className="absolute right-8 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-foreground shadow-[0_4px_16px_rgba(96,32,136,0.2)] backdrop-blur-sm transition hover:bg-white"
        >
          ›
        </button>
      </div>

      <div className="flex gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo}
            type="button"
            aria-label={`Ir para foto ${i + 1}`}
            onClick={() => go(i - currentIndex)}
            className={`h-3.5 w-3.5 rounded-full transition-colors ${
              i === currentIndex ? "bg-gradient-cheetara" : "bg-black/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

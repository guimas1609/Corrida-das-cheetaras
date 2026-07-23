"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  useVelocity,
} from "framer-motion";
import RevealText from "./RevealText";

const AUTOPLAY_MS = 4000;
const WHEEL_SENSITIVITY = 300; // px de wheel-delta pra cobrir 1 slide inteiro (deck)
const WHEEL_IDLE_MS = 120; // silêncio do wheel antes de assentar/decidir
const SETTLE_DURATION = 0.72; // segundos — mesma família de duration-700 usada em Reveal/RevealText
const SETTLE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DESKTOP_QUERY = "(min-width: 640px)";
const MOBILE_ADVANCE_THRESHOLD_RATIO = 0.25; // % da largura do card que precisa arrastar pra trocar de foto

// Só desktop usa essas — o deck com profundidade (fotos vizinhas
// escaladas/borradas espiando do lado).
const DESKTOP_SLIDE_GAP = 340; // px entre os centros de dois slides vizinhos
const DESKTOP_SLIDE_WIDTH_CLASS = "w-[22rem]";
const DESKTOP_TRACK_HEIGHT_CLASS = "h-[40rem]";

// `useLayoutEffect` reclama em SSR ("does nothing on the server") — troca
// por `useEffect` nesse ambiente, padrão isomórfico comum.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Sempre começa em `false` (mobile), tanto no SSR quanto no primeiro
// render do client — nunca lê `window.matchMedia` no initializer. Esse
// componente é Client Component mas ainda é renderizado no servidor (não
// tem `dynamic(..., { ssr: false })` nenhum na cadeia até page.tsx); se o
// initializer desse `true` no servidor (onde `window` não existe) e o
// celular calculasse `false` no primeiro render do client, era uma
// incompatibilidade de hidratação. Corrige pro valor real só depois do
// mount, via efeito.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

// Distância circular de `slideIndex` até a posição virtual `vp`, dando a
// volta pelo array (ex: com 6 fotos, a foto 0 fica a +1 de distância da
// foto 5, não a -5) — assim o "deck" nunca precisa resetar/pular.
function circularOffset(slideIndex: number, vp: number, count: number) {
  const raw = slideIndex - vp;
  const wrapped = ((raw % count) + count) % count;
  return wrapped > count / 2 ? wrapped - count : wrapped;
}

// ---------------------------------------------------------------------
// Desktop: deck com profundidade (aprovado como está, não mexer).
// ---------------------------------------------------------------------
function DeckSlide({
  slideIndex,
  virtualPosition,
  skewX,
  photo,
  total,
  onClick,
}: {
  slideIndex: number;
  virtualPosition: ReturnType<typeof useMotionValue<number>>;
  skewX: ReturnType<typeof useTransform<number, number>>;
  photo: string;
  total: number;
  onClick: () => void;
}) {
  const offset = useTransform(virtualPosition, (vp) =>
    circularOffset(slideIndex, vp, total)
  );
  const x = useTransform(offset, (o) => o * DESKTOP_SLIDE_GAP);
  const scale = useTransform(offset, [-1, 0, 1], [0.82, 1, 0.82], { clamp: true });
  const y = useTransform(offset, [-1, 0, 1], [14, 0, 14], { clamp: true });
  const opacity = useTransform(offset, [-1.5, -1, 0, 1, 1.5], [0, 0.45, 1, 0.45, 0], {
    clamp: true,
  });
  const zIndex = useTransform(offset, (o) => Math.round(10 - Math.abs(o) * 5));
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
      className={`absolute top-1/2 left-1/2 aspect-[3/4] -translate-x-1/2 -translate-y-1/2 ${DESKTOP_SLIDE_WIDTH_CLASS}`}
      style={{ x, y, scale, skewX, opacity, zIndex, willChange: "transform, opacity" }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-hidden={!isCenter}
        tabIndex={isCenter ? 0 : -1}
        whileHover={isCenter ? { scale: 1.03 } : undefined}
        style={
          isCenter
            ? undefined
            : {
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 30%, black 70%, transparent 100%)",
              }
        }
        className={`block h-full w-full overflow-hidden rounded-3xl transition-shadow duration-300 ${
          isCenter
            ? "cursor-grab shadow-[0_10px_24px_rgba(96,32,136,0.18)] active:cursor-grabbing"
            : "cursor-pointer"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          draggable={false}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------
// Mobile: 1 foto por vez (mais robusto em touch/WebView real do que o
// deck, depois de várias rodadas de bugs só reproduzíveis em celular).
// ---------------------------------------------------------------------
function MobileSlide({
  photo,
  relativeIndex,
  containerWidth,
  dragX,
  skewX,
}: {
  photo: string;
  relativeIndex: -1 | 0 | 1;
  containerWidth: number;
  dragX: ReturnType<typeof useMotionValue<number>>;
  skewX: ReturnType<typeof useTransform<number, number>>;
}) {
  const x = useTransform(dragX, (d) => d + relativeIndex * containerWidth);

  return (
    <motion.div className="absolute inset-0" style={{ x, skewX, willChange: "transform" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt=""
        draggable={false}
        decoding="async"
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}

export default function MuseumCarousel({
  photosMobile,
  photosDesktop,
}: {
  photosMobile: string[];
  photosDesktop: string[];
}) {
  const isDesktop = useIsDesktop();
  const photos = isDesktop ? photosDesktop : photosMobile;
  const total = photos.length;
  const reducedMotion = useReducedMotion() ?? false;

  // ---- Estado do deck (desktop) ----
  const virtualPosition = useMotionValue(0);
  const [deckIndex, setDeckIndex] = useState(0);
  const [deckInteracting, setDeckInteracting] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const deckWheelIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartVP = useRef(0);

  const positionVelocity = useVelocity(virtualPosition);
  const deckSkewX = useTransform(positionVelocity, (v) =>
    reducedMotion ? 0 : Math.max(-10, Math.min(10, v * 1.4))
  );

  const settle = useCallback(
    (target: number) => {
      const wrapped = ((target % total) + total) % total;
      setDeckIndex(wrapped);
      animate(virtualPosition, target, {
        duration: reducedMotion ? 0 : SETTLE_DURATION,
        ease: SETTLE_EASE,
      });
    },
    [total, virtualPosition, reducedMotion]
  );

  const go = useCallback(
    (delta: number) => {
      setDeckInteracting(false);
      settle(Math.round(virtualPosition.get()) + delta);
    },
    [settle, virtualPosition]
  );

  useEffect(() => {
    if (!isDesktop || deckInteracting) return;
    const id = setInterval(() => {
      settle(Math.round(virtualPosition.get()) + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isDesktop, deckInteracting, deckIndex, settle, virtualPosition]);

  useEffect(() => {
    if (!isDesktop) return;
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontalGesture || e.deltaX === 0) return;
      e.preventDefault();
      setDeckInteracting(true);
      virtualPosition.set(virtualPosition.get() + e.deltaX / WHEEL_SENSITIVITY);
      if (deckWheelIdleTimer.current) clearTimeout(deckWheelIdleTimer.current);
      deckWheelIdleTimer.current = setTimeout(() => {
        setDeckInteracting(false);
        settle(Math.round(virtualPosition.get()));
      }, WHEEL_IDLE_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isDesktop, settle, virtualPosition]);

  // ---- Estado do carrossel mobile (1 foto por vez) ----
  const viewportRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileInteracting, setMobileInteracting] = useState(false);
  const mobileWheelIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragX = useMotionValue(0);

  // `useLayoutEffect` (não `useEffect`) pra medir ANTES da primeira
  // pintura: o CSS (`max-w-xs`) já determinou a largura do card assim que
  // o DOM foi montado, só precisamos ler. Com `useEffect` normal, o
  // primeiro callback do ResizeObserver só chega alguns ms DEPOIS da
  // primeira pintura — nesse intervalo as fotos vizinhas (gated por
  // `containerWidth > 0`) simplesmente não existiam no DOM, e apareciam
  // do nada assim que a medição chegava. Se o usuário arrastasse bem no
  // começo, isso lia como um "piscar" na foto seguinte.
  useIsomorphicLayoutEffect(() => {
    if (isDesktop) return;
    const el = viewportRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop]);

  // Zera o dragX só DEPOIS que o índice novo já foi commitado no DOM —
  // ver comentário completo no mobileAdvance. Roda sempre (não só quando
  // !isDesktop): inofensivo quando o deck está ativo, e assim não precisa
  // de guarda condicional pra respeitar as Rules of Hooks.
  //
  // `.jump()`, não `.set()`: o salto de -containerWidth pra 0 é
  // instantâneo (1 frame), e `.set()` deixa esse salto entrar no cálculo
  // de velocidade do dragVelocity/skewX como se fosse um arraste
  // absurdamente rápido — dava um pico de skew de 1 frame bem no
  // instante da troca, uma tremida/piscada visível. `.jump()` reseta a
  // velocidade rastreada junto (ver MotionValue.jump em motion-dom),
  // então o dragX chega em 0 "limpo", sem esse pico.
  useIsomorphicLayoutEffect(() => {
    dragX.jump(0);
  }, [mobileIndex, dragX]);

  // O carrossel mobile NÃO segue `reducedMotion` (ao contrário do deck):
  // a deformação ao arrastar e o deslize entre fotos são o efeito
  // principal aqui, não um detalhe ambient — quando "reduzir movimento"
  // está ativo no aparelho, `SETTLE_DURATION` viraria 0 (troca instantânea
  // em vez de deslizar) e o skew sumiria, o que lia como bug ("muda
  // rápido", "sem deformar"), não como uma versão mais sóbria da mesma
  // interação.
  const dragVelocity = useVelocity(dragX);
  const mobileSkewX = useTransform(dragVelocity, (v) =>
    Math.max(-10, Math.min(10, v * 0.01))
  );

  // Troca pra vizinha (direction=1 → próxima, -1 → anterior): desliza a
  // faixa inteira até a vizinha ficar centralizada, só então troca o
  // índice — o efeito acima cuida de zerar o dragX depois que o índice
  // novo já commitou (evita o flick de voltar pro centro por 1 frame).
  const mobileAdvance = useCallback(
    (direction: 1 | -1) => {
      setMobileInteracting(false);
      if (containerWidth === 0) {
        setMobileIndex((i) => (i + direction + total) % total);
        return;
      }
      animate(dragX, -direction * containerWidth, {
        duration: SETTLE_DURATION,
        ease: SETTLE_EASE,
      }).then(() => {
        setMobileIndex((i) => (i + direction + total) % total);
      });
    },
    [containerWidth, dragX, total]
  );

  const mobileSnapBack = useCallback(() => {
    animate(dragX, 0, {
      duration: SETTLE_DURATION,
      ease: SETTLE_EASE,
    });
  }, [dragX]);

  const mobileSettleFromOffset = useCallback(
    (offset: number, velocity = 0) => {
      const projected = offset + velocity * 0.15;
      const threshold = containerWidth * MOBILE_ADVANCE_THRESHOLD_RATIO;
      if (projected <= -threshold) mobileAdvance(1);
      else if (projected >= threshold) mobileAdvance(-1);
      else mobileSnapBack();
    },
    [mobileAdvance, mobileSnapBack, containerWidth]
  );

  const mobileGoToIndex = useCallback(
    (target: number) => {
      const wrapped = ((target % total) + total) % total;
      if (wrapped === mobileIndex) return;
      setMobileInteracting(false);
      if (wrapped === (mobileIndex + 1) % total) {
        mobileAdvance(1);
        return;
      }
      if (wrapped === (mobileIndex - 1 + total) % total) {
        mobileAdvance(-1);
        return;
      }
      setMobileIndex(wrapped);
    },
    [mobileAdvance, mobileIndex, total]
  );

  useEffect(() => {
    if (isDesktop || mobileInteracting) return;
    const id = setInterval(() => mobileAdvance(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isDesktop, mobileInteracting, mobileAdvance]);

  useEffect(() => {
    if (isDesktop) return;
    const el = viewportRef.current;
    if (!el || containerWidth === 0) return;

    const onWheel = (e: WheelEvent) => {
      const isHorizontalGesture = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!isHorizontalGesture || e.deltaX === 0) return;
      e.preventDefault();
      setMobileInteracting(true);
      dragX.set(dragX.get() - e.deltaX);
      if (mobileWheelIdleTimer.current) clearTimeout(mobileWheelIdleTimer.current);
      mobileWheelIdleTimer.current = setTimeout(() => {
        setMobileInteracting(false);
        mobileSettleFromOffset(dragX.get());
      }, WHEEL_IDLE_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isDesktop, containerWidth, dragX, mobileSettleFromOffset]);

  const mobilePrevIndex = (mobileIndex - 1 + total) % total;
  const mobileNextIndex = (mobileIndex + 1) % total;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <RevealText
          as="h2"
          className="block text-4xl font-bold tracking-tight text-gradient-cheetara sm:text-6xl md:text-7xl"
        >
          Museu Cheetaras
        </RevealText>
        <RevealText
          as="span"
          className="mt-2 block text-sm font-semibold tracking-widest text-cheetara-pink uppercase"
        >
          Relembre as edições
        </RevealText>
      </div>

      {isDesktop ? (
        <>
          {/* overflow só no eixo X: esse container tem quase a mesma altura
              da foto central, e cortar nos dois eixos cortava a sombra da
              foto por cima/baixo bem rente. Só o eixo X precisa recortar
              (é o que esconde as fotos vizinhas fora do "quase
              full-width"). */}
          <div className="relative w-full max-w-[1800px] overflow-x-hidden overflow-y-visible px-6">
            <motion.div
              ref={trackRef}
              drag="x"
              dragElastic={0}
              dragMomentum={false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => {
                setDeckInteracting(true);
                dragStartVP.current = virtualPosition.get();
              }}
              onDrag={(_, info) => {
                virtualPosition.set(dragStartVP.current - info.offset.x / DESKTOP_SLIDE_GAP);
              }}
              onDragEnd={(_, info) => {
                const projected =
                  virtualPosition.get() - info.velocity.x / DESKTOP_SLIDE_GAP / 8;
                settle(Math.round(projected));
                setDeckInteracting(false);
              }}
              className={`relative w-full cursor-grab touch-pan-y active:cursor-grabbing ${DESKTOP_TRACK_HEIGHT_CLASS}`}
            >
              {photos.map((photo, i) => (
                <DeckSlide
                  key={photo}
                  slideIndex={i}
                  virtualPosition={virtualPosition}
                  skewX={deckSkewX}
                  photo={photo}
                  total={total}
                  onClick={() => go(i - deckIndex)}
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
                onClick={() => go(i - deckIndex)}
                className={`h-3.5 w-3.5 rounded-full transition-colors ${
                  i === deckIndex ? "bg-gradient-cheetara" : "bg-black/15"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full max-w-[1800px] px-6">
            {/* A moldura (cantos arredondados + sombra + clip) fica fixa
                aqui — nunca muda enquanto as fotos deslizam por dentro
                dela. */}
            <motion.div
              ref={viewportRef}
              drag={containerWidth > 0 ? "x" : false}
              dragElastic={0}
              dragMomentum={false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => setMobileInteracting(true)}
              onDrag={(_, info) => dragX.set(info.offset.x)}
              onDragEnd={(_, info) => {
                mobileSettleFromOffset(info.offset.x, info.velocity.x);
                setMobileInteracting(false);
              }}
              className="relative mx-auto aspect-[3/4] w-full max-w-xs cursor-grab overflow-hidden rounded-3xl shadow-[0_10px_24px_rgba(96,32,136,0.18)] touch-pan-y active:cursor-grabbing"
            >
              {containerWidth > 0 && (
                <MobileSlide
                  key={photos[mobilePrevIndex]}
                  photo={photos[mobilePrevIndex]}
                  relativeIndex={-1}
                  containerWidth={containerWidth}
                  dragX={dragX}
                  skewX={mobileSkewX}
                />
              )}
              <MobileSlide
                key={photos[mobileIndex]}
                photo={photos[mobileIndex]}
                relativeIndex={0}
                containerWidth={containerWidth}
                dragX={dragX}
                skewX={mobileSkewX}
              />
              {containerWidth > 0 && (
                <MobileSlide
                  key={photos[mobileNextIndex]}
                  photo={photos[mobileNextIndex]}
                  relativeIndex={1}
                  containerWidth={containerWidth}
                  dragX={dragX}
                  skewX={mobileSkewX}
                />
              )}
            </motion.div>

            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => mobileAdvance(-1)}
              className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-foreground shadow-[0_4px_16px_rgba(96,32,136,0.2)] backdrop-blur-sm transition hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              onClick={() => mobileAdvance(1)}
              className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-foreground shadow-[0_4px_16px_rgba(96,32,136,0.2)] backdrop-blur-sm transition hover:bg-white"
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
                onClick={() => mobileGoToIndex(i)}
                className={`h-3.5 w-3.5 rounded-full transition-colors ${
                  i === mobileIndex ? "bg-gradient-cheetara" : "bg-black/15"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

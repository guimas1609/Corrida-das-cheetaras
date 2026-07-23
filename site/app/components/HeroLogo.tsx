"use client";

import { useEffect, useRef } from "react";

/**
 * Logo do hero: no desktop, reage à posição do cursor na janela inteira —
 * tilt 3D + leve deslocamento, tipo vitrine de produto. Listener próprio
 * (não usa o rastreador compartilhado) de propósito: é o efeito mais
 * cobrado/testado do site, então fica isolado, simples e fácil de
 * depurar — sem depender de nenhum módulo externo.
 */
export default function HeroLogo() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Raio (em px) em que o tilt atinge o máximo — baseado na posição da
    // própria logo, não da janela inteira. Do jeito antigo (clientX /
    // innerWidth), como a logo fica no centro da tela, o cursor perto dela
    // sempre dava x,y ~0 e o tilt sumia exatamente onde deveria ser mais
    // forte.
    const RADIUS = 480;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / RADIUS));
      const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / RADIUS));
      const rotateY = x * 10;
      const rotateX = -y * 10;
      const translateX = x * 8;
      const translateY = y * 8;
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* Clareada radial atrás da logo — a foto de fundo é bem "cheia" ali
          (multidão + treliças), então mesmo com o drop-shadow abaixo a
          logo (traços finos) perde contraste. Isso cria um respiro claro
          só na área dela, com borda bem esfumaçada (sem corte visível),
          sem lavar o resto da foto. `-m-*` expande além do `inset-0` do
          pai pra a borda ter espaço de sumir em transparent antes de
          qualquer aresta. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 -m-10 sm:-m-16"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.3) 45%, transparent 75%)",
        }}
      />

      {/* O float/idle fica só no wrapper — nunca no <img>. CSS animation
          vence inline style pra mesma propriedade (transform), então se a
          animação de flutuar ficasse no <img> ela apagava o tilt do JS
          sempre que o "sm:animate-none" não estivesse valendo (janela
          redimensionada, DevTools aberto encolhendo a viewport, zoom do
          navegador etc.) — o tilt calculava certo mas nunca aparecia. Com a
          animação isolada aqui, o transform do <img> é 100% controlado pelo
          JS, em qualquer largura. */}
      <div className="relative z-10 animate-logo-float sm:animate-hero-logo-idle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={ref}
          src="/api/drive-image?id=11y8Ot9i6RQqv7q8OdAUxeptlTcNrA7Hi&w=800"
          alt="Corrida das Cheetaras"
          // Sombra branca em mobile e desktop — segue o contorno exato do
          // desenho (drop-shadow usa o alfa do PNG, não uma caixa), sem
          // precisar duplicar a imagem: um jeito mais simples de destacar
          // a logo da foto de fundo, que tem pouco contraste ali (tanto no
          // card do hero desktop quanto na foto full-bleed do mobile).
          // Mais forte no desktop porque o card ali é mais escuro/denso.
          className="h-56 w-auto cursor-pointer transition-transform duration-500 ease-out will-change-transform drop-shadow-[0_0_16px_rgba(255,255,255,0.9)] sm:h-80 sm:drop-shadow-[0_0_24px_rgba(255,255,255,0.95)]"
        />
      </div>
    </div>
  );
}

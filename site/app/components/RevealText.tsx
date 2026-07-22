"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Igual ao `Reveal`, mas letra por letra: divide o texto em palavras (pra
 * não quebrar uma palavra no meio) e cada palavra em caracteres, cada um
 * com seu próprio delay de transição. Ao contrário do `Reveal` (que anima
 * uma vez só e desconecta o observer), aqui a animação repete toda vez que
 * o texto reentra na viewport — por isso não reaproveita o hook do
 * `Reveal`: o comportamento de disparo é fundamentalmente diferente.
 */
export default function RevealText({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 55,
}: {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // threshold 0 + rootMargin negativo só na borda de baixo: dispara assim
    // que a primeira letra entra na tela, sem esperar o bloco inteiro ficar
    // 5%+ visível (era a causa do "demora pra começar" — títulos grandes
    // levavam um bom scroll até bater o threshold antigo).
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = children.split(" ");
  let charIndex = 0;

  return (
    <Tag ref={ref} aria-label={children} className={className}>
      {/*
        Os spans de palavra/caractere ficam `inline` (não `inline-block`):
        `inline-block` vira uma caixa "atômica" pintada à parte, o que quebra
        o truque de `background-clip: text` + `color: transparent` dos
        títulos com gradiente (text-gradient-cheetara) — o degradê do
        ancestral parava de "enxergar" as letras e o título sumia inteiro,
        mesmo com opacity:1. `inline` mantém as letras no mesmo fluxo de
        texto do elemento pai, então o clip do gradiente continua
        funcionando. Animação só com `opacity` (sem `filter: blur`): blur
        animado em dezenas de spans inline ao mesmo tempo, sobre um texto
        com background-clip:text, forçava recomposição pesada a cada frame e
        aparecia como um tremor/flicker nas letras — opacity sozinho é
        praticamente grátis pro navegador.
      */}
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={wi}>
            {[...word].map((char) => {
              const thisDelay = delay + charIndex * stagger;
              charIndex += 1;
              return (
                <span
                  key={charIndex}
                  className={`reveal-text-char transition-opacity duration-500 ease-out ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${thisDelay}ms` }}
                >
                  {char}
                </span>
              );
            })}
            {wi < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}

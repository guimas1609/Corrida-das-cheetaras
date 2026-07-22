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
  stagger = 25,
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
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
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
        funcionando. Como transform não tem efeito em elementos inline, a
        animação usa opacity + blur (filter funciona normalmente em inline)
        em vez do translate-y que tínhamos antes.
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
                  className={`reveal-text-char transition-[opacity,filter] duration-[850ms] ease-in-out ${
                    visible ? "opacity-100 blur-none" : "opacity-0 blur-[3px]"
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

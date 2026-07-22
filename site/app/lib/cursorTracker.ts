"use client";

// Rastreador de cursor compartilhado: um único listener de `pointermove`
// pra tudo (logo, linhas laterais, glow), em vez de cada componente
// registrar o seu. As atualizações são agrupadas por frame (rAF) — não
// importa quantos eventos de pointermove disparem entre um frame e outro
// (mouses/trackpads de alta frequência disparam muito mais rápido que
// 60fps), os assinantes só rodam uma vez por frame. Isso é o que evita o
// "engasgo" quando várias coisas na página reagem ao mouse ao mesmo tempo.

type Listener = (x: number, y: number) => void;

const listeners = new Set<Listener>();
let lastX = 0;
let lastY = 0;
let scheduled = false;
let started = false;

function flush() {
  scheduled = false;
  listeners.forEach((fn) => fn(lastX, lastY));
}

function onPointerMove(e: PointerEvent) {
  lastX = e.clientX;
  lastY = e.clientY;
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(flush);
  }
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  window.addEventListener("pointermove", onPointerMove, { passive: true });
}

export function subscribeCursor(fn: Listener): () => void {
  start();
  listeners.add(fn);
  return () => listeners.delete(fn);
}

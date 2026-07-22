"use client";

import { useEffect, useState } from "react";

/**
 * Botão de inscrição que acompanha o usuário na rolagem — some enquanto o
 * hero (que já tem seu próprio CTA) está visível, aparece a partir daí.
 */
export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#museu"
      aria-label="Quero me inscrever"
      className={`fixed bottom-6 right-6 z-40 overflow-hidden border border-white/40 bg-gradient-to-br from-cheetara-pink/90 to-cheetara-purple/90 px-6 py-3 font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_24px_rgba(96,32,136,0.4)] backdrop-blur-md transition-all duration-300 [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)] hover:from-cheetara-pink hover:to-cheetara-purple sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full animate-button-shine bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.65)_50%,transparent_65%)]"
      />
      <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
        Quero me inscrever
      </span>
    </a>
  );
}

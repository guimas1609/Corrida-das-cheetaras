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
      className={`fixed bottom-6 right-6 z-40 overflow-hidden rounded-none border border-white/40 bg-gradient-to-br from-cheetara-pink/20 to-cheetara-purple/20 px-6 py-3 font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_24px_rgba(96,32,136,0.2)] backdrop-blur-xl transition-all duration-300 hover:from-cheetara-pink/35 hover:to-cheetara-purple/35 sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent"
      />
      <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
        Quero me inscrever
      </span>
    </a>
  );
}

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
      className={`fixed bottom-6 right-6 z-40 rounded-full bg-gradient-cheetara px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      Quero me inscrever
    </a>
  );
}

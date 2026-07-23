"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#museu", label: "Museu Cheetaras" },
  { href: "#kit", label: "Kit oficial" },
  { href: "#premiacao", label: "Premiação" },
  { href: "#percurso", label: "Percurso" },
];

/** Botão hambúrguer + painel dropdown — mesmo componente pra mobile e desktop. */
export default function SiteMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col gap-1.5 p-1"
      >
        <span
          className={`h-0.5 w-7 rounded-full bg-gradient-cheetara transition-transform duration-300 ${
            open ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-7 rounded-full bg-gradient-cheetara transition-opacity duration-300 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-7 rounded-full bg-gradient-cheetara transition-transform duration-300 ${
            open ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      <div
        className={`absolute right-0 top-full z-30 mt-3 w-56 origin-top-right rounded-2xl border border-black/5 bg-white/95 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <nav className="flex flex-col">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-black/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#museu"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-xl bg-gradient-cheetara px-3 py-2.5 text-center text-sm font-medium text-white"
          >
            Quero me inscrever
          </a>
        </nav>
      </div>
    </div>
  );
}

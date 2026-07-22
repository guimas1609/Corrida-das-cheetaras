/**
 * Caixa de vidro (glassmorphism): alta transparência (fundo bem clarinho +
 * frost no que está atrás), borda fina e levemente iluminada, brilho sutil
 * nos cantos, e sombra difusa por baixo pra dar sensação de "flutuar"
 * sobre o fundo.
 */
export default function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/[0.12] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] backdrop-blur-xl ${className ?? ""}`}
    >
      {/* Brilho sutil no canto superior esquerdo, como reflexo de vidro */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -left-8 h-28 w-28 rounded-full bg-white/50 blur-2xl"
      />
      {/* Reflexo diagonal bem suave cruzando o vidro */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
      />
      {/* Realce fino na borda, simulando a espessura do vidro */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_10px_rgba(255,255,255,0.15)]"
      />
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

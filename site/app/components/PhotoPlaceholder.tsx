/**
 * Espaço reservado pra uma foto real (troféu, medalha, museu etc.) — o
 * conteúdo desta seção é genérico até o organizador enviar as fotos de
 * verdade. Trocar por <Image src="..." /> quando a foto chegar.
 */
export default function PhotoPlaceholder({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-white/70 to-white/30 shadow-[0_8px_30px_rgba(96,32,136,0.12)] backdrop-blur-sm ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 bg-gradient-cheetara"
        style={{ maskImage: "radial-gradient(closest-side, black, transparent)" }}
      />
      <span className="relative text-5xl">{icon}</span>
      <span className="relative text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Foto em breve
      </span>
    </div>
  );
}

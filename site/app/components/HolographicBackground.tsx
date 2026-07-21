/**
 * Fundo claro/holográfico fixo, atrás de toda a página (hero e demais
 * seções) — ver a classe `.holographic-bg` em globals.css.
 */
export default function HolographicBackground() {
  return (
    <>
      <div aria-hidden className="holographic-bg fixed inset-0 -z-10" />
      {/* Teste de imagem de fundo só no desktop, bem sutil, por cima do
          holográfico — mobile fica intacto (sem essa camada). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src="/api/drive-image?id=144Ry6dzj9ZD2RG3I9I87cXfHTRwFzQva&w=1920"
        alt=""
        className="fixed inset-0 -z-10 hidden h-full w-full object-cover opacity-10 sm:block"
      />
    </>
  );
}

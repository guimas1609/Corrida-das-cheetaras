/**
 * Fundo claro/holográfico fixo, atrás de toda a página (hero e demais
 * seções) — ver a classe `.holographic-bg` em globals.css.
 */
export default function HolographicBackground() {
  return (
    <div aria-hidden className="holographic-bg fixed inset-0 -z-10" />
  );
}

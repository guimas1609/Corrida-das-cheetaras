/**
 * Fundo claro/holográfico fixo, atrás de toda a página (hero e demais
 * seções) — ver a classe `.holographic-bg` em globals.css. A foto do pódio
 * usada no hero desktop fica só dentro de ScrollJaguarSection.tsx (não
 * aqui), pra sumir assim que rola pra próxima seção.
 */
export default function HolographicBackground() {
  return (
    <div aria-hidden className="holographic-bg fixed inset-0 -z-10" />
  );
}

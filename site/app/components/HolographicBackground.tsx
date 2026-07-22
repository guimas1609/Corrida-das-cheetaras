/**
 * Fundo fixo, atrás de toda a página (hero e demais seções). Mobile
 * continua com o holográfico em CSS (`.holographic-bg`, globals.css);
 * desktop usa uma foto real do organizador (via proxy do Drive) em vez
 * disso — troca completa, não uma camada por cima.
 */
export default function HolographicBackground() {
  return (
    <>
      <div aria-hidden className="holographic-bg fixed inset-0 -z-10 sm:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        src="/api/drive-image?id=1FFcNCU6N1uHDt2N_rguDXh7cZLbTQf2G&w=1920"
        alt=""
        className="fixed inset-0 -z-10 hidden h-full w-full object-cover sm:block"
      />
    </>
  );
}

/**
 * Ondas finas por cima do fundo holográfico, dando profundidade sutil — ver
 * `.wave-lines-bg` em globals.css pro padrão em si. `absolute` (não
 * `fixed`, ao contrário de HolographicBackground.tsx), então rola junto
 * com a página: descer a tela revela trechos novos do padrão em vez de
 * ficar colado na mesma posição da viewport. Depende de `position:
 * relative` no <body> (globals.css) pra cobrir a altura real do documento.
 */
export default function WaveLines() {
  return (
    <div aria-hidden className="wave-lines-bg pointer-events-none absolute inset-0 -z-10" />
  );
}

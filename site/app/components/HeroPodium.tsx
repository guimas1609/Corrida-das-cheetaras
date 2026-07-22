/**
 * Pódio ilustrado (CSS, sem modelo 3D) só pro hero desktop — a cabeça 3D
 * fica de pé sobre o bloco do 1º lugar (centro, mais alto). Ordem clássica
 * de pódio: 2º à esquerda, 1º ao centro, 3º à direita.
 */
const PLACES = [
  { place: "2", heightClass: "h-24", opacityClass: "opacity-70" },
  { place: "1", heightClass: "h-32", opacityClass: "" },
  { place: "3", heightClass: "h-20", opacityClass: "opacity-60" },
] as const;

export default function HeroPodium() {
  return (
    <div className="relative z-10 hidden w-full max-w-sm items-end justify-center gap-3 sm:flex">
      {PLACES.map(({ place, heightClass, opacityClass }) => (
        <div
          key={place}
          className={`flex ${heightClass} w-24 flex-col items-center rounded-t-2xl bg-gradient-cheetara pt-3 shadow-[0_8px_30px_rgba(96,32,136,0.18)] ${opacityClass}`}
        >
          <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            {place}
          </span>
        </div>
      ))}
    </div>
  );
}

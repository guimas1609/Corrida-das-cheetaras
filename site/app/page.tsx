import ScrollJaguarSection from "./components/ScrollJaguarSection";
import MuseumSection from "./components/MuseumSection";
import KitSection from "./components/KitSection";
import PrizesSection from "./components/PrizesSection";
import RouteSection from "./components/RouteSection";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <ScrollJaguarSection />

      <div className="relative z-10 h-2 w-full bg-gradient-cheetara" />

      {/* Imagem de fundo (teste) só aparece a partir daqui — não cobre o
          hero com o 3D. Não fixa: rola junto com o conteúdo destas seções. */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          aria-hidden
          src="/api/drive-image?id=144Ry6dzj9ZD2RG3I9I87cXfHTRwFzQva&w=1920"
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full object-cover opacity-10 sm:block"
        />
        <MuseumSection />
        <KitSection />
        <PrizesSection />
        <RouteSection />
      </div>

      <footer className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="h-[3px] w-24 rounded-full bg-gradient-cheetara" />
        <p className="max-w-md text-base text-muted-foreground">
          Site em construção — em breve, mais novidades sobre a Corrida das
          Cheetaras.
        </p>
      </footer>
    </div>
  );
}

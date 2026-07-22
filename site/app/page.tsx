import ScrollJaguarSection from "./components/ScrollJaguarSection";
import MuseumSection from "./components/MuseumSection";
import KitSection from "./components/KitSection";
import PrizesSection from "./components/PrizesSection";
import RouteSection from "./components/RouteSection";
import FloatingCTA from "./components/FloatingCTA";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <FloatingCTA />
      <ScrollJaguarSection />

      <div className="relative z-10 h-2 w-full bg-gradient-cheetara" />

      <MuseumSection />
      <div aria-hidden className="mx-auto h-px w-full max-w-xs bg-gradient-cheetara opacity-30" />

      <KitSection />
      <div aria-hidden className="mx-auto h-px w-full max-w-xs bg-gradient-cheetara opacity-30" />

      <PrizesSection />
      <div aria-hidden className="mx-auto h-px w-full max-w-xs bg-gradient-cheetara opacity-30" />

      <RouteSection />

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

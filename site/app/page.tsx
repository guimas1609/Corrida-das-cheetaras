import ScrollJaguarSection from "./components/ScrollJaguarSection";
import MuseumSection from "./components/MuseumSection";
import KitSection from "./components/KitSection";
import PrizesSection from "./components/PrizesSection";
import RouteSection from "./components/RouteSection";
import FloatingCTA from "./components/FloatingCTA";
import EnrollLedBar from "./components/EnrollLedBar";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <FloatingCTA />
      <EnrollLedBar />
      <ScrollJaguarSection />

      <div className="relative z-10 h-2 w-full bg-gradient-cheetara" />

      <MuseumSection />
      <div aria-hidden className="mx-auto h-px w-full max-w-xs bg-gradient-cheetara opacity-30" />

      <KitSection />
      <div aria-hidden className="mx-auto h-px w-full max-w-xs bg-gradient-cheetara opacity-30" />

      <PrizesSection />
      {/* Só desktop: no mobile RouteSection já tem seu próprio fade de
          entrada (fundo cheio com ruído), essa linha fica sobrando ali. */}
      <div
        aria-hidden
        className="mx-auto hidden h-px w-full max-w-xs bg-gradient-cheetara opacity-30 sm:block"
      />

      <RouteSection />

      <footer className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="h-[3px] w-24 rounded-full bg-gradient-cheetara" />
        <a
          href="https://wa.me/5548984652552"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm transition hover:border-cheetara-pink/40 hover:text-foreground"
        >
          Criado por <span className="text-gradient-cheetara font-medium">Paulo Fonz Guimarães</span>
        </a>
      </footer>
    </div>
  );
}

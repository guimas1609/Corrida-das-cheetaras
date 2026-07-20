import ScrollJaguarSection from "./components/ScrollJaguarSection";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col bg-background">
      <ScrollJaguarSection />

      <section className="flex flex-col items-center gap-3 px-6 py-20 text-center">
        <span className="h-[3px] w-24 rounded-full bg-gradient-cheetara" />
        <p className="max-w-md text-sm text-muted-foreground">
          Site em construção — em breve, mais informações sobre data,
          percurso e inscrições.
        </p>
      </section>

      <footer className="relative z-10 h-2 w-full bg-gradient-cheetara" />
    </div>
  );
}

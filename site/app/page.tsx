import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
      {/* Detalhes decorativos no degradê da logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full opacity-20 blur-3xl bg-gradient-cheetara"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full opacity-15 blur-3xl bg-gradient-cheetara"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <Image
          src="/logo/cheetaras-mark.png"
          alt="Corrida das Cheetaras"
          width={44}
          height={44}
          priority
        />
        <span className="h-[3px] w-24 rounded-full bg-gradient-cheetara sm:w-32" />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <Image
          src="/logo/cheetaras-logo-full.png"
          alt="Corrida das Cheetaras de Bacabal"
          width={720}
          height={260}
          priority
          className="h-auto w-full max-w-md sm:max-w-xl"
        />

        <p className="max-w-xl text-lg font-medium text-foreground sm:text-xl">
          A maior corrida do Maranhão
        </p>
        <p className="text-sm tracking-wide text-muted-foreground uppercase">
          Bacabal · Maranhão
        </p>

        <p className="max-w-md text-sm text-muted-foreground">
          Site em construção — em breve, mais informações sobre data,
          percurso e inscrições.
        </p>
      </main>

      <footer className="relative z-10 h-2 w-full bg-gradient-cheetara" />
    </div>
  );
}

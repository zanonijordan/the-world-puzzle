import HeroMatrix from "@/components/HeroMatrix";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-dark)] text-white">
      <HeroMatrix />
      <div className="cyber-grid absolute inset-0 z-[1] opacity-30" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-black/45" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 md:px-12">
        <div className="float-slow inline-flex w-fit items-center gap-2 rounded-full border border-[var(--neon-green)]/50 bg-black/60 px-4 py-1 text-xs tracking-[0.2em] text-[var(--neon-green)]">
          <span className="h-2 w-2 rounded-full bg-[var(--neon-green)] shadow-[0_0_12px_2px_rgba(0,255,65,0.8)]" />
          SIGNAL ONLINE
        </div>

        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-[0.08em] text-white md:text-7xl">
          THE WORLD
          <span className="block text-[var(--neon-green)] drop-shadow-[0_0_18px_rgba(0,255,65,.75)]">
            PUZZLE
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-100/90 md:text-xl">
          Um portal para <strong>histórias ocultas</strong>, matérias jornalísticas,
          análise de filmes e reflexões filosóficas — conectando passado, presente
          e futuros possíveis.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="/articles" className="cyber-btn">
            Explorar Artigos
          </a>
          <a
            href="/login"
            className="rounded-md border-2 border-[var(--neon-pink)] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--neon-pink)] shadow-[0_0_12px_rgba(255,0,255,.45)] transition hover:bg-[var(--neon-pink)] hover:text-black hover:shadow-[0_0_20px_rgba(255,0,255,.85)]"
          >
            Área de Membros
          </a>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            "História Oculta",
            "Investigação Jornalística",
            "Cinema & Filosofia",
          ].map((item) => (
            <article
              key={item}
              className="scanline rounded-xl border border-[var(--neon-green)]/30 bg-black/60 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[var(--neon-green)]/70"
            >
              <h2 className="text-lg font-semibold text-[var(--neon-green)]">{item}</h2>
              <p className="mt-2 text-sm text-green-100/80">
                Conteúdo autoral com profundidade analítica, estética futurista e narrativa crítica.
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

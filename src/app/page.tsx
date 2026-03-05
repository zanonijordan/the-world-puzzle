export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06030f] text-[#e6f7ff]">
      <div className="cyber-grid absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-[100px]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 md:px-12">
        <div className="float-slow inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1 text-xs tracking-[0.2em] text-cyan-200">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_2px_rgba(103,232,249,.8)]" />
          SIGNAL ONLINE
        </div>

        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-[0.08em] text-white md:text-7xl">
          THE WORLD
          <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(217,70,239,.55)]">
            PUZZLE
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cyan-100/90 md:text-xl">
          Um portal para <strong>histórias ocultas</strong>, matérias jornalísticas,
          análise de filmes e reflexões filosóficas — conectando passado, presente
          e futuros possíveis.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/articles"
            className="neon-btn rounded-md border border-cyan-300/60 bg-cyan-300/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100"
          >
            Explorar Artigos
          </a>
          <a
            href="/login"
            className="rounded-md border border-fuchsia-400/50 bg-fuchsia-400/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-100 transition hover:bg-fuchsia-400/20"
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
              className="scanline rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-300/40"
            >
              <h2 className="text-lg font-semibold text-white">{item}</h2>
              <p className="mt-2 text-sm text-cyan-100/80">
                Conteúdo autoral com profundidade analítica, estética futurista e narrativa crítica.
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

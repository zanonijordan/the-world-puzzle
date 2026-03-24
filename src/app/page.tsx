import Link from "next/link";
import HeroMatrix from "@/components/HeroMatrix";

const categories = [
  {
    title: "História Oculta",
    description: "Análise profunda sobre eventos que a história oficial decidiu omitir.",
  },
  {
    title: "Investigação",
    description: "Jornalismo de dados focado em desvendar camadas complexas da realidade.",
  },
  {
    title: "Cinema & Filosofia",
    description: "Onde a sétima arte se encontra com os grandes dilemas da existência humana.",
  },
];

export default function Home() {
  return (
    <div className="matrix-root relative min-h-screen overflow-hidden bg-[var(--bg-dark)] text-white">
      <HeroMatrix />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/45" />

      <main className="container relative z-10">
        <header className="glitch-wrapper">
          <h1>
            The World <span>Puzzle</span>
          </h1>
        </header>

        <div className="description-box">
          Um portal para <strong>histórias ocultas</strong>, matérias jornalísticas, análise de
          filmes e reflexões filosóficas — conectando passado, presente e futuros possíveis.
        </div>

        <div className="btn-group">
          <Link href="/articles" className="btn btn-green">
            Explorar Artigos
          </Link>
          <Link href="/login" className="btn btn-pink">
            Área de Membros
          </Link>
        </div>

        <section className="categories-grid">
          {categories.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

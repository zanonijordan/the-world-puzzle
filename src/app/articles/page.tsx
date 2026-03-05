import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

function formatDate(date: Date | null) {
  if (!date) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(date);
}

export default async function ArticlesPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-6 py-16 text-white md:px-10">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--neon-green)]">
          Arquivo Público
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Artigos</h1>
        <p className="mt-3 max-w-3xl text-green-100/80">
          Investigações, histórias ocultas, análises de filmes e ensaios filosóficos
          publicados no THE WORLD PUZZLE.
        </p>
      </header>

      {posts.length === 0 ? (
        <section className="rounded-xl border border-[var(--neon-green)]/30 bg-black/50 p-8">
          <h2 className="text-xl font-semibold text-[var(--neon-green)]">
            Nenhum artigo publicado ainda.
          </h2>
          <p className="mt-2 text-green-100/80">
            Em breve novos conteúdos serão disponibilizados.
          </p>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[var(--neon-green)]/70"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--neon-green)]/80">
                {formatDate(post.publishedAt ?? post.createdAt)}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">{post.title}</h2>

              {post.excerpt ? (
                <p className="mt-3 line-clamp-4 text-green-100/85">{post.excerpt}</p>
              ) : (
                <p className="mt-3 line-clamp-4 text-green-100/70">
                  Clique para ler a análise completa.
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded border border-[var(--neon-pink)]/40 px-2 py-1 text-xs text-[var(--neon-pink)]"
                  >
                    {category.name}
                  </span>
                ))}
                {post.tags.slice(0, 3).map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="rounded border border-[var(--neon-green)]/40 px-2 py-1 text-xs text-[var(--neon-green)]"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <Link href={`/articles/${post.slug}`} className="cyber-btn inline-block">
                  Ler artigo
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

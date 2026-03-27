import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/session";

function formatDate(date: Date | null) {
  if (!date) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(date);
}

export default async function MemberSavedPostsPage() {
  const session = await requireMember();

  const posts = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      slug: string;
      excerpt: string | null;
      createdAt: Date;
      publishedAt: Date | null;
    }>
  >`
    SELECT p."id", p."title", p."slug", p."excerpt", p."createdAt", p."publishedAt"
    FROM "PostLike" pl
    INNER JOIN "Post" p ON p."id" = pl."postId"
    WHERE pl."userId" = ${session.user.id}
      AND p."status" = 'PUBLISHED'
    ORDER BY pl."createdAt" DESC
  `;

  return (
    <main className="relative min-h-screen bg-white pt-24 text-zinc-900">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10 md:py-16">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">Área do membro</p>
          <h1 className="mt-2 text-4xl font-black text-zinc-900">Meus salvos</h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Aqui ficam os posts que você marcou para ler depois.
          </p>
        </header>

        {posts.length === 0 ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">Você ainda não salvou nenhum post.</h2>
            <p className="mt-2 text-zinc-600">Explore os artigos e clique em “Salvar post”.</p>
            <div className="mt-6">
              <Link href="/articles" className="cyber-btn inline-block">
                Ir para artigos
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:shadow-md"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-zinc-900">{post.title}</h2>

                {post.excerpt ? (
                  <p className="mt-3 line-clamp-4 text-zinc-700">{post.excerpt}</p>
                ) : (
                  <p className="mt-3 line-clamp-4 text-zinc-600">Clique para ler a análise completa.</p>
                )}

                <div className="mt-6">
                  <Link href={`/articles/${post.slug}`} className="cyber-btn inline-block">
                    Ler artigo
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

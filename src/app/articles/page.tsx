import Image from "next/image";
import Link from "next/link";

import { SavePostButton } from "./_components/save-post-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPublishedPosts } from "@/lib/posts";

type PostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ tag: { id: string; name: string } }>;
};

function formatDate(date: Date | null) {
  if (!date) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(date);
}

export default async function ArticlesPage() {
  const [posts, session] = await Promise.all([getPublishedPosts(), auth()]);

  const isMember = !!session?.user && (session.user.role ?? "").toUpperCase() === "MEMBER";

  const savedIds = isMember
    ? new Set(
        (
          await prisma.$queryRaw<Array<{ postId: string }>>`
            SELECT "postId"
            FROM "PostLike"
            WHERE "userId" = ${session!.user.id}
          `
        ).map((item: { postId: string }) => item.postId),
      )
    : new Set<string>();

  return (
    <main className="relative min-h-screen bg-white pt-24 text-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <header className="articles-hero mb-10">
          <p className="articles-hero__label">Arquivo Público</p>
          <h1 className="articles-hero__title">Artigos</h1>
          <p className="articles-hero__description">
            Investigações, histórias ocultas, análises de filmes e ensaios filosóficos
            publicados no THE WORLD PUZZLE.
          </p>
        </header>

        {posts.length === 0 ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">Nenhum artigo publicado ainda.</h2>
            <p className="mt-2 text-zinc-600">Em breve novos conteúdos serão disponibilizados.</p>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {(posts as PostListItem[]).map((post: PostListItem) => (
              <article
                key={post.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:shadow-md"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </p>

                {post.coverImage ? (
                  <div className="mb-4 overflow-hidden rounded-xl border border-zinc-200">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={1200}
                      height={675}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ) : null}

                <h2 className="mt-2 text-2xl font-bold text-zinc-900">{post.title}</h2>

                {post.excerpt ? (
                  <p className="mt-3 line-clamp-4 text-zinc-700">{post.excerpt}</p>
                ) : (
                  <p className="mt-3 line-clamp-4 text-zinc-600">
                    Clique para ler a análise completa.
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {post.categories.map((category: { id: string; name: string }) => (
                    <span
                      key={category.id}
                      className="rounded border border-fuchsia-300 bg-fuchsia-50 px-2 py-1 text-xs text-fuchsia-700"
                    >
                      {category.name}
                    </span>
                  ))}
                  {post.tags.slice(0, 3).map(({ tag }: { tag: { id: string; name: string } }) => (
                    <span
                      key={tag.id}
                      className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link href={`/articles/${post.slug}`} className="cyber-btn inline-block">
                    Ler artigo
                  </Link>
                  {isMember ? <SavePostButton postId={post.id} initialSaved={savedIds.has(post.id)} /> : null}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function AdminPostsPage() {
  await requireAdmin();

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      categories: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-6 py-16 text-white md:px-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--neon-green)]">
            Admin Console
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Posts</h1>
        </div>
        <Link href="/admin" className="cyber-btn">
          Voltar
        </Link>
      </header>

      <section className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Criar post (API)</h2>
        <p className="mt-2 text-sm text-green-100/80">
          Endpoint: <code>POST /api/admin/posts</code> com payload contendo{" "}
          <code>title</code>, <code>content</code>, opcionalmente <code>slug</code>,{" "}
          <code>excerpt</code>, <code>status</code>, <code>categoryIds</code> e{" "}
          <code>tagIds</code>.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Posts cadastrados</h2>
        {posts.length === 0 ? (
          <p className="mt-3 text-sm text-green-100/80">Nenhum post cadastrado.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="rounded border border-[var(--neon-green)]/25 bg-black/40 p-4">
                <p className="text-lg font-semibold text-white">{post.title}</p>
                <p className="text-sm text-green-100/80">slug: {post.slug}</p>
                <p className="text-sm text-green-100/80">status: {post.status}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category.id}
                      className="rounded border border-[var(--neon-pink)]/40 px-2 py-1 text-xs text-[var(--neon-pink)]"
                    >
                      {category.name}
                    </span>
                  ))}
                  {post.tags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="rounded border border-[var(--neon-green)]/40 px-2 py-1 text-xs text-[var(--neon-green)]"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-green-100/60">id: {post.id}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

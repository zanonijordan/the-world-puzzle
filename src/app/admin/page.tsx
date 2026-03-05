import Link from "next/link";

import { requireAdmin } from "@/lib/session";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-5xl px-6 py-16 text-white md:px-10">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--neon-green)]">
          Admin Console
        </p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-green-100/80">
          Gerencie conteúdos do THE WORLD PUZZLE: posts, categorias e tags.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/posts"
          className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[var(--neon-green)]/70"
        >
          <h2 className="text-xl font-bold text-white">Posts</h2>
          <p className="mt-2 text-sm text-green-100/80">Criar, editar e remover posts.</p>
        </Link>

        <Link
          href="/admin/categories"
          className="rounded-xl border border-[var(--neon-pink)]/30 bg-black/55 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[var(--neon-pink)]/70"
        >
          <h2 className="text-xl font-bold text-white">Categorias</h2>
          <p className="mt-2 text-sm text-green-100/80">
            Organize conteúdos por seções temáticas.
          </p>
        </Link>

        <Link
          href="/admin/tags"
          className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[var(--neon-green)]/70"
        >
          <h2 className="text-xl font-bold text-white">Tags</h2>
          <p className="mt-2 text-sm text-green-100/80">
            Adicione metadados para navegação avançada.
          </p>
        </Link>
      </section>
    </main>
  );
}

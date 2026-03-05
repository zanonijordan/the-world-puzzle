import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export default async function AdminTagsPage() {
  await requireAdmin();

  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-5xl px-6 py-16 text-white md:px-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--neon-green)]">
            Admin Console
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Tags</h1>
        </div>
        <Link href="/admin" className="cyber-btn">
          Voltar
        </Link>
      </header>

      <section className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Criar tag (API)</h2>
        <p className="mt-2 text-sm text-green-100/80">
          Endpoint: <code>POST /api/admin/tags</code> com{" "}
          <code>{`{ "name": "Distopia", "slug": "distopia" }`}</code>
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Tags cadastradas</h2>
        {tags.length === 0 ? (
          <p className="mt-3 text-sm text-green-100/80">Nenhuma tag cadastrada.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="rounded border border-[var(--neon-green)]/25 bg-black/40 p-3 text-sm"
              >
                <p className="font-semibold text-white">{tag.name}</p>
                <p className="text-green-100/80">slug: {tag.slug}</p>
                <p className="text-green-100/60">id: {tag.id}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

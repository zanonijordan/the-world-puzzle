import Link from "next/link";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

async function createCategoryAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();

  if (!name) return;

  const slug =
    slugInput ||
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  try {
    await prisma.category.create({
      data: { name, slug },
    });
  } catch {
    return;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts");
}

async function deleteCategoryAction(formData: FormData) {
  "use server";

  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    await prisma.category.delete({
      where: { id },
    });
  } catch {
    return;
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts");
}

export default async function AdminCategoriesPage() {
  await requireAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-5xl px-6 py-16 text-white md:px-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--neon-green)]">
            Admin Console
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Categorias</h1>
        </div>
        <Link href="/admin" className="cyber-btn">
          Voltar
        </Link>
      </header>

      <section className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Criar categoria</h2>
        <form action={createCategoryAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            name="name"
            placeholder="Nome da categoria"
            className="rounded border border-white/20 bg-black/40 p-3"
            required
          />
          <input
            name="slug"
            placeholder="Slug (opcional)"
            className="rounded border border-white/20 bg-black/40 p-3"
          />
          <button type="submit" className="cyber-btn h-fit self-end">
            Criar categoria
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Categorias cadastradas</h2>
        {categories.length === 0 ? (
          <p className="mt-3 text-sm text-green-100/80">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {categories.map((category: { id: string; name: string; slug: string }) => (
              <li
                key={category.id}
                className="rounded border border-[var(--neon-green)]/25 bg-black/40 p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{category.name}</p>
                    <p className="text-green-100/80">slug: {category.slug}</p>
                    <p className="text-green-100/60">id: {category.id}</p>
                  </div>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      className="rounded border border-red-400/40 bg-red-500/10 px-3 py-1 text-xs text-red-200 transition hover:bg-red-500/20"
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

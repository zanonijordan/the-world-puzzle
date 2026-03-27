import Link from "next/link";
import { revalidatePath } from "next/cache";
import { PostStatus } from "@prisma/client";

import { PostsManager } from "./_components/posts-manager";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

async function createPostAction(formData: FormData) {
  "use server";

  const session = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const videoUrl = String(formData.get("videoUrl") ?? "").trim() || null;
  const statusRaw = String(formData.get("status") ?? "DRAFT").trim();

  const categoryIds = formData
    .getAll("categoryIds")
    .map((value) => String(value))
    .filter(Boolean);

  const tagIds = formData
    .getAll("tagIds")
    .map((value) => String(value))
    .filter(Boolean);

  if (!title || !content) return;

  const status = statusRaw === PostStatus.PUBLISHED ? PostStatus.PUBLISHED : PostStatus.DRAFT;

  await prisma.post.create({
    data: {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      excerpt,
      content,
      coverImage,
      videoUrl,
      status,
      authorId: session.user.id,
      publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
      tags: {
        create: tagIds.map((tagId) => ({
          tag: {
            connect: { id: tagId },
          },
        })),
      },
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/articles");
}

export default async function AdminPostsPage() {
  await requireAdmin();

  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categories: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

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
        <h2 className="text-lg font-bold">Publicar novo post</h2>
        <form action={createPostAction} className="mt-4 grid gap-4">
          <input name="title" placeholder="Título" className="rounded border border-white/20 bg-black/40 p-3" required />
          <input name="slug" placeholder="Slug (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />
          <input name="excerpt" placeholder="Resumo (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />
          <textarea name="content" placeholder="Conteúdo" className="min-h-40 rounded border border-white/20 bg-black/40 p-3" required />
          <input name="coverImage" placeholder="URL da capa (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />
          <input name="videoUrl" placeholder="URL do vídeo embutível (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />

          <select name="status" className="rounded border border-white/20 bg-black/40 p-3">
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </select>

          <fieldset>
            <legend className="mb-2 text-sm text-green-100/90">Categorias</legend>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <label key={category.id} className="text-sm text-green-100/90">
                  <input type="checkbox" name="categoryIds" value={category.id} className="mr-2" />
                  {category.name}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm text-green-100/90">Tags</legend>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <label key={tag.id} className="text-sm text-green-100/90">
                  <input type="checkbox" name="tagIds" value={tag.id} className="mr-2" />
                  #{tag.name}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="cyber-btn w-fit">
            Salvar post
          </button>
        </form>
      </section>

      <PostsManager posts={posts} categories={categories} tags={tags} />
    </main>
  );
}

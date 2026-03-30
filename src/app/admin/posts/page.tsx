import Link from "next/link";
import { revalidatePath } from "next/cache";

import { PostsManager } from "./_components/posts-manager";
import { CreatePostForm } from "./_components/create-post-form";
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

  const status = statusRaw === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

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
      publishedAt: status === "PUBLISHED" ? new Date() : null,
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
        <CreatePostForm action={createPostAction} categories={categories} tags={tags} />
      </section>

      <PostsManager posts={posts} categories={categories} tags={tags} />
    </main>
  );
}

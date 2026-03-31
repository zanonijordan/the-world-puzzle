"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import RichTextEditor from "@/components/RichTextEditor";

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

type PostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  videoUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  categories: Array<{ id: string; name: string }>;
  tags: Array<{ tag: { id: string; name: string } }>;
};

type Props = {
  posts: PostItem[];
  categories: Category[];
  tags: Tag[];
};

type EditFormState = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  videoUrl: string;
  status: "DRAFT" | "PUBLISHED";
  categoryIds: string[];
  tagIds: string[];
};

function toEditForm(post: PostItem): EditFormState {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    coverImage: post.coverImage ?? "",
    videoUrl: post.videoUrl ?? "",
    status: post.status,
    categoryIds: post.categories.map((category) => category.id),
    tagIds: post.tags.map((entry) => entry.tag.id),
  };
}

export function PostsManager({ posts, categories, tags }: Props) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(posts[0]?.id ?? null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId],
  );

  const [form, setForm] = useState<EditFormState | null>(selectedPost ? toEditForm(selectedPost) : null);

  function selectPost(post: PostItem) {
    setSelectedPostId(post.id);
    setConfirmDelete(false);
    setFeedback(null);
    setForm(toEditForm(post));
  }

  async function savePost() {
    if (!form) return;
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch(`/api/admin/posts/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          coverImage: form.coverImage,
          videoUrl: form.videoUrl,
          status: form.status,
          categoryIds: form.categoryIds,
          tagIds: form.tagIds,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback(data?.error ?? "Não foi possível salvar o post.");
        return;
      }

      setFeedback("Post atualizado com sucesso.");
      window.location.reload();
    });
  }

  async function togglePublish() {
    if (!form) return;
    const nextStatus = form.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    startTransition(async () => {
      const response = await fetch(`/api/admin/posts/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          coverImage: form.coverImage,
          videoUrl: form.videoUrl,
          status: nextStatus,
          categoryIds: form.categoryIds,
          tagIds: form.tagIds,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback(data?.error ?? "Não foi possível alterar o status.");
        return;
      }

      setFeedback(nextStatus === "PUBLISHED" ? "Post publicado." : "Post voltou para rascunho.");
      window.location.reload();
    });
  }

  async function deletePost() {
    if (!form) return;

    startTransition(async () => {
      const response = await fetch(`/api/admin/posts/${form.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setFeedback(data?.error ?? "Não foi possível remover o post.");
        return;
      }

      setFeedback("Post removido com sucesso.");
      window.location.reload();
    });
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Posts cadastrados</h2>
        {posts.length === 0 ? (
          <p className="mt-3 text-sm text-green-100/80">Nenhum post cadastrado.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {posts.map((post) => {
              const isActive = selectedPostId === post.id;
              return (
                <li key={post.id}>
                  <button
                    type="button"
                    onClick={() => selectPost(post)}
                    className={`w-full rounded border p-4 text-left transition ${
                      isActive
                        ? "border-fuchsia-400 bg-fuchsia-500/15"
                        : "border-[var(--neon-green)]/25 bg-black/40 hover:border-[var(--neon-green)]/50"
                    }`}
                  >
                    <p className="text-base font-semibold text-white">{post.title}</p>
                    <p className="text-xs text-green-100/80">slug: {post.slug}</p>
                    <p className="text-xs text-green-100/80">status: {post.status}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-[var(--neon-green)]/30 bg-black/55 p-6">
        <h2 className="text-lg font-bold">Editor do post</h2>

        {!form || !selectedPost ? (
          <p className="mt-3 text-sm text-green-100/80">Selecione um post para editar.</p>
        ) : (
          <div className="mt-4 grid gap-4">
            <div className="rounded border border-white/15 bg-black/40 p-3 text-sm text-green-100/90">
              Editando: <span className="font-semibold text-white">{selectedPost.title}</span>
            </div>

            <input
              value={form.title}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
              placeholder="Título"
              className="rounded border border-white/20 bg-black/40 p-3"
            />
            <input
              value={form.slug}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, slug: event.target.value } : prev))}
              placeholder="Slug"
              className="rounded border border-white/20 bg-black/40 p-3"
            />
            <input
              value={form.excerpt}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, excerpt: event.target.value } : prev))}
              placeholder="Resumo"
              className="rounded border border-white/20 bg-black/40 p-3"
            />
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm((prev) => (prev ? { ...prev, content: html } : prev))}
            />
            <input
              value={form.coverImage}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, coverImage: event.target.value } : prev))}
              placeholder="URL da capa"
              className="rounded border border-white/20 bg-black/40 p-3"
            />
            {form.coverImage ? (
              <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/50 p-2">
                <p className="mb-2 text-xs text-zinc-400">Preview da capa</p>
                <Image
                  src={form.coverImage}
                  alt="Preview da capa"
                  width={1200}
                  height={675}
                  className="h-auto max-h-64 w-full rounded-md object-cover"
                />
              </div>
            ) : null}
            <input
              value={form.videoUrl}
              onChange={(event) => setForm((prev) => (prev ? { ...prev, videoUrl: event.target.value } : prev))}
              placeholder="URL do vídeo"
              className="rounded border border-white/20 bg-black/40 p-3"
            />

            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => (prev ? { ...prev, status: event.target.value as "DRAFT" | "PUBLISHED" } : prev))
              }
              className="rounded border border-white/20 bg-black/40 p-3"
            >
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicado</option>
            </select>

            <fieldset>
              <legend className="mb-2 text-sm text-green-100/90">Categorias</legend>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                  const checked = form.categoryIds.includes(category.id);
                  return (
                    <label key={category.id} className="text-sm text-green-100/90">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          setForm((prev) => {
                            if (!prev) return prev;
                            const next = event.target.checked
                              ? [...prev.categoryIds, category.id]
                              : prev.categoryIds.filter((id) => id !== category.id);
                            return { ...prev, categoryIds: next };
                          })
                        }
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm text-green-100/90">Tags</legend>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => {
                  const checked = form.tagIds.includes(tag.id);
                  return (
                    <label key={tag.id} className="text-sm text-green-100/90">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          setForm((prev) => {
                            if (!prev) return prev;
                            const next = event.target.checked
                              ? [...prev.tagIds, tag.id]
                              : prev.tagIds.filter((id) => id !== tag.id);
                            return { ...prev, tagIds: next };
                          })
                        }
                        className="mr-2"
                      />
                      #{tag.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={savePost} className="cyber-btn" disabled={isPending}>
                Salvar alterações
              </button>

              <button
                type="button"
                onClick={togglePublish}
                className="rounded border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                disabled={isPending}
              >
                {form.status === "PUBLISHED" ? "Voltar para rascunho" : "Publicar"}
              </button>

              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="rounded border border-rose-300/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
                  disabled={isPending}
                >
                  Excluir
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2 rounded border border-rose-400/40 bg-rose-500/10 p-2">
                  <span className="text-xs text-rose-100">Tem certeza que deseja excluir este post?</span>
                  <button
                    type="button"
                    onClick={deletePost}
                    className="rounded border border-rose-300/40 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-100"
                    disabled={isPending}
                  >
                    Sim, excluir
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded border border-white/20 px-3 py-1 text-xs text-white"
                    disabled={isPending}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {feedback ? <p className="text-sm text-green-100/90">{feedback}</p> : null}
          </div>
        )}
      </div>
    </section>
  );
}

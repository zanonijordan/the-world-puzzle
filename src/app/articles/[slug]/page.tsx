import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/posts";

type ArticleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(date);
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-4xl px-6 py-16 text-white md:px-10">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--neon-green)]">
        {formatDate(post.publishedAt ?? post.createdAt)}
      </p>

      <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{post.title}</h1>

      <div className="mt-5 flex flex-wrap gap-2">
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

      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={1200}
          height={675}
          className="mt-8 max-h-[480px] w-full rounded-xl border border-white/10 object-cover"
        />
      ) : null}

      {post.excerpt ? (
        <p className="mt-8 rounded-lg border border-[var(--neon-green)]/25 bg-black/45 p-5 text-lg text-green-100/90">
          {post.excerpt}
        </p>
      ) : null}

      <article className="prose prose-invert mt-8 max-w-none">
        <div className="whitespace-pre-wrap text-green-100/90">{post.content}</div>
      </article>

      {post.videoUrl ? (
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[var(--neon-green)]">Vídeo relacionado</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-[var(--neon-green)]/35">
            <iframe
              src={post.videoUrl}
              title={`Vídeo de ${post.title}`}
              className="h-[320px] w-full md:h-[420px]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}

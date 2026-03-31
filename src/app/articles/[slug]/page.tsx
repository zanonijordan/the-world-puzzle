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
    <main className="relative min-h-screen bg-white pt-24 text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-6 py-12 md:px-10 md:py-16">
        <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">
          {formatDate(post.publishedAt ?? post.createdAt)}
        </p>

        <h1 className="mt-3 text-4xl font-black leading-tight text-zinc-900 md:text-5xl">{post.title}</h1>

        <div className="mt-5 flex flex-wrap gap-2">
          {post.categories.map((category: { id: string; name: string }) => (
            <span
              key={category.id}
              className="rounded border border-fuchsia-300 bg-fuchsia-50 px-2 py-1 text-xs text-fuchsia-700"
            >
              {category.name}
            </span>
          ))}
          {post.tags.map(({ tag }: { tag: { id: string; name: string } }) => (
            <span
              key={tag.id}
              className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-700"
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
            loading="eager"
            priority
            className="mt-8 max-h-[480px] w-full rounded-xl border border-zinc-200 object-cover shadow-sm"
          />
        ) : null}

        {post.excerpt ? (
          <p className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-lg leading-relaxed text-zinc-700">
            {post.excerpt}
          </p>
        ) : null}

        <article className="mt-8 max-w-none rounded-xl border border-zinc-200 bg-zinc-950 p-6 shadow-sm md:p-8">
          <div
            className="prose prose-invert max-w-none text-zinc-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {post.videoUrl ? (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-zinc-900">Vídeo relacionado</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
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
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { UploadDropzone } from "@/components/uploadthing";

type Category = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  tags: Tag[];
};

export function CreatePostForm({ action, categories, tags }: Props) {
  const [content, setContent] = useState("<p></p>");
  const [coverImage, setCoverImage] = useState("");

  return (
    <form action={action} className="mt-4 grid gap-4">
      <input name="title" placeholder="Título" className="rounded border border-white/20 bg-black/40 p-3" required />
      <input name="slug" placeholder="Slug (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />
      <input name="excerpt" placeholder="Resumo (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />

      <div className="prose prose-invert max-w-none text-zinc-100">
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <input type="hidden" name="content" value={content} />

      <div className="grid gap-3">
        <p className="text-sm text-green-100/90">Capa do post (opcional)</p>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const imageUrl = res?.[0]?.url ?? res?.[0]?.ufsUrl;
            if (!imageUrl) return;
            setCoverImage(imageUrl);
          }}
          onUploadError={(error: Error) => {
            console.error("Erro no upload da capa:", error);
          }}
          appearance={{
            container:
              "mt-1 border border-dashed border-zinc-700 bg-zinc-900/50 rounded-lg px-4 py-5 transition-colors hover:border-zinc-500",
            uploadIcon: "h-8 w-8 text-zinc-300",
            label: "text-sm font-medium text-zinc-100",
            allowedContent: "text-xs text-zinc-400",
            button:
              "mt-2 inline-flex h-9 items-center rounded-md border border-fuchsia-400/40 bg-fuchsia-600/90 px-3 text-sm font-medium text-white hover:bg-fuchsia-500",
          }}
        />
        {coverImage ? (
          <div className="grid gap-2">
            <p className="text-xs text-green-200/90">
              Upload concluído: <span className="break-all">{coverImage}</span>
            </p>
            <Image
              src={coverImage}
              alt="Preview da capa do post"
              width={1200}
              height={675}
              className="max-h-56 w-full rounded-md border border-zinc-700 object-cover"
            />
          </div>
        ) : null}
        <input type="hidden" name="coverImage" value={coverImage} />
      </div>
      <input
        name="videoUrl"
        placeholder="URL do vídeo embutível (opcional)"
        className="rounded border border-white/20 bg-black/40 p-3"
      />

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
  );
}

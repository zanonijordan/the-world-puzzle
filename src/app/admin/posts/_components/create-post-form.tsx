"use client";

import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";

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

  return (
    <form action={action} className="mt-4 grid gap-4">
      <input name="title" placeholder="Título" className="rounded border border-white/20 bg-black/40 p-3" required />
      <input name="slug" placeholder="Slug (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />
      <input name="excerpt" placeholder="Resumo (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />

      <div className="prose prose-invert max-w-none text-zinc-100">
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <input type="hidden" name="content" value={content} />

      <input name="coverImage" placeholder="URL da capa (opcional)" className="rounded border border-white/20 bg-black/40 p-3" />
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

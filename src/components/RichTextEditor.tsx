"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useUploadThing } from "@/lib/uploadthing";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-40 w-full rounded-b-md border border-t-0 border-zinc-800 bg-zinc-900 p-3 text-zinc-100 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("editorUploader", {
    onClientUploadComplete: (res) => {
      const uploaded = res?.[0];
      if (!uploaded || !editor) return;
      editor.chain().focus().setImage({ src: uploaded.ufsUrl }).run();
    },
    onUploadError: (error) => {
      console.error("Erro no upload da imagem do editor:", error);
    },
  });

  async function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await startUpload([file]);
    event.target.value = "";
  }

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Informe a URL do link:", previousUrl ?? "");

    if (url === null) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
  };


  const baseButtonClass =
    "rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-200 transition hover:bg-zinc-800";
  const activeButtonClass = "border-zinc-500 bg-zinc-700 text-white";
  const disabledButtonClass = "cursor-not-allowed opacity-50 hover:bg-zinc-900";

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 rounded-t-md border border-zinc-800 bg-black p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${baseButtonClass} ${editor.isActive("bold") ? activeButtonClass : ""}`}
        >
          Negrito
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${baseButtonClass} ${editor.isActive("italic") ? activeButtonClass : ""}`}
        >
          Itálico
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${baseButtonClass} ${editor.isActive("strike") ? activeButtonClass : ""}`}
        >
          Riscado
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${baseButtonClass} ${
            editor.isActive("heading", { level: 2 }) ? activeButtonClass : ""
          }`}
        >
          Título (H2)
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${baseButtonClass} ${editor.isActive("bulletList") ? activeButtonClass : ""}`}
        >
          Lista
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${baseButtonClass} ${editor.isActive("orderedList") ? activeButtonClass : ""}`}
        >
          Lista Numerada
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${baseButtonClass} ${
            editor.isActive("heading", { level: 3 }) ? activeButtonClass : ""
          }`}
        >
          Subtítulo (H3)
        </button>

        <button
          type="button"
          onClick={setLink}
          className={`${baseButtonClass} ${editor.isActive("link") ? activeButtonClass : ""}`}
        >
          Link
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${baseButtonClass} ${editor.isActive("blockquote") ? activeButtonClass : ""}`}
        >
          Citação
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${baseButtonClass} ${editor.isActive("codeBlock") ? activeButtonClass : ""}`}
        >
          Bloco de Código
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={baseButtonClass}
          disabled={isUploading}
        >
          {isUploading ? "Enviando imagem..." : "Imagem"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={baseButtonClass}
        >
          Divisor
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`${baseButtonClass} ${
            !editor.can().chain().focus().undo().run() ? disabledButtonClass : ""
          }`}
        >
          Desfazer
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`${baseButtonClass} ${
            !editor.can().chain().focus().redo().run() ? disabledButtonClass : ""
          }`}
        >
          Refazer
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

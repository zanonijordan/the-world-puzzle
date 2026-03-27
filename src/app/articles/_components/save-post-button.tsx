"use client";

import { useState, useTransition } from "react";

type SavePostButtonProps = {
  postId: string;
  initialSaved: boolean;
};

export function SavePostButton({ postId, initialSaved }: SavePostButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleSave() {
    setMessage(null);

    startTransition(async () => {
      const method = saved ? "DELETE" : "POST";
      const response = await fetch(`/api/member/posts/${postId}/like`, {
        method,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setMessage(body?.error ?? "Não foi possível atualizar seus salvos.");
        return;
      }

      const nextSaved = !saved;
      setSaved(nextSaved);
      setMessage(nextSaved ? "Post salvo com sucesso." : "Post removido dos salvos.");
    });
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={toggleSave}
        disabled={isPending}
        className={`rounded border px-3 py-2 text-xs font-semibold transition ${
          saved
            ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20"
            : "border-fuchsia-400/50 bg-fuchsia-500/10 text-fuchsia-700 hover:bg-fuchsia-500/20"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isPending ? "Processando..." : saved ? "Remover dos salvos" : "Salvar post"}
      </button>
      {message ? <p className="mt-2 text-xs text-zinc-600">{message}</p> : null}
    </div>
  );
}

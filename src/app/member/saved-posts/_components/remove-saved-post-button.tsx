"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type RemoveSavedPostButtonProps = {
  postId: string;
};

export function RemoveSavedPostButton({ postId }: RemoveSavedPostButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function removeSavedPost() {
    setMessage(null);

    startTransition(async () => {
      const response = await fetch(`/api/member/posts/${postId}/like`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setMessage(body?.error ?? "Não foi possível remover dos salvos.");
        return;
      }

      setMessage("Post removido dos salvos.");
      router.refresh();
    });
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={removeSavedPost}
        disabled={isPending}
        className="rounded border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Processando..." : "Remover dos salvos"}
      </button>
      {message ? <p className="mt-2 text-xs text-zinc-600">{message}</p> : null}
    </div>
  );
}

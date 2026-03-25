"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleCredentialsLogin(formData: FormData) {
    setError("");

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (result?.error) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      if (result?.ok) {
        window.location.href = result.url ?? "/";
      }
    });
  }

  function handleSocialLogin(provider: "google" | "facebook") {
    setError("");

    startTransition(async () => {
      await signIn(provider, { callbackUrl: "/" });
    });
  }

  return (
    <div className="mt-6 space-y-4">
      <form action={handleCredentialsLogin} className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-cyan-100/90">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-cyan-500/30 bg-black/60 px-3 py-2 text-cyan-100 outline-none ring-0 transition focus:border-cyan-400"
            placeholder="voce@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm text-cyan-100/90"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-cyan-500/30 bg-black/60 px-3 py-2 text-cyan-100 outline-none ring-0 transition focus:border-cyan-400"
            placeholder="********"
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-fuchsia-500 px-4 py-2 font-semibold text-black transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Entrando..." : "Entrar com e-mail"}
        </button>
      </form>

      <div className="my-2 text-center text-xs uppercase tracking-[0.2em] text-cyan-100/50">
        ou
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSocialLogin("google")}
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Entrar com Google
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => handleSocialLogin("facebook")}
          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Entrar com Facebook
        </button>
      </div>

      <p className="pt-2 text-center text-xs text-cyan-100/60">
        Ao entrar, você concorda com os termos da plataforma.
      </p>

      <p className="text-center text-xs text-cyan-100/70">
        Voltar para{" "}
        <Link href="/" className="text-fuchsia-400 hover:text-fuchsia-300">
          home
        </Link>
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type RegisterState = {
  error: string;
  success: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<RegisterState>({
    error: "",
    success: "",
  });

  function handleRegister(formData: FormData) {
    setState({ error: "", success: "" });

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setState({
            error: data?.error ?? "Não foi possível criar sua conta.",
            success: "",
          });
          return;
        }

        setState({
          error: "",
          success: "Conta criada com sucesso! Redirecionando para login...",
        });

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } catch {
        setState({
          error: "Erro de conexão ao registrar conta.",
          success: "",
        });
      }
    });
  }

  return (
    <div className="mt-6 space-y-4">
      <form action={handleRegister} className="space-y-3">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm text-cyan-100/90">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-cyan-100 outline-none ring-0 transition focus:border-fuchsia-400"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-cyan-100/90">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-cyan-100 outline-none ring-0 transition focus:border-fuchsia-400"
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
            maxLength={100}
            className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-cyan-100 outline-none ring-0 transition focus:border-fuchsia-400"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {state.error ? (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {state.success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="text-center text-xs text-cyan-100/70">
        Já tem conta?{" "}
        <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300">
          Entrar
        </Link>
      </p>
    </div>
  );
}

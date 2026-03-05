import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { LoginForm } from "./_components/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-black text-cyan-100">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
        <div className="rounded-2xl border border-cyan-500/40 bg-zinc-950/90 p-6 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            THE WORLD PUZZLE
          </p>
          <h1 className="mt-2 text-2xl font-bold text-fuchsia-400">
            Área de Membros
          </h1>
          <p className="mt-2 text-sm text-cyan-100/80">
            Entre para acessar recursos exclusivos e publicar conteúdo.
          </p>

          <LoginForm />
        </div>

        <p className="text-center text-sm text-cyan-100/80">
          Não tem conta?{" "}
          <Link
            href="/register"
            className="font-semibold text-fuchsia-400 hover:text-fuchsia-300"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}

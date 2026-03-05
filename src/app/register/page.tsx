import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { RegisterForm } from "./_components/register-form";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-black text-cyan-100">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-16">
        <div className="rounded-2xl border border-fuchsia-500/40 bg-zinc-950/90 p-6 shadow-[0_0_30px_rgba(217,70,239,0.15)]">
          <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-400">
            THE WORLD PUZZLE
          </p>
          <h1 className="mt-2 text-2xl font-bold text-cyan-300">
            Criar conta
          </h1>
          <p className="mt-2 text-sm text-cyan-100/80">
            Cadastre-se para comentar, salvar e publicar no painel.
          </p>

          <RegisterForm />
        </div>

        <p className="text-center text-sm text-cyan-100/80">
          Já possui conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-fuchsia-400 hover:text-fuchsia-300"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-12 text-white md:px-6">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-200/20 bg-black/30 p-6 shadow-lg backdrop-blur-sm md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Política de Privacidade</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-base">
            Esta Política de Privacidade descreve como o <strong>Mundo Puzzle</strong> coleta e usa
            informações para autenticação e funcionamento da plataforma.
          </p>
        </header>

        <section className="space-y-6 text-sm leading-7 text-slate-100 md:text-base">
          <div>
            <h2 className="mb-2 text-xl font-semibold">1. Dados coletados</h2>
            <p>
              Ao entrar com Google ou Facebook, coletamos apenas os dados básicos fornecidos pelo
              provedor: <strong>nome</strong>, <strong>e-mail</strong> e{" "}
              <strong>imagem de perfil</strong>.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">2. Finalidade do uso</h2>
            <p>Usamos esses dados exclusivamente para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>realizar a autenticação da sua conta;</li>
              <li>identificar seu perfil na plataforma;</li>
              <li>salvar e recuperar seu progresso de uso.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">3. Compartilhamento de dados</h2>
            <p>
              O <strong>Mundo Puzzle não compartilha seus dados com terceiros</strong> para fins
              comerciais ou de publicidade.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">4. Atualizações desta política</h2>
            <p>
              Esta política pode ser atualizada quando necessário. Recomendamos revisar esta página
              periodicamente.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

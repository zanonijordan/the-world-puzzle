export default function DeleteDataPage() {
  return (
    <main className="min-h-screen px-4 py-12 text-white md:px-6">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-200/20 bg-black/30 p-6 shadow-lg backdrop-blur-sm md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Exclusão de Dados</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-base">
            Se você deseja excluir seus dados pessoais e sua conta do <strong>Mundo Puzzle</strong>,
            esta página explica como solicitar.
          </p>
        </header>

        <section className="space-y-6 text-sm leading-7 text-slate-100 md:text-base">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Como solicitar a exclusão</h2>
            <p>Você pode pedir a exclusão dos seus dados de duas formas:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                enviando um e-mail para <strong>[seu-email-aqui]</strong>;
              </li>
              <li>
                utilizando as configurações do seu perfil para exclusão da conta (se esse recurso
                estiver disponível).
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">O que será removido</h2>
            <p>
              Após a solicitação, removeremos os dados associados à sua conta dentro do prazo
              aplicável, incluindo as informações de autenticação armazenadas na plataforma.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Confirmação</h2>
            <p>
              Quando o processo for concluído, você poderá receber uma confirmação pelos canais
              disponíveis na sua conta ou pelo e-mail de contato.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

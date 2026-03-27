# TODO - Área de membros: posts salvos (likes)

- [x] Atualizar Prisma com modelo de likes/salvos entre User e Post
- [x] Aplicar migração Prisma para nova estrutura
- [x] Implementar `requireMember()` em `src/lib/session.ts`
- [x] Criar endpoint `POST /api/member/posts/[id]/like`
- [x] Criar endpoint `DELETE /api/member/posts/[id]/like`
- [x] Criar endpoint `GET /api/member/liked-posts`
- [x] Criar componente client de salvar/remover post em artigos
- [x] Integrar botão de salvar/remover em `src/app/articles/page.tsx`
- [x] Criar página `/member/saved-posts` para listar salvos do membro
- [x] Atualizar `src/components/site-header.tsx` com link "Meus salvos" para MEMBER
- [x] Executar critical-path testing (salvar/remover/listar)
- [x] Atualizar TODO com progresso e consolidar resultado

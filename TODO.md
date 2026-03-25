# TODO

- [x] Ajustar velocidade do efeito Matrix em `src/components/HeroMatrix.tsx`
- [x] Validar limpeza/continuidade da animação após ajuste
- [x] Marcar tarefas como concluídas
- [x] Adicionar `directUrl` no `prisma/schema.prisma`
- [x] Preparar `.env` com `DATABASE_URL` e `DATABASE_URL_UNPOOLED`
- [x] Confirmar comando de sincronização Prisma com Neon

## Correção OAuth social (Google/Facebook)

- [x] Tornar `User.password` opcional em `prisma/schema.prisma`
- [ ] Gerar migration Prisma para atualizar o banco (bloqueado por drift no banco remoto; não aplicado para evitar reset destrutivo)
- [x] Rodar `npx prisma generate`
- [x] Rodar `npm run lint`
- [x] Rodar `npm run build`
- [ ] Validar checklist de testes manuais de login social

## Páginas institucionais (Privacidade e Exclusão)

- [x] Criar `src/app/privacy/page.tsx` com Política de Privacidade do Mundo Puzzle
- [x] Criar `src/app/delete/page.tsx` com instruções de exclusão de dados/conta
- [x] Revisar consistência visual (legibilidade e espaçamento) das duas páginas

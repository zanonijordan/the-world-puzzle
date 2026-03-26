# TODO - Ajustes Auth/Admin (NextAuth v5 + Prisma)

- [x] Atualizar `src/lib/auth.ts` para sincronizar `token.role` de forma robusta (login inicial e requests subsequentes)
- [x] Atualizar `src/types/next-auth.d.ts` para tipar Session e JWT com `id` e `role`
- [x] Atualizar `middleware.ts` para proteger `/admin/:path*` exigindo role `ADMIN`, sem loop de redirect
- [x] Revisar consistência dos redirects (`/login?callbackUrl=...` para não autenticado, `/` para não autorizado)

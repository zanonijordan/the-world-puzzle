# TODO - Tags e Categorias dinâmicas no Admin

- [x] Implementar server action para criar categoria em `src/app/admin/categories/page.tsx`
- [x] Implementar formulário funcional de criação de categoria em `src/app/admin/categories/page.tsx`
- [x] Implementar server action para criar tag em `src/app/admin/tags/page.tsx`
- [x] Implementar formulário funcional de criação de tag em `src/app/admin/tags/page.tsx`
- [x] Executar validação com lint/build

## Nova solicitação - Exclusão no modo de criação
- [ ] Implementar server action para excluir categoria em `src/app/admin/categories/page.tsx`
- [ ] Adicionar botão/form de exclusão por item na lista de categorias
- [ ] Implementar server action para excluir tag em `src/app/admin/tags/page.tsx`
- [ ] Adicionar botão/form de exclusão por item na lista de tags
- [ ] Executar validação com lint/build

## Nova solicitação - UploadThing (capa + editor)
- [x] Instalar dependências do UploadThing e extensão de imagem do TipTap
- [x] Criar `src/app/api/uploadthing/core.ts` com rotas `imageUploader` e `editorUploader`
- [x] Criar `src/app/api/uploadthing/route.ts`
- [x] Criar helper client de UploadThing em `src/lib/uploadthing.ts`
- [x] Substituir input `coverImage` por upload no `create-post-form.tsx`
- [x] Adicionar upload de imagem no `RichTextEditor.tsx` (botão + inserção automática no conteúdo)
- [x] Executar validação com lint/build

## Nova solicitação - Correções de render e salvamento da capa
- [x] Renderizar HTML do conteúdo com `dangerouslySetInnerHTML` em `src/app/articles/[slug]/page.tsx`
- [x] Ajustar captura de URL da capa no upload (`res[0].url`) em `create-post-form.tsx`
- [x] Adicionar preview visual da capa no formulário admin
- [ ] Executar validação com lint

## Nova solicitação - Remover arquivo da UploadThing ao excluir/trocar capa
- [ ] Retornar `key` do arquivo no `onUploadComplete` (upload router)
- [ ] Implementar util para extrair fileKey da URL da capa
- [ ] No `DELETE /api/admin/posts/[id]`, remover arquivo na UploadThing antes de deletar post
- [ ] No `PUT /api/admin/posts/[id]`, remover capa antiga quando trocar URL
- [ ] Executar validação com lint

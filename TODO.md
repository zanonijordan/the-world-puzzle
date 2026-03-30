# TODO

- [x] Criar componente client `create-post-form.tsx` para formulário de criação
- [x] Substituir `textarea` por `RichTextEditor` com `input hidden` para `content`
- [x] Aplicar classes `prose prose-invert max-w-none text-zinc-100` no contêiner do editor
- [x] Atualizar `src/app/admin/posts/page.tsx` para usar o novo componente
- [x] Revisar tipagem/integração com `createPostAction`

## Expansão do RichTextEditor (toolbar de blog)

- [ ] Adicionar extensão de Link e ampliar heading para H2/H3
- [ ] Implementar ação de Link com prompt de URL
- [ ] Adicionar botões: Blockquote, Code Block, Ordered List, H3, Horizontal Rule
- [ ] Adicionar botões Undo/Redo com estado disabled apropriado
- [ ] Validar lint/build após alterações

# Esteira OpenCode

## Decisão

A sprint `ST-S02` usa a esteira `opencode_worker` como executora padrão. Jules não é necessário e não pode ser acionado como fallback automático dessa fila.

## Responsabilidades

- Codex define task orders, congela contratos, revisa diffs e decide os gates.
- `opencode_worker` implementa, testa, cria branch, registra commits, abre PR e produz evidências.
- O System Builder fornece somente contratos oficiais de plataforma nos gates integrados.

## Regras operacionais

- executar uma task por vez;
- criar branch curta a partir do `origin/main` vigente;
- respeitar allowlist e arquivos proibidos da task order;
- executar todos os testes e gates declarados;
- manter `AUTO_MERGE=false`;
- não trocar silenciosamente de executor;
- se todos os modelos OpenCode falharem, mover a task para `needs_codex` com o erro e as tentativas registradas;
- CI verde não substitui a revisão Codex.

## Gate mínimo de PR

- SHA base e head registrados;
- diff limitado ao escopo;
- lint, typecheck, testes, build e `git diff --check` executados;
- ausência de secrets, datasets reais, artefatos gerados e evidência artificial;
- riscos e limitações documentados;
- decisão Codex: aceitar, solicitar correção, fechar ou reiniciar.

## Dependência do runtime

O supervisor que consome esta política deve configurar:

```text
TASK_EXECUTOR=opencode_worker
OPENCODE_WORKER_FALLBACK=none
AUTO_MERGE=false
```

O executável `opencode` deve estar disponível no `PATH` do processo supervisor. Sua ausência é bloqueio operacional e não autoriza fallback para Jules.

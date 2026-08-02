# Política de Release

## Canais

- `experimental`: pesquisa e mudanças sem estabilidade garantida;
- `alpha`: fluxo principal incompleto, uso interno;
- `beta`: capabilities integradas e testadas em ambiente controlado;
- `release-candidate`: candidata a produção, sem falhas críticas conhecidas;
- `stable`: aprovada para uso definido;
- `deprecated`: mantida apenas para migração;
- `archived`: sem suporte ativo.

## Requisitos mínimos

Toda release deve possuir:

- escopo explícito;
- changelog;
- versão;
- commit ou build identificável;
- testes executados;
- riscos conhecidos;
- instruções de migração quando necessário;
- rollback ou estratégia de recuperação;
- responsável pela aprovação.

## Releases de produção

Além dos requisitos gerais, exigem:

- aprovação de risco;
- observabilidade disponível;
- kill switch testado;
- compatibilidade de contratos verificada;
- reconciliação validada quando houver execução;
- secrets e permissões revisados.

## Rollback

Rollback deve restaurar comportamento seguro. Quando dados já tiverem sido alterados, o plano deve indicar compensação ou migração reversa.

## Hotfix

Hotfix é permitido para falhas críticas, mas não elimina:

- revisão posterior;
- testes mínimos;
- registro de incidente;
- atualização de documentação;
- análise de causa raiz.

## Frequência

A frequência de release será determinada pela capacidade de validar mudanças, não por calendário fixo.
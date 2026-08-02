# Política de Qualidade

## Objetivo

Definir critérios mínimos para que código, dados, estratégias e releases sejam considerados confiáveis.

## Qualidade de software

- contratos explícitos;
- testes automatizados;
- tratamento de erros;
- observabilidade;
- segurança de segredos;
- idempotência em integrações externas;
- revisão antes de merge;
- documentação atualizada.

## Qualidade de pesquisa

- hipótese registrada antes da execução oficial;
- dataset versionado;
- custos e slippage considerados;
- separação entre in-sample e out-of-sample;
- ausência de look-ahead;
- critérios de sucesso definidos previamente;
- resultados negativos preservados;
- replicabilidade.

## Qualidade de dados

- origem conhecida;
- schema validado;
- timezone explícito;
- lacunas e duplicidades avaliadas;
- transformações registradas;
- checksum e versão;
- flags de qualidade propagadas.

## Qualidade operacional

- health checks;
- alertas relevantes;
- reconciliação;
- recuperação após reinício;
- kill switch;
- logs de auditoria;
- limites server-side;
- incident response.

## Definition of Done

Uma tarefa só está concluída quando:

- critérios de aceitação foram atendidos;
- testes relevantes passam;
- documentação necessária foi atualizada;
- riscos conhecidos foram registrados;
- mudanças são observáveis;
- não há segredo no repositório;
- a entrega pode ser demonstrada.

## Severidade de defeitos

- Critical: risco financeiro, segurança ou corrupção de dados;
- High: bloqueia capability central ou produz decisão incorreta;
- Medium: comportamento incorreto com workaround;
- Low: impacto limitado, visual ou documental.

Defeitos críticos impedem promoção e release.
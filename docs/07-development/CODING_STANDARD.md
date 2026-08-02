# Padrão de Código

## Objetivo

Manter o projeto legível, testável, seguro e independente de fornecedores.

## Diretrizes

- nomes de domínio em inglês no código;
- documentação do produto pode permanecer em português;
- tipos explícitos nas fronteiras;
- validação de entrada em APIs e workers;
- erros estruturados;
- funções pequenas e com responsabilidade clara;
- evitar lógica de negócio em controllers, componentes visuais e adapters;
- dependências externas encapsuladas;
- datas e horários em UTC internamente;
- valores monetários e preços com precisão adequada, evitando `float` quando houver risco de arredondamento;
- IDs estáveis e não derivados de nomes mutáveis.

## Organização

```text
apps/
packages/
  trading-domain/
  trading-protocols/
  pattern-engine/
  context-engine/
  risk-engine/
  portfolio-engine/
  broker-adapters/
```

## Camadas

- domain: regras e modelos puros;
- application: casos de uso e orquestração;
- infrastructure: banco, fila, APIs e brokers;
- presentation: web, API e CLI.

## Contratos

- schemas versionados;
- DTOs não devem vazar modelos de persistência;
- adapters traduzem contratos externos para canônicos;
- eventos devem seguir o envelope oficial;
- mudanças incompatíveis exigem versão nova.

## Segurança

- nenhum segredo no código ou fixtures públicas;
- logs não podem expor tokens, senhas ou credenciais;
- entradas externas são não confiáveis;
- comandos de execução exigem autorização e idempotência;
- permissões seguem menor privilégio.

## Observabilidade

Operações relevantes devem produzir logs estruturados com correlation id. Métricas e traces devem ser adicionados onde houver processamento assíncrono, risco ou integração externa.

## Comentários

Comentários explicam decisões e restrições, não repetem o código. Regras institucionais importantes devem apontar para documentação ou ADR correspondente.

## Dependências

Novas bibliotecas devem ser justificadas por valor, manutenção, licença, segurança e custo de substituição.
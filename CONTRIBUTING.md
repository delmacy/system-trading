# Contribuindo

## Princípios

Toda contribuição deve preservar segurança, rastreabilidade, reprodutibilidade e separação entre pesquisa e produção.

## Antes de iniciar

- confirme que existe issue ou especificação equivalente;
- registre escopo, critérios de aceitação e riscos;
- identifique se a mudança pertence ao System Builder ou ao domínio System Trading;
- crie ADR quando a decisão for estrutural ou difícil de reverter.

## Desenvolvimento

- use branch curta e descritiva;
- mantenha mudanças pequenas e revisáveis;
- adicione testes relevantes;
- atualize documentação e contratos;
- não inclua segredos, dados licenciados ou credenciais;
- não habilite execução real por padrão.

## Pull request

A descrição deve informar:

- problema;
- solução;
- escopo e não escopo;
- testes executados;
- riscos;
- impacto em dados, eventos, risco e execução;
- plano de rollback quando aplicável.

## Definition of Done

- critérios atendidos;
- testes passando;
- documentação atualizada;
- observabilidade adequada;
- riscos conhecidos registrados;
- entrega demonstrável;
- ausência de secrets;
- nenhuma regressão crítica conhecida.

## Pesquisa quantitativa

Mudanças de estratégia devem preservar:

- hipótese prévia;
- dataset e versão;
- parâmetros;
- custos e slippage;
- resultados negativos;
- separação de amostras;
- reprodutibilidade.

## Conduta operacional

Nenhuma contribuição deve contornar Risk Engine, kill switch, auditoria ou gates de produção.
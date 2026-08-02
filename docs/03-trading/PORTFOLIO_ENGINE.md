# Portfolio Engine

## Propósito

Administrar capital e risco agregado entre estratégias, contas, instrumentos e mercados.

## Responsabilidades

- consolidar exposições;
- calcular concentração;
- agrupar correlações;
- alocar capital;
- reduzir capital de estratégias degradadas;
- impedir duplicação invisível de risco;
- comparar retorno marginal com risco marginal;
- respeitar capacidade e liquidez.

## Entidades

- Portfolio
- Capital Bucket
- Allocation Policy
- Strategy Allocation
- Account Allocation
- Correlation Group
- Exposure Snapshot
- Rebalance Decision

## Entradas

- capital disponível;
- risco autorizado;
- métricas de estratégia;
- saúde da estratégia;
- correlação histórica e atual;
- capacidade estimada;
- custos;
- regras de conta;
- liquidez;
- drawdown atual.

## Saídas

- capital autorizado por estratégia;
- risco máximo por conta;
- fator de redução;
- bloqueios de concentração;
- rebalanceamentos;
- justificativas auditáveis.

## Política inicial

No MVP, o portfólio deverá assumir abordagem conservadora:

- nenhuma estratégia recebe todo o capital;
- estratégias altamente correlacionadas compartilham limite;
- degradação reduz alocação antes de bloquear;
- aumento de alocação exige evidência fora da amostra e estabilidade operacional;
- resultados de uma conta não podem esconder risco agregado em outras contas.

## Regra institucional

Contas são meios de execução. O risco pertence ao portfólio global.
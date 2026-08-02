# Execution Engine

## Propósito

Converter intenções de ordem aprovadas em ações de broker, preservando idempotência, rastreabilidade e reconciliação.

## Princípios

- broker adapters isolam diferenças externas;
- nenhuma ordem é enviada sem decisão de risco válida;
- comandos externos devem ser idempotentes;
- estado local nunca substitui reconciliação com a fonte real;
- fills parciais, rejeições e atrasos são estados normais;
- execução real permanece desabilitada por padrão.

## Fluxo

```text
Trade Hypothesis
  ↓
Risk Approval
  ↓
Order Intent
  ↓
Broker Adapter
  ↓
Order Acknowledgement
  ↓
Fill Events
  ↓
Position State
  ↓
Reconciliation
```

## Contrato mínimo de adapter

- connect;
- health check;
- list accounts;
- get balances;
- get positions;
- submit order;
- amend order;
- cancel order;
- list orders;
- fetch fills;
- normalize errors;
- reconcile state.

## Estados de ordem

- created;
- pending submission;
- submitted;
- accepted;
- partially filled;
- filled;
- rejected;
- cancelled;
- expired;
- unknown;
- reconciliation required.

## Requisitos

- chave idempotente por intenção;
- correlação entre intenção, ordem externa e fills;
- timestamps locais e do broker;
- política de retry limitada;
- circuit breaker;
- logs sem segredos;
- métricas de latência, rejeição e slippage;
- kill switch independente do adapter.

## Primeiro gateway

MetaTrader 5 poderá ser o primeiro gateway, usando um Expert Advisor ou serviço intermediário como adaptador. O domínio não deverá depender de estruturas MQL5.

## Critério para live

O gateway somente poderá enviar ordens reais depois de demonstrar:

- idempotência;
- reconciliação;
- recuperação após reinício;
- tratamento de fill parcial;
- tratamento de rejeição;
- kill switch;
- ambiente de teste separado;
- trilha completa de auditoria.
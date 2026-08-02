# Capability Map

## Capabilities herdadas do System Builder

- Identity and Access
- Workspace Management
- Capability Registry
- Workflow Engine
- Documents
- Object Storage Abstraction
- Notifications
- Audit Trail
- Deployment Registry
- UI Shell
- Observability Primitives
- Governance Primitives

## Capabilities específicas do System Trading

### Trading Lab

Gerencia ideias, hipóteses, experimentos, evidências e decisões.

### Strategy Registry

Mantém estratégias, versões, parâmetros, regras e estados de ciclo de vida.

### Pattern Registry

Mantém definições, detectores, versões e observações de padrões.

### Context Registry and Engine

Define e classifica regimes, estados e transições de mercado.

### Market Data

Gerencia instrumentos, sessões, ingestão, qualidade, datasets e lineage.

### Feature Engine

Calcula features determinísticas e versões de feature sets.

### Signal Factory

Produz sinais a partir de regras, modelos e contexto.

### Opportunity Aggregator

Agrupa sinais correlatos em uma única hipótese de trade.

### Backtest Engine

Executa simulações históricas reproduzíveis com custos e slippage.

### Walk-Forward Engine

Avalia estabilidade fora da amostra e ao longo do tempo.

### Shadow Ledger

Registra decisões em fluxo real sem envio de ordens.

### Risk Engine

Aplica sizing, limites, exposição, vetos e kill switches.

### Portfolio Manager

Aloca capital entre estratégias, contas, ativos e grupos de correlação.

### Execution Gateway

Integra brokers por adaptadores, garantindo idempotência e reconciliação.

### Post-Trade Analytics

Compara sinal, decisão, ordem, fill e resultado.

### Strategy Health

Detecta degradação, drift, mudanças de capacidade e necessidade de redução.

### Reporting

Gera relatórios de pesquisa, risco, operação, performance e incidentes.

## Dependências mínimas

```text
Trading Lab
  ├─ Strategy Registry
  ├─ Pattern Registry
  └─ Dataset Registry

Backtest Engine
  ├─ Market Data
  ├─ Strategy Registry
  └─ Cost and Slippage Models

Signal Factory
  ├─ Feature Engine
  ├─ Context Engine
  └─ Pattern Registry

Execution Gateway
  ├─ Risk Engine
  ├─ Account Registry
  ├─ Order Protocols
  └─ Audit
```

## Regra de instalação

Capabilities específicas podem evoluir de forma independente, mas nenhuma capability de produção poderá contornar auditoria, risco e observabilidade.
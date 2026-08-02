# Modelo de Eventos

## Objetivo

Definir eventos canônicos para desacoplar pesquisa, backtest, risco, execução, analytics e governança.

## Envelope canônico

Todo evento deverá conter:

```json
{
  "event_id": "uuid",
  "event_type": "StrategyCreated",
  "schema_version": 1,
  "occurred_at": "ISO-8601",
  "workspace_id": "uuid",
  "environment": "research",
  "aggregate_type": "strategy",
  "aggregate_id": "uuid",
  "aggregate_version": 1,
  "correlation_id": "uuid",
  "causation_id": "uuid|null",
  "producer": "service-or-worker",
  "actor": "user-or-system",
  "payload": {},
  "metadata": {}
}
```

## Eventos iniciais

### Pesquisa e estratégia

- `ResearchIdeaCreated`
- `HypothesisRegistered`
- `ExperimentCreated`
- `ExperimentStarted`
- `ExperimentCompleted`
- `StrategyCreated`
- `StrategyVersionPublished`
- `StrategyPromoted`
- `StrategyReduced`
- `StrategySuspended`
- `StrategyDeprecated`

### Dados

- `DatasetRegistered`
- `DatasetVersionCreated`
- `MarketDataImported`
- `DataQualityCheckCompleted`
- `DataQualityIssueDetected`

### Backtest

- `BacktestRequested`
- `BacktestStarted`
- `BacktestCompleted`
- `BacktestFailed`
- `WalkForwardStarted`
- `WalkForwardCompleted`

### Sinal e oportunidade

- `PatternObserved`
- `ContextClassified`
- `SignalGenerated`
- `OpportunityCreated`
- `OpportunityExpired`

### Risco

- `RiskEvaluationRequested`
- `RiskApproved`
- `RiskAdjusted`
- `RiskRejected`
- `RiskLimitBreached`
- `KillSwitchActivated`
- `KillSwitchReleased`

### Execução

- `OrderIntentCreated`
- `OrderSubmitted`
- `OrderAccepted`
- `OrderRejected`
- `OrderPartiallyFilled`
- `OrderFilled`
- `OrderCancelled`
- `PositionOpened`
- `PositionAdjusted`
- `PositionClosed`
- `ReconciliationCompleted`
- `ReconciliationMismatchDetected`

### Analytics e governança

- `MetricCalculated`
- `StrategyDegradationDetected`
- `IncidentCreated`
- `ApprovalRequested`
- `ApprovalGranted`
- `ApprovalRejected`

## Garantias

- consumidores devem ser idempotentes;
- eventos não devem ser alterados depois de publicados;
- correções devem gerar novos eventos;
- mudanças incompatíveis exigem nova versão de schema;
- eventos críticos devem possuir retenção e rastreabilidade apropriadas;
- nenhum evento de domínio deve carregar segredos.

## Convenção

Eventos representam fatos passados. Comandos representam intenções. Não usar nomes de comando como evento.
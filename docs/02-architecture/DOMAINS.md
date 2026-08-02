# Domínios e Bounded Contexts

## Research

Responsável por ideias, hipóteses, experimentos, evidências e decisões de pesquisa.

Entidades principais:

- Lab
- Research Idea
- Hypothesis
- Experiment
- Experiment Run
- Evidence
- Decision

## Strategy

Responsável pela definição versionada das estratégias.

Entidades principais:

- Strategy
- Strategy Version
- Parameter Set
- Entry Rule
- Exit Rule
- Management Rule
- Eligibility Rule
- Strategy Health

## Pattern

Responsável pelo catálogo e detecção de padrões.

Entidades principais:

- Pattern Definition
- Pattern Version
- Pattern Observation
- Detector
- Detection Score

## Context

Responsável pela classificação do estado do mercado.

Entidades principais:

- Context Definition
- Market State
- Context Observation
- Context Score
- Regime Transition

## Market Data

Responsável por instrumentos, sessões, candles, ticks, datasets e qualidade dos dados.

Entidades principais:

- Market
- Instrument
- Venue
- Session
- Candle
- Tick
- Dataset
- Dataset Version
- Data Quality Report

## Signal and Opportunity

Responsável por converter evidências em hipóteses de operação.

Entidades principais:

- Signal
- Evidence Bundle
- Opportunity
- Trade Hypothesis
- Quality Score
- Opportunity Status

## Backtest

Responsável por execuções históricas reproduzíveis.

Entidades principais:

- Backtest Specification
- Backtest Run
- Simulation Order
- Simulation Trade
- Cost Model
- Slippage Model
- Performance Report

## Risk

Responsável por limites, vetos, sizing e exposição agregada.

Entidades principais:

- Risk Policy
- Risk Profile
- Risk Decision
- Exposure
- Limit
- Breach
- Kill Switch

## Portfolio

Responsável por alocação de capital e visão consolidada.

Entidades principais:

- Portfolio
- Allocation
- Capital Bucket
- Strategy Allocation
- Account Allocation
- Correlation Group

## Execution

Responsável pela comunicação com brokers e reconciliação.

Entidades principais:

- Broker Connection
- Account
- Order Intent
- Order
- Fill
- Position
- Trade
- Reconciliation Run

## Analytics

Responsável por métricas, comparações e degradação.

Entidades principais:

- Metric Definition
- Metric Observation
- Benchmark
- Drift Signal
- Degradation Alert
- Attribution Report

## Governance

Responsável por promoção, aprovação, bloqueio e auditoria.

Entidades principais:

- Approval
- Promotion Gate
- Policy Exception
- Audit Record
- Incident
- Release

## Regra de fronteira

Nenhum bounded context deve acessar diretamente as tabelas internas de outro contexto. A integração deve ocorrer por contratos de aplicação, views autorizadas ou eventos canônicos.
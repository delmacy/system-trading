# Project Blueprint

## Identificação

- Project ID: `SB-PROJ-TRADING-001`
- Nome: System Trading
- Classificação: produto interno, dogfooding e plataforma de pesquisa
- Status inicial: incubação
- Repositório: `delmacy/system-trading`
- Plataforma base: System Builder

## Propósito

Construir uma plataforma institucional de pesquisa, validação e operação de estratégias quantitativas. O objetivo não é criar um único robô, mas uma fábrica governada de hipóteses, estratégias, experimentos e decisões de capital.

## Princípios

- Process First
- Event Driven
- Everything Auditable
- Evidence Before Opinion
- Strategy Is a Hypothesis
- Reality Overrides Assumptions
- Small Edge × Large Sample
- Risk Before Return

## Critérios de sucesso do produto

O sistema deverá ser capaz de:

- registrar estratégias, padrões, contextos e versões;
- importar e governar datasets;
- executar backtests reproduzíveis;
- executar walk-forward;
- classificar contexto de mercado;
- agregar sinais em oportunidades únicas;
- aplicar políticas de risco por trade, estratégia, conta e portfólio;
- operar em shadow e paper;
- integrar gateways de execução;
- produzir trilhas de auditoria;
- comparar resultado esperado, simulado e executado;
- detectar degradação;
- promover, reduzir, bloquear ou aposentar estratégias.

## Fases do produto

0. Foundation
1. Trading Lab
2. Market Data and Dataset Registry
3. Backtest Engine
4. Context and Signal Engines
5. Risk Engine
6. Portfolio Manager
7. Shadow and Paper Trading
8. Execution Gateway
9. Live Trading
10. Multi-Account and Multi-Fund Governance

## Workspaces previstos

- Trading Lab
- Research
- Simulation
- Production
- Archive

No MVP, estes nomes podem ser ambientes lógicos dentro de um único workspace `System Trading`.

## Capabilities

- Research
- Market Data
- Feature Engineering
- Context Classification
- Pattern Registry
- Signal Factory
- Opportunity Aggregation
- Backtesting
- Risk
- Portfolio
- Execution
- Analytics
- Audit
- Reporting
- Notifications
- AI Assistance

## Domínios

- Strategies
- Patterns
- Contexts
- Signals
- Opportunities
- Instruments
- Markets
- Accounts
- Orders
- Positions
- Trades
- Risk Policies
- Portfolios
- Backtests
- Datasets
- Models
- Experiments
- Labs
- Funds

## Módulos iniciais

- Dashboard
- Strategies
- Patterns
- Contexts
- Labs
- Datasets
- Backtests
- Risk
- Accounts
- Reports
- Settings

## MVP funcional

O MVP deverá permitir:

1. cadastrar uma estratégia;
2. cadastrar padrões e regras determinísticas;
3. importar OHLC;
4. executar um backtest;
5. armazenar parâmetros, resultados e artefatos;
6. calcular métricas básicas;
7. classificar contexto inicial;
8. produzir eventos de shadow trading;
9. registrar decisões e vetos;
10. apresentar um dashboard mínimo.

## Regra de dogfooding

Quando o System Trading necessitar de uma capability genérica inexistente, a necessidade deverá ser analisada primeiro no System Builder. O domínio de trading não deverá duplicar autenticação, workflow, auditoria, storage, notificações ou registry sem justificativa arquitetural explícita.

## Gate de produção

Nenhuma estratégia poderá operar capital real sem:

- especificação versionada;
- testes automatizados;
- backtest com custos;
- validação fora da amostra;
- walk-forward;
- período mínimo em shadow ou paper;
- política de risco aprovada;
- capacidade de desligamento imediato;
- observabilidade operacional.

## Objetivo de longo prazo

Validar que o System Builder consegue construir, governar e evoluir sistemas institucionais complexos utilizando sua própria arquitetura.
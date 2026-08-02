# Arquitetura

## Visão geral

O System Trading será desenvolvido como produto especializado conectado ao System Builder. A plataforma genérica permanece responsável por capacidades transversais; o domínio de trading concentra regras, dados e motores específicos.

## Planos arquiteturais

### Control Plane

Responsável por configuração, governança e operação humana.

- workspaces;
- usuários e permissões;
- registries;
- workflows;
- laboratórios;
- aprovação de estratégias;
- políticas de risco;
- relatórios;
- auditoria;
- configuração de ambientes.

### Compute Plane

Responsável por processamento assíncrono e intensivo.

- market-data workers;
- feature workers;
- context workers;
- backtest workers;
- model workers;
- shadow workers;
- execution gateways;
- reconciliation workers.

### Data Plane

Responsável por persistência, cache e artefatos.

- PostgreSQL para metadados, estados e resultados estruturados;
- object storage para datasets, relatórios, modelos e artefatos;
- Redis ou fila equivalente para coordenação e jobs;
- séries temporais especializadas apenas quando a carga justificar.

## Fluxo principal

```text
Market Data
  ↓
Feature Engine
  ↓
Context Engine
  ↓
Signal Factory
  ↓
Opportunity Aggregator
  ↓
Pre-Trade Risk Gate
  ↓
Execution or Shadow Ledger
  ↓
Reconciliation
  ↓
Post-Trade Analytics
  ↓
Governance and Learning
```

## Princípios arquiteturais

- contratos antes de integrações;
- domínio independente de broker;
- eventos canônicos;
- idempotência em comandos externos;
- reprodutibilidade de experimentos;
- versionamento de estratégia e parâmetros;
- separação entre pesquisa e produção;
- observabilidade por padrão;
- segurança e segredo fora do código;
- nenhuma dependência de IA no caminho crítico de execução sem fallback determinístico.

## Fronteiras de responsabilidade

### System Builder

- identity;
- workspace;
- capability registry;
- workflow engine;
- documents;
- storage abstraction;
- notifications;
- audit;
- deployment registry;
- UI shell;
- governance primitives.

### System Trading

- market model;
- instruments;
- datasets;
- features;
- patterns;
- contexts;
- signals;
- opportunities;
- strategies;
- experiments;
- backtests;
- risk policies de trading;
- accounts;
- orders;
- positions;
- trades;
- portfolio allocation;
- broker adapters.

## Aplicações previstas

```text
apps/
  trading-web/
  trading-api/
  backtest-worker/
  market-data-worker/
  execution-gateway/

packages/
  trading-domain/
  trading-protocols/
  pattern-engine/
  context-engine/
  risk-engine/
  portfolio-engine/
  broker-adapters/
```

A criação física dessas aplicações será incremental. A documentação não autoriza abertura prematura de serviços sem necessidade operacional.

## Integração por eventos

Eventos de domínio deverão seguir envelope comum contendo:

- event id;
- event type;
- occurred at;
- correlation id;
- causation id;
- workspace id;
- environment;
- aggregate id;
- aggregate version;
- schema version;
- payload;
- actor ou producer;
- trace metadata.

## Segurança operacional

- credenciais de broker armazenadas em secret manager;
- ambientes isolados;
- permissões mínimas;
- execução real desabilitada por padrão;
- kill switch global;
- limites server-side;
- reconciliação independente do estado local;
- logs imutáveis para ações críticas.

## Resiliência

O sistema deverá tolerar:

- duplicidade de eventos;
- indisponibilidade temporária de broker;
- atraso de dados;
- reinício de workers;
- fill parcial;
- rejeição de ordem;
- divergência entre posição local e posição real;
- retomada após falha sem duplicar exposição.
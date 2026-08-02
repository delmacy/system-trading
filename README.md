# System Trading

Plataforma institucional de pesquisa, validação, governança e execução de estratégias quantitativas construída sobre o **System Builder**.

O objetivo deste repositório não é criar apenas um robô de trading. O objetivo é construir um sistema completo capaz de transformar ideias em hipóteses testáveis, estratégias auditáveis, decisões de risco controladas e operações monitoradas.

## Princípios centrais

- O mercado é soberano.
- Estratégias são hipóteses, não verdades.
- Dados prevalecem sobre opinião.
- Risco precede retorno.
- Toda decisão relevante deve ser auditável.
- O laboratório precede a produção.
- Consistência supera excepcionalidade.
- Nenhuma estratégia possui direito permanente ao capital.
- A realidade prevalece sobre a teoria.
- O sistema deve proteger o patrimônio antes de buscar retorno.

## Relação com o System Builder

O System Trading é o primeiro produto interno complexo construído sobre o System Builder. Ele funciona como projeto de dogfooding e cliente institucional da plataforma.

O System Builder fornece capacidades genéricas como:

- autenticação e autorização;
- workspaces;
- workflow;
- registry;
- documentos e storage;
- notificações;
- auditoria;
- observabilidade;
- versionamento;
- publicação de capabilities.

O System Trading fornece capacidades específicas como:

- market data;
- pattern registry;
- context engine;
- signal factory;
- opportunity aggregation;
- backtest;
- walk-forward;
- shadow trading;
- risk management;
- portfolio management;
- execution gateways;
- post-trade analytics.

## Fluxo institucional

```text
Ideia
  ↓
Hipótese
  ↓
Especificação
  ↓
Implementação
  ↓
Backtest
  ↓
Walk-forward
  ↓
Shadow trading
  ↓
Paper trading
  ↓
Micro live
  ↓
Produção
  ↓
Monitoramento
  ↓
Promoção, redução ou aposentadoria
```

## Arquitetura de alto nível

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
Risk Manager
    ↓
Execution Gateway
    ↓
Post-Trade Analytics
    ↓
Governance and Learning
```

## Estrutura documental

- `docs/00-manifesto`: princípios e filosofia;
- `docs/01-product`: visão, blueprint e roadmap;
- `docs/02-architecture`: arquitetura, domínios, eventos e capabilities;
- `docs/03-trading`: motores e processos específicos do domínio;
- `docs/04-data`: dados, datasets e métricas;
- `docs/05-ai`: agentes e esteira de IA;
- `docs/06-governance`: qualidade, versões e releases;
- `docs/07-development`: desenvolvimento, testes e esteira;
- `backlog`: épicos, features e sprints;
- `domain`: linguagem ubíqua;
- `decisions`: registros de decisões arquiteturais.

## Estado do projeto

- Classificação: produto interno;
- Fase: incubação;
- Workspace: System Trading;
- Plataforma: System Builder;
- Estratégia de entrega: incremental, auditável e orientada a evidências.

## Regra de execução

Nenhuma arquitetura deve permanecer por mais de uma sprint sem produzir uma entrega executável, observável ou testável.

## Aviso

Este projeto é uma plataforma de pesquisa e engenharia. Nenhuma estratégia, métrica ou resultado representa garantia de retorno financeiro.
# Changelog

Todas as mudanças relevantes do projeto serão registradas neste arquivo.

O formato segue a ideia de Keep a Changelog e o projeto pretende usar versionamento semântico quando aplicável.

## [Unreleased]

### Added
- pacote `trading-domain` com schema de validação para `StrategyVersion` (agregado com referências versionadas e descritores de regra declarativos).
- pacote `trading-domain` com schemas de validação para `Hypothesis`, `ExperimentDefinition` e referência versionada (`VersionedReference`).
- primeira fatia vertical executável do Trading Lab em `trading-domain`, com o caso de uso de instalação (`installTradingLab`): registra o workspace System Trading com metadados de repositório (`delmacy/system-trading`), plataforma (`system-builder`) e capacidade `trading-lab` instalada, persiste o estado em arquivo (`FileTradingLabInstallationStore`) e permite leitura de volta (`loadTradingLab`) com validação de integridade; falhas são estruturadas via `TradingLabInstallError`.
- catálogo publicado de linguagem ubíqua, decisões arquiteturais iniciais e descritor do workspace no pacote `trading-domain`, com validação e leitura de volta via API (`glossary`, `architecture-decisions`, `workspace`, `catalog`).
- pacote `trading-domain` com schema de validação para `PatternDefinition`.
- schema de validação para `ContextDefinition` com os estados de mercado documentados e os sete estados de lifecycle de definição.
- implementaçao baseline em Node.js (v24), TypeScript, npm (v11) workspaces.
- pacote `trading-protocols` com envelope de evento canônico e validação via `zod`.
- scripts locais para lint, teste (`node:test`), typecheck e build.
- workflow CI via GitHub Actions com gates rigorosos.

- documentação institucional inicial;
- manifesto e filosofia;
- visão, blueprint e roadmap;
- arquitetura, domínios, workspaces, capabilities e eventos;
- especificações dos motores de pattern, context, signal, risk, portfolio, execution, backtest e shadow;
- políticas de dados, métricas, qualidade, release e versionamento;
- backlog inicial com épicos, features e sprints;
- linguagem ubíqua;
- ADR de integração com o System Builder;
- diretrizes de contribuição e segurança.
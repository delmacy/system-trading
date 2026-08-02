# Roadmap

## Diretriz

O roadmap é orientado por capacidades demonstráveis. Cada fase deve terminar com uma entrega executável, observável ou testável.

## Fase 0 — Foundation

Objetivo: estabelecer governança, linguagem, arquitetura e integração conceitual com o System Builder.

Entregas:

- manifesto e filosofia;
- blueprint;
- arquitetura inicial;
- linguagem ubíqua;
- ADR de integração;
- backlog inicial;
- pipeline de desenvolvimento;
- estratégia de testes.

Gate de saída: repositório estruturado e primeiro épico pronto para execução.

## Fase 1 — Trading Lab

Objetivo: criar os registros fundamentais do conhecimento.

Entregas:

- Pattern Registry;
- Context Registry;
- Strategy Registry;
- Experiment Registry;
- Dataset Registry;
- interface mínima de cadastro e consulta.

Gate de saída: uma estratégia pode ser descrita e versionada sem código externo informal.

## Fase 2 — Market Data

Objetivo: ingerir, validar e consultar dados OHLC iniciais.

Entregas:

- contrato canônico de candles;
- importação CSV;
- validação de lacunas e duplicidades;
- sessões e timezone;
- catálogo de instrumentos;
- lineage do dataset.

Gate de saída: um dataset pode ser reconstruído e identificado por versão.

## Fase 3 — Backtest Engine

Objetivo: executar uma regra determinística sobre dados históricos.

Entregas:

- runner reproduzível;
- custos e slippage configuráveis;
- geração de trades simulados;
- métricas básicas;
- artefatos e logs;
- comparação entre execuções.

Gate de saída: o primeiro backtest de engolfo é reproduzível.

## Fase 4 — Context and Signal

Objetivo: separar padrão, contexto e oportunidade.

Entregas:

- Feature Engine inicial;
- Context Engine determinístico;
- Signal Factory;
- Opportunity Aggregator;
- score de qualidade inicial.

Gate de saída: múltiplas evidências formam uma hipótese única de trade.

## Fase 5 — Risk

Objetivo: controlar exposição antes de qualquer execução.

Entregas:

- políticas por trade;
- limites diários;
- limites por estratégia e conta;
- correlação e exposição agregada inicial;
- veto pré-trade;
- kill switch.

Gate de saída: toda oportunidade é aprovada, ajustada ou vetada por política explícita.

## Fase 6 — Shadow and Paper

Objetivo: validar decisões em fluxo de mercado sem risco financeiro relevante.

Entregas:

- Shadow Ledger;
- replay e tempo quase real;
- divergência entre sinal e execução simulada;
- paper accounts;
- relatórios de estabilidade.

Gate de saída: estratégia permanece observável por período definido sem intervenção manual oculta.

## Fase 7 — Execution Gateway

Objetivo: integrar execução sem acoplar o domínio ao broker.

Entregas:

- contrato de broker adapter;
- MetaTrader 5 como primeiro gateway;
- idempotência de ordens;
- reconciliação;
- eventos de rejeição e fill;
- desligamento seguro.

Gate de saída: execução de teste em ambiente controlado com reconciliação completa.

## Fase 8 — Portfolio

Objetivo: alocar capital entre estratégias, contas e ativos.

Entregas:

- capital allocation;
- health score;
- limites globais;
- redução por degradação;
- risco de concentração;
- relatórios consolidados.

Gate de saída: múltiplas estratégias são tratadas como um único portfólio de risco.

## Fase 9 — Live Controlled

Objetivo: micro live com risco reduzido e governança completa.

Entregas:

- aprovação formal;
- limites conservadores;
- monitoramento em tempo real;
- incident response;
- post-trade diário;
- rollback operacional.

Gate de saída: operação controlada sem quebra de trilha de auditoria.

## Fase 10 — Institutional Scale

Objetivo: múltiplas contas, props, brokers e fundos sob políticas globais.

Entregas:

- multi-account;
- multi-broker;
- segregação de capital;
- treasury;
- capacidade e liquidez;
- governança de modelos;
- relatórios institucionais.

## Política de priorização

A ordem pode mudar por evidência técnica, mas nenhum módulo de execução real deve ultrapassar dados, backtest, risco e observabilidade.
# Plano Inicial de Sprints

## ST-S01 — Foundation and Dogfooding

Objetivo: tornar o System Trading um projeto formal consumido pelo System Builder.

Entregas:

- workspace registrado;
- capability Trading Lab registrada;
- repositório vinculado;
- documentação base;
- linguagem ubíqua;
- evento canônico inicial;
- primeira entrega executável mínima.

Critério demonstrável: o workspace System Trading aparece na plataforma com metadados e capability instalada.

## ST-S02 — Registries

Plano executivo consolidado: [`ST-S02-SPRINT.md`](ST-S02-SPRINT.md).

Primeira task order: [`tasks/ST-S02-001.md`](tasks/ST-S02-001.md).

Objetivo: registrar conhecimento sem depender de arquivos soltos.

Entregas:

- Pattern Registry;
- Context Registry;
- Strategy Registry;
- Experiment Registry;
- Dataset Registry;
- lifecycle e versionamento.

Critério demonstrável: cadastrar e consultar uma estratégia com padrão, contexto e hipótese associados.

## ST-S03 — OHLC Dataset

Objetivo: importar e validar o primeiro dataset.

Entregas:

- instrumento;
- CSV OHLC;
- UTC;
- checksum;
- duplicidades;
- lacunas;
- relatório de qualidade;
- dataset versionado.

Critério demonstrável: importar um arquivo e reproduzir sua identificação e qualidade.

## ST-S04 — First Pattern

Objetivo: implementar o detector determinístico de engolfo.

Entregas:

- definição versionada;
- detector;
- testes unitários;
- observações persistidas;
- score inicial.

Critério demonstrável: processar candles e retornar observações reproduzíveis.

## ST-S05 — First Backtest

Objetivo: testar uma regra simples baseada no primeiro padrão.

Entregas:

- backtest specification;
- runner;
- custo e slippage;
- trades simulados;
- métricas básicas;
- relatório.

Critério demonstrável: repetir o mesmo run e obter o mesmo resultado.

## ST-S06 — Context MVP

Objetivo: classificar tendência, range, volatilidade e indefinido.

Entregas:

- features iniciais;
- context scores;
- classificação;
- testes;
- análise por contexto no backtest.

Critério demonstrável: segmentar resultados da estratégia por regime.

## ST-S07 — Opportunity and Quality

Objetivo: agrupar evidências e criar hipótese única.

Entregas:

- signal factory;
- evidence bundle;
- opportunity aggregator;
- conflitos;
- expiração;
- quality score.

Critério demonstrável: sinais relacionados geram uma oportunidade, não ordens duplicadas.

## ST-S08 — Risk MVP

Objetivo: impedir exposição fora de política.

Entregas:

- risco por trade;
- limite diário;
- máximo de posições;
- veto;
- ajuste de tamanho;
- kill switch;
- audit trail.

Critério demonstrável: oportunidades inválidas são bloqueadas com motivo verificável.

## ST-S09 — Shadow Ledger

Objetivo: executar a estratégia em replay ou fluxo atual sem ordens reais.

Entregas:

- shadow decisions;
- ordens e fills simulados;
- posição;
- latência;
- comparação com backtest;
- dashboard mínimo.

Critério demonstrável: uma sessão completa é reconstruída pela trilha de eventos.

## ST-S10 — MT5 Adapter Skeleton

Objetivo: validar contratos de execução sem capital real.

Entregas:

- broker adapter interface;
- gateway MT5 em modo seguro;
- health check;
- account snapshot;
- idempotency key;
- reconciliation skeleton;
- execução real desabilitada.

Critério demonstrável: conectar ambiente de teste e reconciliar estado sem enviar ordem real.

## Regra de sprints

Nenhuma sprint é encerrada apenas com arquitetura. Cada sprint deve produzir uma entrega demonstrável, ainda que pequena.

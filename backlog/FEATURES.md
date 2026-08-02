# Features Iniciais

## Foundation

- registrar workspace System Trading;
- registrar capability Trading Lab;
- vincular repositório e ambiente;
- definir envelope de eventos;
- definir linguagem ubíqua;
- criar ADRs iniciais;
- configurar templates de issue e PR.

## Trading Lab

- Strategy Registry;
- Pattern Registry;
- Context Registry;
- Experiment Registry;
- Dataset Registry;
- lifecycle e promoção;
- evidências e decisões.

## Market Data

- catálogo de instrumentos;
- importação CSV OHLC;
- normalização UTC;
- detecção de lacunas e duplicidades;
- versionamento e checksum;
- lineage;
- relatório de qualidade.

## Backtest

- especificação versionada;
- runner determinístico;
- modelo de custo;
- modelo de slippage;
- geração de trades;
- métricas;
- comparação de runs;
- walk-forward.

## Signal and Context

- detector de engolfo;
- features OHLC;
- tendência e range;
- signal factory;
- opportunity aggregator;
- quality score;
- expiração e conflito.

## Risk

- risco fixo por trade;
- sizing por volatilidade;
- limite diário;
- máximo de posições;
- exposição por ativo;
- correlação básica;
- veto pré-trade;
- kill switch.

## Shadow and Paper

- replay temporal;
- shadow ledger;
- paper account;
- fill simulado;
- divergência entre sinal e execução;
- relatório de estabilidade.

## Execution

- protocolo de broker adapter;
- gateway MetaTrader 5;
- idempotência;
- fills parciais;
- cancelamento;
- reconciliação;
- health check;
- circuit breaker.

## Portfolio

- visão consolidada;
- capital buckets;
- allocation policy;
- strategy health;
- concentração;
- grupos de correlação;
- redução e suspensão.

## Analytics and Governance

- dashboard;
- métricas móveis;
- drift e degradação;
- gates de promoção;
- incidentes;
- relatórios;
- auditoria;
- custos de IA e infraestrutura.
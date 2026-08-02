# Backtest Engine

## Propósito

Executar experimentos históricos reproduzíveis, comparáveis e auditáveis.

## Especificação mínima

Cada backtest deve registrar:

- estratégia e versão;
- parâmetros;
- dataset e versão;
- instrumentos;
- período;
- timeframe;
- timezone;
- regras de entrada e saída;
- modelo de custo;
- modelo de slippage;
- política de sizing;
- seed quando houver aleatoriedade;
- versão do runner;
- hash do código ou build;
- data de execução.

## Fluxo

```text
Hypothesis
  ↓
Backtest Specification
  ↓
Validation
  ↓
Execution
  ↓
Simulation Orders and Trades
  ↓
Metrics
  ↓
Artifacts
  ↓
Review Decision
```

## Métricas iniciais

- número de trades;
- taxa de acerto;
- payoff médio;
- expectativa por trade;
- lucro bruto e líquido;
- profit factor;
- drawdown máximo;
- duração de drawdown;
- sequência máxima de ganhos e perdas;
- MAE e MFE;
- custos totais;
- slippage estimado;
- distribuição por sessão, ativo e contexto.

## Proteções metodológicas

- separar in-sample e out-of-sample;
- proibir look-ahead;
- controlar survivorship bias;
- registrar transformações do dataset;
- incluir custos realistas;
- evitar seleção manual posterior de trades;
- congelar especificação antes da execução oficial;
- comparar versões por critérios definidos previamente.

## Walk-forward

O walk-forward deverá registrar janelas de treino, validação e teste, política de recalibração e resultados por período. Uma média positiva não deve ocultar longas regiões de degradação.

## Artefatos

- relatório estruturado;
- curva de capital;
- lista de trades;
- logs;
- parâmetros;
- dataset reference;
- snapshots de métricas;
- decisão de revisão.

## Gate de promoção

Backtest positivo é condição necessária, não suficiente. A promoção exige robustez fora da amostra, estabilidade por contexto, custos aceitáveis e passagem posterior por shadow ou paper.
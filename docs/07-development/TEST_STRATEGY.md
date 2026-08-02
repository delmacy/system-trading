# Estratégia de Testes

## Objetivo

Garantir confiança progressiva desde regras puras até integrações de execução.

## Pirâmide de testes

### Unitários

Cobrem regras de domínio, detectores, cálculos, políticas de risco e transformações determinísticas.

### Contrato

Validam eventos, DTOs, APIs e adapters externos.

### Integração

Validam banco, filas, storage, workers e comunicação entre módulos.

### Regressão quantitativa

Comparam resultados conhecidos de backtests, métricas e classificações de contexto.

### Replay e Shadow

Validam comportamento temporal, latência, idempotência e estabilidade em fluxo.

### End-to-End

Cobrem criação de estratégia, dataset, execução de backtest, decisão de risco e geração de relatório.

## Casos críticos

- look-ahead involuntário;
- candles fora de ordem;
- duplicidade de eventos;
- reinício de worker;
- ordem duplicada;
- fill parcial;
- rejeição de ordem;
- divergência de posição;
- ativação de kill switch;
- cálculo incorreto de risco;
- timezone e mudança de sessão;
- custos e slippage;
- precisão monetária.

## Fixtures

Fixtures devem ser pequenas, versionadas e compreensíveis. Datasets grandes ficam em object storage com checksum e referência.

## Reprodutibilidade

Testes com aleatoriedade devem fixar seed. Backtests de regressão devem registrar dataset, versão do engine e parâmetros.

## Critérios de bloqueio

Falhas em risco, execução, reconciliação, segurança ou integridade de dados bloqueiam merge e release.

## Cobertura

Cobertura numérica é indicador, não objetivo isolado. Regras críticas exigem cobertura de cenários e invariantes, mesmo quando a porcentagem global já for alta.

## MVP

O primeiro incremento deve possuir:

- testes unitários do detector de engolfo;
- validação de importação OHLC;
- teste de backtest reproduzível;
- teste de custo e slippage;
- teste do limite diário e kill switch;
- teste de idempotência de eventos.
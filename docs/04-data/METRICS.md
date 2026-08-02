# Métricas

## Objetivo

Padronizar métricas de estratégia, risco, execução e operação para permitir comparações consistentes.

## Performance

- retorno bruto e líquido;
- lucro e perda por trade;
- taxa de acerto;
- payoff médio;
- expectativa;
- profit factor;
- curva de capital;
- retorno por unidade de risco;
- retorno por sessão, ativo, estratégia e contexto.

## Risco

- drawdown máximo;
- duração do drawdown;
- volatilidade de resultados;
- pior dia, semana e mês;
- sequência máxima de perdas;
- exposição média e máxima;
- concentração;
- correlação;
- utilização de limite;
- violações de política.

## Trade analytics

- MAE;
- MFE;
- tempo até gain ou stop;
- duração do trade;
- slippage;
- custo total;
- distância de entrada ao stop e ao alvo;
- resultado por quality score;
- resultado por regime de contexto;
- resultado por horário.

## Operação

- latência por etapa;
- taxa de erro;
- rejeição de ordens;
- fills parciais;
- divergências de reconciliação;
- disponibilidade de workers;
- backlog de filas;
- consumo de CPU, memória, storage e IA.

## Saúde de estratégia

- expectativa móvel;
- taxa de acerto móvel;
- payoff móvel;
- drawdown relativo ao histórico;
- mudança de frequência;
- mudança de distribuição por contexto;
- drift de features;
- diferença entre backtest, shadow, paper e live.

## Regras

- toda métrica deve ter definição formal;
- janela, frequência e universo devem ser explícitos;
- resultados brutos e líquidos devem ser separados;
- métricas não podem mudar de fórmula sem nova versão;
- métricas com amostra insuficiente devem indicar baixa confiança;
- nenhuma métrica isolada decide promoção ou aposentadoria.
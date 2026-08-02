# Signal Engine e Opportunity Aggregator

## Propósito

Separar evidências de mercado de decisões de operação. O Signal Engine produz sinais atômicos; o Opportunity Aggregator combina sinais compatíveis em uma única hipótese de trade.

## Signal Factory

Um sinal deve registrar:

- tipo;
- direção;
- instrumento;
- timeframe;
- timestamp;
- origem;
- versão do detector ou regra;
- score;
- contexto observado;
- validade temporal;
- evidências;
- parâmetros;
- motivo de invalidação.

## Famílias de evidência

- direção;
- localização;
- rejeição;
- continuação;
- volatilidade;
- espaço;
- execução.

## Opportunity Aggregator

O agregador evita transformar cada sinal em um trade independente.

Exemplo:

```text
Engolfo de alta
+ rejeição em suporte
+ contexto de tendência
+ espaço até resistência
= uma única Trade Hypothesis
```

## Trade Hypothesis

Campos mínimos:

- direção;
- zona de entrada;
- invalidação;
- alvo ou política de saída;
- evidências agrupadas;
- contexto;
- expectativa estimada;
- custos estimados;
- validade;
- conflitos;
- quality score;
- versão da estratégia candidata.

## Trade Quality Score inicial

Composição de referência:

- 25% contexto;
- 25% localização;
- 20% padrão;
- 15% espaço;
- 10% execução;
- 5% saúde da estratégia.

Os pesos são hipótese inicial e deverão ser versionados e calibrados.

## Regras de conflito

- sinais opostos devem reduzir score ou bloquear a hipótese conforme política;
- sinais duplicados da mesma família não devem inflar artificialmente a confiança;
- oportunidades concorrentes no mesmo instrumento devem ser avaliadas em conjunto;
- correlação entre instrumentos deve ser tratada pelo Risk Engine;
- uma oportunidade expirada não pode ser reativada sem nova avaliação.

## Saídas

O agregador pode produzir:

- `rejected`;
- `watch`;
- `eligible`;
- `premium_candidate`;
- `expired`.

A aprovação final pertence ao Pre-Trade Risk Gate.
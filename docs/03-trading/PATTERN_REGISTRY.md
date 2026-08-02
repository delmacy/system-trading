# Pattern Registry

## Propósito

O Pattern Registry preserva definições, critérios, versões e evidências relacionadas a padrões de mercado. Ele não transforma padrões diretamente em ordens.

## Estrutura mínima de uma definição

- `pattern_id`;
- nome;
- família;
- descrição;
- versão;
- mercados elegíveis;
- timeframes elegíveis;
- dados necessários;
- critérios determinísticos;
- parâmetros;
- tolerâncias;
- contextos favoráveis;
- contextos desfavoráveis;
- sinais de invalidação;
- referências;
- status;
- autor e data;
- detector associado.

## Famílias iniciais

- candle structure;
- rejection;
- continuation;
- breakout;
- failed breakout;
- pullback;
- support and resistance;
- double top and double bottom;
- volatility structure.

## Padrões iniciais

- engolfo de alta;
- engolfo de baixa;
- martelo;
- estrela cadente;
- H2/L2;
- pullback;
- rompimento;
- falso rompimento;
- topo duplo;
- fundo duplo;
- suporte e resistência.

## Observação de padrão

Uma observação deve registrar:

- instrumento;
- timeframe;
- timestamp;
- versão do detector;
- parâmetros;
- score;
- direção sugerida;
- evidências calculadas;
- dados de origem;
- contexto disponível;
- resultado posterior apenas como dado analítico, nunca como parte da detecção original.

## Ciclo de vida

- Draft
- Experimental
- Validated
- Active
- Degraded
- Deprecated
- Archived

## Regras

- alterações de critério geram nova versão;
- detectores devem ser testáveis isoladamente;
- score não representa probabilidade sem calibração;
- um padrão pode existir sem gerar oportunidade;
- referências históricas não substituem validação no mercado e período de interesse;
- nenhum padrão será descartado apenas por fase ruim; seu peso e elegibilidade podem mudar conforme evidência.
# Modelo de Mercado

## Objetivo

Definir os conceitos canônicos usados por dados, pesquisa, backtest, risco e execução.

## Entidades fundamentais

### Market

Ambiente econômico e operacional em que instrumentos são negociados, como ações, futuros, Forex ou cripto.

### Venue

Bolsa, corretora, exchange ou provedor de execução específico.

### Instrument

Ativo negociável identificado por símbolo, classe, moeda de cotação, tamanho de contrato, tick size, valor por tick, sessão e regras de negociação.

### Session

Janela de negociação com timezone, calendário, feriados, intervalos e regras de rollover.

### Candle

Representação OHLCV em um intervalo temporal conhecido, com origem e qualidade identificáveis.

### Tick

Evento de preço ou negócio individual. A definição exata depende do provedor e deve registrar se representa bid, ask, last ou trade.

### Spread

Diferença entre preços executáveis de compra e venda. Deve ser modelado explicitamente em simulações quando relevante.

### Liquidity

Capacidade estimada de execução sem impacto excessivo. No MVP pode ser aproximada por spread, volume, horário e tamanho relativo da ordem.

## Timeframes

Timeframe é uma agregação de dados, não uma propriedade da estratégia. Estratégias podem consumir múltiplos timeframes, mas cada observação deve registrar sua origem temporal.

## Timezone e calendário

Todo timestamp persistido deve ser normalizado em UTC. Sessões, relatórios e regras podem ser exibidos no timezone do mercado ou do usuário, sempre com conversão explícita.

## Qualidade de dados

Cada série deve permitir identificar:

- origem;
- período;
- timezone;
- resolução;
- lacunas;
- duplicidades;
- ajustes;
- versão;
- data de ingestão;
- transformações aplicadas.

## Ajustes e continuidade

Contratos futuros, splits, dividendos e mudanças de símbolo exigem políticas específicas. Séries ajustadas e não ajustadas devem ser identificadas separadamente.

## Regra de neutralidade

Motores de estratégia não devem depender diretamente do formato de um fornecedor. Adaptadores convertem dados externos para contratos canônicos.
# Context Engine

## Propósito

Classificar o estado do mercado por scores e evidências, evitando decisões binárias prematuras.

## Estados iniciais

- tendência de alta;
- tendência de baixa;
- range;
- canal;
- compressão;
- expansão;
- alta volatilidade;
- baixa volatilidade;
- exaustão;
- tentativa de reversão;
- indefinido.

## Saída canônica

```json
{
  "trend_up_score": 0,
  "trend_down_score": 0,
  "range_score": 0,
  "channel_score": 0,
  "compression_score": 0,
  "expansion_score": 0,
  "reversal_risk": 0,
  "volatility_regime": "normal",
  "dominant_state": "undefined",
  "confidence": 0,
  "engine_version": "0.1.0"
}
```

## Evidências possíveis

- estrutura de máximas e mínimas;
- inclinação e separação de médias;
- ATR e sua variação;
- amplitude relativa;
- sobreposição de candles;
- frequência de rompimentos falhos;
- distância até zonas relevantes;
- persistência direcional;
- tempo dentro de faixa;
- expansão ou contração de range.

## Máquina de estados de referência

```text
RANGE
  ↓
BREAKOUT
  ↓
TREND
  ↓
PULLBACK
  ↓
TREND RESUMPTION
  ↓
CLIMAX
  ↓
REVERSAL ATTEMPT
  ↓
NEW RANGE
```

A máquina de estados é uma hipótese operacional e deve ser versionada.

## Regras

- contexto não gera ordem sozinho;
- múltiplos estados podem coexistir com scores diferentes;
- score não é probabilidade sem calibração;
- classificações devem registrar dados, parâmetros e versão;
- mudanças de regime devem ser avaliadas quanto a atraso e estabilidade;
- o motor deve produzir `undefined` quando não houver evidência suficiente.

## MVP

O primeiro motor deverá usar apenas OHLC e regras determinísticas para classificar tendência, range, volatilidade e estado indefinido.
# Market Data Pipeline

## Objetivo

Ingerir, normalizar, validar e disponibilizar dados de mercado por contratos independentes de fornecedor.

## Etapas

```text
Source
  ↓
Adapter
  ↓
Raw Storage
  ↓
Schema Validation
  ↓
Normalization
  ↓
Quality Checks
  ↓
Dataset Version
  ↓
Consumers
```

## Contrato inicial de candle

- instrument id;
- timeframe;
- open time UTC;
- close time UTC;
- open;
- high;
- low;
- close;
- volume quando disponível;
- spread quando disponível;
- source;
- ingestion timestamp;
- quality flags.

## Validações iniciais

- ordenação temporal;
- duplicidade;
- OHLC consistente;
- intervalos ausentes;
- valores inválidos;
- timezone conhecido;
- sessão conhecida;
- símbolo mapeado;
- resolução compatível.

## Dados brutos e normalizados

Dados brutos devem ser preservados como recebidos. Dados normalizados devem ser derivados, versionados e reproduzíveis.

## Fontes iniciais

O MVP começa com importação CSV. Integrações com MetaTrader, APIs de broker ou provedores externos entram por adaptadores posteriores.

## Regras

- nenhuma estratégia lê diretamente arquivos de fornecedor;
- consumidores usam contratos canônicos;
- falhas de qualidade devem ser propagadas;
- lacunas não podem ser silenciosamente preenchidas sem política explícita;
- agregações de timeframe devem registrar método e versão;
- dados futuros não podem vazar para cálculos históricos.
# Dataset Registry

## Propósito

Garantir que todo experimento possa identificar exatamente os dados utilizados.

## Metadados mínimos

- `dataset_id`;
- nome e descrição;
- origem e licença;
- instrumentos;
- resolução;
- período;
- timezone;
- schema;
- versão;
- checksum;
- transformações;
- ajustes;
- lacunas conhecidas;
- relatório de qualidade;
- local do artefato;
- data de ingestão;
- responsável.

## Ciclo de vida

- Draft
- Importing
- Validating
- Ready
- Restricted
- Deprecated
- Archived

## Versionamento

Qualquer alteração de conteúdo, limpeza, ajuste ou transformação que possa mudar o resultado de um experimento gera nova versão.

## Lineage

Datasets derivados devem apontar para:

- dataset de origem;
- transformação executada;
- versão do código;
- parâmetros;
- timestamp;
- artefato de saída.

## Regras

- arquivos brutos não devem ser sobrescritos;
- resultados de backtest referenciam versão imutável;
- datasets incompletos ou suspeitos devem ser explicitamente marcados;
- dados de provedores com restrição não podem ser redistribuídos indevidamente;
- timezone e calendário devem ser conhecidos antes de uso;
- dados sintéticos devem ser claramente identificados.

## MVP

O primeiro registro suportará arquivos CSV OHLC, checksum, schema, instrumento, timeframe, período e relatório básico de duplicidades, ordenação e lacunas.
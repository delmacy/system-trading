# ADR-0002 — Contratos de Registry e Ciclo de Vida

## Status

Proposed

## Contexto

A sprint `ST-S02` entrega cinco registries de domínio: Pattern, Context, Dataset, Hypothesis/Experiment e Strategy. `ST-S02-001` materializou o contrato de Pattern Definition com seu ciclo de vida documentado. Os demais agregados ainda possuem gaps documentais: campos mínimos, identificadores, chave de versão, referências entre agregados e regras de criação, publicação, depreciação e imutabilidade não estão explícitos o suficiente para serem implementados sem invenção.

Sem uma decisão registrada, cada executor poderia criar taxonomias divergentes ou regras implícitas, comprometendo a rastreabilidade e a comparabilidade exigidas por `docs/06-governance/VERSIONING.md`.

## Decisão

### 1. Chave de identidade e versão

- Agregados de definição (Pattern, Context, Hypothesis, Experiment, Strategy Version): chave de versão composta por `(aggregate_id, version)`, em que `aggregate_id` é UUID imutável e `version` é versionamento semântico.
- Dataset: `dataset_id` UUID imutável, versão explícita e `checksum` imutável da versão, conforme `docs/04-data/DATASETS.md` e `docs/06-governance/VERSIONING.md`.

### 2. Ciclo de vida das definições

Reutilizar o ciclo de vida documentado e já implementado de Pattern Definition como ciclo canônico das definições versionadas:

- `Draft`, `Experimental`, `Validated`, `Active`, `Degraded`, `Deprecated`, `Archived`.

Aplicar o mesmo conjunto de estados a Context Definition, Hypothesis, Experiment Definition e Strategy Version, porque todos são definições versionadas que passam por validação, ativação, degradação e aposentadoria. Cada agregado interpreta o significado de cada estado de forma específica, conforme `docs/03-trading/REGISTRY_CONTRACTS.md`.

### 3. Ciclo de vida do Dataset

Manter o ciclo de vida documentado e específico de dados em `docs/04-data/DATASETS.md`:

- `Draft`, `Importing`, `Validating`, `Ready`, `Restricted`, `Deprecated`, `Archived`.

### 4. Regras de versão e imutabilidade

- Alterações de critérios, parâmetros, conteúdo ou regras geram nova versão; nenhuma versão publicada é sobrescrita.
- Publicar significa tornar uma versão imutável e referenciável; correções geram novas versões (`PATCH`), não edição da publicada.
- Depreciação não remove dados: versões deprecated permanecem legíveis para auditoria e comparação, mas deixam de ser elegíveis para novas referências.
- Promoção seleciona uma versão específica e seus artefatos associados, nunca uma ideia abstrata.
- A garantia de imutabilidade de versões publicadas pertence ao adaptador de persistência oficial (`ST-S02-009`); o domínio declara o contrato, não simula a garantia.

### 5. Referências entre agregados

- Referências são sempre `(id, version)` apontando para uma versão específica de outro agregado, nunca para um nome ou registro abstrato.
- Strategy Version referencia, no mínimo, hypothesis, experiment e dataset eligibility; pode referenciar pattern e context.
- Experiment Definition referencia hypothesis e dataset; pode referenciar pattern e context.
- As relações obrigatórias e opcionais estão especificadas em `docs/03-trading/REGISTRY_CONTRACTS.md`.

## Consequências positivas

- implementações `ST-S02-003` a `ST-S02-006` sem invenção de campos, estados ou regras;
- comparabilidade e rastreabilidade preservadas conforme `VERSIONING.md`;
- chave de versão uniforme entre definições, reduzindo erros de referência;
- imutabilidade e promoção com semântica única para todos os registries.

## Consequências negativas

- define explicitamente um ciclo de vida canônico de definições, que precisa ser revisado e aprovado antes de `ST-S02-003`;
- Dataset diverge intencionalmente das definições, exigindo tratamento distinto no executor;
- regras de transição entre estados permanecem fora do escopo e devem ser propostas por task específica, se necessárias.

## Alternativas consideradas

### Um ciclo de vida genérico para todos os agregados, incluindo Dataset

Rejeitada: Dataset possui semântica própria de ingestão (`Importing`, `Validating`, `Ready`) incompatível com o ciclo de definição. Um ciclo único genérico obrigaria estados sem sentido para dados.

### Ciclos de vida divergentes por agregado sem referência comum

Rejeitada: fragmentaria a semântica de validação/ativação/aposentadoria e obrigaria cada executor a inventar estados.

### Adiar a decisão para a implementação

Rejeitada: `ST-S02-002` existe exatamente para fechar os gaps documentais antes da implementação, evitando invenção.

## Regra de aplicação

O documento `docs/03-trading/REGISTRY_CONTRACTS.md` é a fonte única dos campos mínimos, identificadores, chaves de versão, referências, ciclos de vida e regras de versionamento dos cinco agregados. Qualquer desvio exige novo ADR ou ordem de compatibilidade.

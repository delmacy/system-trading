# Registry Contracts

## Propósito

Fechar os gaps documentais dos contratos de Context, Dataset, Hypothesis, Experiment e Strategy da sprint `ST-S02`, antes da implementação. Este documento é a fonte única dos campos mínimos, identificadores, chaves de versão, referências, ciclos de vida e regras de versionamento dos cinco agregados.

A decisão estrutural de ciclo de vida e versionamento está registrada em `../../decisions/ADR-0002-registry-contracts-and-lifecycle.md`.

## Convenções comuns

- **Chave de versão**: `(aggregate_id, version)`, com `aggregate_id` UUID imutável.
- **Versionamento semântico** (semver) para definições: `MAJOR.MINOR.PATCH` conforme `../06-governance/VERSIONING.md`.
- **Timestamp**: UTC ISO-8601 (`authored_at`, `ingested_at`).
- **Valores abertos**: parâmetros e critérios usam `unknown` em schemas runtime, nunca `any` explícito.
- **Imutabilidade**: versão publicada não é sobrescrita; correções geram nova versão. A garantia de persistência é do adaptador oficial (`ST-S02-009`), não do domínio.
- **Referências**: sempre `(id, version)` de uma versão específica, nunca um nome abstrato.

## Ciclo de vida

### Definições versionadas

Ciclo canônico das definições (Context, Hypothesis, Experiment, Strategy Version), compatível com o Pattern Definition:

```text
Draft -> Experimental -> Validated -> Active -> Degraded -> Deprecated -> Archived
```

Semântica por estado:

| Estado | Significado |
| --- | --- |
| `Draft` | em elaboração, ainda não publicada; não referenciável. |
| `Experimental` | publicada para pesquisa/experimentos, não para produção. |
| `Validated` | aprovada por critérios definidos previamente, ainda não ativa. |
| `Active` | utilizada ativamente por estratégias ou processos vigentes. |
| `Degraded` | evidência relevante de deterioração; peso e elegibilidade podem mudar. |
| `Deprecated` | fora de uso; permanece legível para auditoria, sem novas referências. |
| `Archived` | registro histórico somente leitura. |

### Dataset

Ciclo de vida específico de dados, conforme `../04-data/DATASETS.md`:

```text
Draft -> Importing -> Validating -> Ready -> Restricted -> Deprecated -> Archived
```

---

## 1. Context Registry — Context Definition

### Identidade e versão

- `context_id`: UUID imutável.
- Chave de versão: `(context_id, version)` com semver.

### Campos mínimos

- `context_id`: string UUID.
- `name`: string não vazia.
- `description`: string não vazia.
- `version`: semver válido.
- `supported_states`: lista não vazia de estados de mercado suportados, restritos ao conjunto documentado em `./CONTEXT_ENGINE.md` (tendência de alta, tendência de baixa, range, canal, compressão, expansão, alta volatilidade, baixa volatilidade, exaustão, tentativa de reversão, indefinido).
- `required_features`: lista não vazia de features requeridas para classificação.
- `parameters`: record de valores abertos (`unknown`).
- `lifecycle`: um dos sete estados de definição.
- `author`: string não vazia.
- `authored_at`: timestamp UTC ISO-8601.
- `references`: lista de referências externas (opcional, strings não vazias).

### Relações

- Pode ser referenciada por `Strategy Version` (`context_references`).
- Não referencia outros agregados obrigatoriamente.

### Regras

- Alteração de estados suportados, features requeridas ou parâmetros gera nova versão.
- Versão publicada é imutável.
- `supported_states` deve conter apenas estados do conjunto documentado.

---

## 2. Dataset Registry — Dataset Definition

### Identidade e versão

- `dataset_id`: UUID imutável.
- Chave de versão: `dataset_id` + versão explícita + `checksum` imutável, conforme `../06-governance/VERSIONING.md` e `../04-data/DATASETS.md`.

### Campos mínimos

- `dataset_id`: string UUID.
- `name`: string não vazia.
- `description`: string não vazia.
- `source`: string não vazia (origem).
- `license`: string não vazia.
- `instruments`: lista não vazia de instrumentos.
- `resolution`: string não vazia (timeframe/resolução).
- `period`: início e fim do período coberto.
- `timezone`: string não vazia (timezone do calendário de dados).
- `schema_reference`: string não vazia (schema/versão).
- `version`: versão explícita.
- `checksum`: string imutável que identifica o conteúdo da versão.
- `transformations`: lista de transformações aplicadas (pode ser vazia).
- `adjustments`: lista de ajustes (pode ser vazia).
- `known_gaps`: lista de lacunas conhecidas (pode ser vazia).
- `quality_report_reference`: string (opcional).
- `artifact_location`: string não vazia (local do artefato).
- `ingested_at`: timestamp UTC ISO-8601.
- `owner`: string não vazia (responsável).
- `lifecycle`: um dos sete estados de dados.
- `lineage`: lista de origem derivada `(dataset_id, version, transformation, code_version, parameters, timestamp, output_artifact)` quando derivado (opcional).

### Relações

- Referenciado por `Experiment Definition` (`dataset_references`) e por `Strategy Version` (`dataset_eligibility`).
- `lineage` referencia um dataset de origem e versão específica.

### Regras

- Qualquer alteração de conteúdo, limpeza, ajuste ou transformação que possa mudar resultado de experimento gera nova versão.
- Arquivos brutos não são sobrescritos.
- Datasets incompletos ou suspeitos devem ser explicitamente marcados (`Restricted`, `Deprecated`).
- Dados sintéticos devem ser claramente identificados.

---

## 3. Hypothesis Registry — Hypothesis

### Identidade e versão

- `hypothesis_id`: UUID imutável.
- Chave de versão: `(hypothesis_id, version)` com semver.

### Campos mínimos

- `hypothesis_id`: string UUID.
- `statement`: afirmação testável, string não vazia.
- `description`: string não vazia.
- `version`: semver válido.
- `subject`: domínio do comportamento testado (mercado, estratégia, risco ou execução), string não vazia.
- `testability_criteria`: critérios que tornam a hipótese testável, lista não vazia.
- `lifecycle`: um dos sete estados de definição.
- `author`: string não vazia.
- `authored_at`: timestamp UTC ISO-8601.
- `references`: lista de referências externas (opcional).

### Relações

- Referenciada obrigatoriamente por `Experiment Definition` (`hypothesis_reference`) e por `Strategy Version` (`hypothesis_reference`).
- Pode referenciar `Pattern Definition` e `Dataset Definition` opcionalmente.

### Regras

- A hipótese deve ser testável: `statement` e `testability_criteria` não vazios.
- Alteração da afirmação ou dos critérios de testabilidade gera nova versão.

---

## 4. Experiment Registry — Experiment Definition

### Identidade e versão

- `experiment_id`: UUID imutável.
- Chave de versão: `(experiment_id, version)` com semver.

### Campos mínimos

- `experiment_id`: string UUID.
- `name`: string não vazia.
- `description`: string não vazia.
- `version`: semver válido.
- `hypothesis_reference`: `(hypothesis_id, version)` obrigatório.
- `dataset_references`: lista não vazia de `(dataset_id, version)`.
- `pattern_references`: lista de `(pattern_id, version)` (opcional).
- `context_references`: lista de `(context_id, version)` (opcional).
- `prior_criteria`: critérios definidos antes da execução, lista não vazia.
- `parameters`: record de valores abertos (`unknown`).
- `lifecycle`: um dos sete estados de definição.
- `author`: string não vazia.
- `authored_at`: timestamp UTC ISO-8601.

### Relações

- Obrigatório: hypothesis e pelo menos um dataset.
- Referenciado por `Strategy Version` (`experiment_reference`).

### Regras

- `prior_criteria` é obrigatório e não pode ser vazio: a definição deve registrar critérios antes de qualquer avaliação.
- Estados de execução (`running`, `completed`) pertencem a `Experiment Run`, fora do escopo de `ST-S02`.
- Alteração de critérios prévios, hipótese ou datasets gera nova versão.

---

## 5. Strategy Registry — Strategy Version

### Identidade e versão

- `strategy_id`: UUID imutável (agregado).
- Chave de versão: `(strategy_id, version)` com semver.
- `Strategy` é o agregado; `Strategy Version` é a versão imutável publicada.

### Campos mínimos

- `strategy_id`: string UUID.
- `version`: semver válido.
- `name`: string não vazia.
- `description`: string não vazia.
- `hypothesis_reference`: `(hypothesis_id, version)` obrigatório.
- `experiment_reference`: `(experiment_id, version)` obrigatório.
- `pattern_references`: lista não vazia de `(pattern_id, version)`.
- `context_references`: lista não vazia de `(context_id, version)`.
- `dataset_eligibility`: lista não vazia de `(dataset_id, version)`.
- `parameter_set`: record de valores abertos (`unknown`), não vazio.
- `rule_descriptors`:
  - `entry_rules`: lista não vazia de descritores.
  - `exit_rules`: lista não vazia de descritores.
  - `management_rules`: lista de descritores.
  - `eligibility_rules`: lista não vazia de descritores.
- `lifecycle`: um dos sete estados de definição.
- `author`: string não vazia.
- `authored_at`: timestamp UTC ISO-8601.
- `references`: lista de referências externas (opcional).

### Relações

- Obrigatórias e não vazias: hypothesis, experiment, patterns, contexts e dataset eligibility.
- Todos os descritores de regra são descritivos e versionados; nenhuma lógica de execução pertence ao contrato.

### Regras

- Nenhuma lista obrigatória pode ser vazia.
- Descritores de regra são declaração, não execução.
- Alteração de regras, parâmetros, hipótese ou referências gera nova versão.
- Versão publicada é imutável; promoção seleciona uma versão específica e seus artefatos.

---

## Compatibilidade com VERSIONING.md

| Regra de `VERSIONING.md` | Aplicação neste contrato |
| --- | --- |
| Semver para definições | Context, Hypothesis, Experiment, Strategy Version usam semver. |
| Identificador imutável + checksum + versão para datasets | Dataset usa `dataset_id` + versão explícita + `checksum`. |
| Versões publicadas não são sobrescritas | Contrato declara imutabilidade; adaptador de persistência a garante. |
| Correções geram novas versões | Toda alteração de critério/conteúdo gera nova versão. |
| Promoção seleciona versão e artefatos | Strategy Version publicada é referenciável por versão específica. |
| Mudanças de schema indicam migração | Novos campos exigem MINOR/MAJOR conforme impacto. |

## Checklist de cobertura

| Agregado | Identidade | Chave de versão | Lifecycle | Relações obrigatórias |
| --- | --- | --- | --- | --- |
| Context Definition | `context_id` UUID | `(context_id, version)` semver | 7 estados de definição | nenhuma |
| Dataset Definition | `dataset_id` UUID | `dataset_id` + versão + `checksum` | 7 estados de dados | `lineage` quando derivado |
| Hypothesis | `hypothesis_id` UUID | `(hypothesis_id, version)` semver | 7 estados de definição | nenhuma (referenciada por outros) |
| Experiment Definition | `experiment_id` UUID | `(experiment_id, version)` semver | 7 estados de definição | hypothesis + dataset(s) |
| Strategy Version | `strategy_id` UUID | `(strategy_id, version)` semver | 7 estados de definição | hypothesis, experiment, patterns, contexts, datasets |

## Limites

- Nenhum código de produção, persistência, UI ou abstração genérica de registry é introduzido por este documento.
- Estados de execução de experimento, métricas calculadas e evidências produzidas estão fora de `ST-S02`.
- Contratos congelados do System Builder (`EventEnvelope`, `WorkspaceContext`, `AuthenticatedActor`, `DomainEvent`, `CapabilityDefinition`) não são alterados.

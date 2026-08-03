# Contratos de Registries e Ciclo de Vida

Este documento é a fonte normativa dos contratos de Context, Dataset, Hypothesis, Experiment e Strategy para o Sprint `ST-S02`. Ele especifica campos mínimos, identificadores, chave de versão, ciclo de vida, regras de criação, publicação, depreciação e imutabilidade de cada agregado, para que as tasks de implementação (`ST-S02-003` a `ST-S02-006`) não precisem inventar regras.

O contrato de **Pattern Definition** já foi materializado em `ST-S02-001` (`packages/trading-domain/src/pattern-definition.ts`) e segue `docs/03-trading/PATTERN_REGISTRY.md`. Ele não é redefinido aqui; é citado como referência consumida.

A decisão arquitetural que fundamenta este documento está em `decisions/ADR-0002-registry-contracts-and-lifecycle.md`.

## Propósito

Garantir que cada registro seja registrável e consultável por identificador e versão, com relações explícitas e sem nenhuma regra implícita para o executor inferir depois.

## Princípios comuns

Aplicam-se a todos os agregados versionados desta sprint:

- **Identidade**: `x_id` UUID estável, criado uma única vez e imutável; `version` explícita.
- **Chave de versão**: `(x_id, version)` é única; consultar sempre por id + versão.
- **Timestamps**: UTC ISO-8601 para `created_at` e `updated_at`.
- **Autoria**: `owner` (referência de ator) obrigatório.
- **Referências**: sempre tipadas por `{x_id, version}` da entidade referenciada; apontam para versões imutáveis quando o referenciador publica.
- **Imutabilidade**: uma versão imutável a partir do estado definido por agregado; correção gera nova versão, nunca sobrescreve.
- **Valores abertos**: parâmetros e critérios usam `unknown` estruturado, sem `any` explícito.
- **UTC**: datas em UTC.

## Checklist de cobertura dos cinco registries

| Registro | Campos mínimos | Identificador | Ciclo de vida | Chave de versão | Relações explícitas | Imutável a partir de |
| --- | --- | --- | --- | --- | --- | --- |
| Context Definition | seção 3 | `context_id` + `version` | 3.3 | `(context_id, version)` | features, engine | `Experimental` |
| Dataset | seção 4 | `dataset_id` + `version` + `checksum` | 4.3 | `(dataset_id, version)` + checksum | lineage (derivados) | `Ready` / `Restricted` |
| Hypothesis | seção 5 | `hypothesis_id` + `version` | 5.3 | `(hypothesis_id, version)` | patterns, contexts, datasets | `Proposed` |
| Experiment Definition | seção 6 | `experiment_id` + `version` | 6.3 | `(experiment_id, version)` | hypothesis, datasets, patterns, contexts | `Defined` |
| Strategy Version | seção 7 | `strategy_id` + `version` | 7.3 | `(strategy_id, version)` | hypothesis, experiment, patterns, contexts, datasets | `Published` |

---

## 3. Context Definition (Context Registry)

Contrato que descreve uma definição de contexto de mercado (classificador) sem executar classificação.

### Identidade

- `context_id`: UUID imutável.
- `version`: semantic version.

### Campos mínimos

- `context_id`;
- `name` (obrigatório, não vazio);
- `description` (obrigatório, não vazio);
- `version` (semver válido);
- `supported_market_states` (obrigatório, não vazio; vocabulário na seção 3.2);
- `required_features` (lista de `{feature_name, version}`; vazio permitido em MVP — motor OHLC; não vazio exigido para `Validated`/`Active`);
- `parameters` (mapa de parâmetros do classificador; valores estruturados);
- `engine_compatibility` (opcional; versão do engine referenciado);
- `owner`;
- `created_at`, `updated_at`.

### Estados suportados (vocabulário)

`tendencia_de_alta`, `tendencia_de_baixa`, `range`, `canal`, `compressao`, `expansao`, `alta_volatilidade`, `baixa_volatilidade`, `exaustao`, `tentativa_de_reversao`, `indefinido`.

### Ciclo de vida

`Draft` → `Experimental` → `Validated` → `Active` → `Deprecated` → `Archived`

- `Draft`: edição; não referenciável.
- `Experimental`: validado (campos mínimos presentes); imutável; referenciável.
- `Validated`: `required_features` não vazio antes da transição.
- `Active`: escolhido para uso corrente.
- `Deprecated`: substituído ou descontinuado.
- `Archived`: encerrado; terminal.

Transições: `Draft → Experimental`; `Experimental → Validated`; `Validated → Active`; `Active → Deprecated`; `Deprecated → Archived`. Qualquer transição direta para `Archived` exige justificativa auditável.

> Nota: `Degraded` não é estado da definição; degradação refere-se à observação/engine e está fora desta sprint.

## 4. Dataset Registry

Contrato que descreve os metadados e a versão de um dataset sem ingerir dados.

### Identidade

- `dataset_id`: UUID imutável.
- `version`: versão explícita; conteúdo identificado por `checksum`.

### Campos mínimos (base: `docs/04-data/DATASETS.md`)

- `dataset_id`, `name`, `description`;
- `source` (origem), `license`;
- `instruments` (não vazio);
- `resolution` (timeframe);
- `period` (`{start, end}` com `start <= end`);
- `timezone` (IANA);
- `schema` (referência ao schema dos dados);
- `version`;
- `checksum` (SHA-256 do conteúdo ou equivalente);
- `transformations` (lista);
- `adjustments` (lista);
- `known_gaps` (lista);
- `quality_report` (referência);
- `artifact_location`;
- `ingested_at` (UTC);
- `owner`;
- `lineage` (para derivados): `origin_dataset` (`{dataset_id, version}`), `transformation`, `code_version`, `parameters`, `executed_at`, `output_artifact`;
- `lifecycle`.

### Ciclo de vida

`Draft` → `Importing` → `Validating` → `Ready` → `Restricted` → `Deprecated` → `Archived`

- `Draft`: metadados em construção.
- `Importing`: ingestão em andamento.
- `Validating`: validação (duplicidades, ordenação, lacunas).
- `Ready`: versão imutável; disponível para uso.
- `Restricted`: acesso restrito por licença; imutável.
- `Deprecated`: descontinuado, ainda sem nova versão.
- `Archived`: encerrado; terminal.

Transições: `Draft → Importing`; `Importing → Validating`; `Validating → Ready`; `Ready → Restricted`; `Ready/Restricted → Deprecated`; `Deprecated → Archived`. A remoção de restrição (`Restricted → Ready`) exige autorização e justificativa auditável.

### Regras de versão e checksum

Qualquer alteração de conteúdo, limpeza, ajuste ou transformação que possa mudar o resultado de um experimento gera nova versão. O `checksum` da versão é fixado em `Ready`; correção gera nova versão, nunca sobrescreve.

## 5. Hypothesis Registry

### Identidade

- `hypothesis_id`: UUID imutável.
- `version`: semantic version.

### Campos mínimos

- `hypothesis_id`;
- `name` (obrigatório);
- `description` (obrigatório);
- `claim` (afirmação testável; obrigatória, não vazia);
- `subject_area`: `market` | `strategy` | `risk` | `execution`;
- `falsifiable_criteria` (obrigatório para `Testable` e sucessores);
- `version`;
- `references`: `patterns` (lista), `contexts` (lista), `datasets` (lista; ao menos um para `Testable`);
- `owner`;
- `created_at`, `updated_at`;
- `lifecycle`.

### Ciclo de vida

`Draft` → `Proposed` → `Testable` → `Supported` → `Contradicted` → `Superseded` → `Archived`

- `Draft`: edição; não referenciável.
- `Proposed`: finalizada pelo autor; imutável; referenciável.
- `Testable`: critérios falsificáveis + ao menos um dataset válido; elegível para planejar experimento.
- `Supported`: evidência de experimento suporta.
- `Contradicted`: evidência contradiz.
- `Superseded`: substituída por hipótese mais recente.
- `Archived`: terminal.

Transições: `Draft → Proposed`; `Proposed → Testable` (invariantes de critérios/referências); `Testable → Supported/Contradicted`; `Supported/Contradicted → Superseded`; qualquer → `Archived`.

## 6. Experiment Registry (Experiment Definition)

### Identidade

- `experiment_id`: UUID imutável.
- `version`: semantic version.

### Campos mínimos

- `experiment_id`;
- `name`, `description`;
- `version`;
- `hypothesis` (referência obrigatória, exatamente uma);
- `prior_criteria` (critérios prévios de aceite; obrigatórios, não vazios; congelados antes da execução);
- `references`: `datasets` (não vazio), `patterns` (lista), `contexts` (lista);
- `parameters` (mapa congelado);
- `owner`;
- `created_at`, `updated_at`;
- `lifecycle`.

### Ciclo de vida

`Draft` → `Defined` → `Ready` → `Completed` → `Blocked` → `Superseded` → `Archived`

- `Draft`: edição.
- `Defined`: especificação congelada; imutável; referenciável.
- `Ready`: pré-requisitos válidos (hipótese `Testable` ou melhor; datasets `Ready`/`Restricted`; referências imutáveis).
- `Completed`: experimento avaliado; evidência produzida.
- `Blocked`: pré-requisito indisponível (dataset `Archived`, hipótese `Contradicted`/`Archived` etc).
- `Superseded`: substituído.
- `Archived`: terminal.

Transições: `Draft → Defined`; `Defined → Ready`; `Ready → Completed`; `Ready → Blocked`; `Blocked → Ready` (pré-requisito restabelecido) ou `Blocked → Archived`; `Completed/Defined/Ready/Blocked → Superseded`; qualquer → `Archived`.

## 7. Strategy Registry (agregado)

### Identidade

Estratégia é o agregado raiz. Possui `strategy_id` UUID, `name`, `description` e `owner`. O ciclo de vida de estratégia (governança) aplica-se ao agregado; cada conteúdo diferente é uma nova `version`.

### Strategy Version (a versão concreta)

Identidade: `strategy_id` + `version` (semver).

Campos mínimos:

- `strategy_id`, `version`;
- `name`, `description`;
- `hypothesis` (referência obrigatória, exatamente uma);
- `experiment` (referência obrigatória, exatamente uma — o experimento que produziu a evidência);
- `patterns` (lista, não vazia);
- `contexts` (lista, não vazia);
- `eligible_datasets` (lista, não vazia);
- `parameter_set` (obrigatório);
- rule descriptors:
  - `entry_rules` (obrigatório, não vazio);
  - `exit_rules` (obrigatório, não vazio);
  - `management_rules` (opcional no MVP; deve ser não vazio se presente);
  - `eligibility_rules` (obrigatório, não vazio);
- `owner`;
- `created_at`, `updated_at`;
- `lifecycle` (estado do agregado).

### Ciclo de vida do agregado

`Draft` → `Published` → `Active` → `Degraded` → `Suspended` → `Reduced` → `Deprecated` → `Archived`

- `Draft`: edição de nova versão; versão não imutável.
- `Published`: versão publicada; imutável.
- `Active`: promovida para uso corrente.
- `Degraded`: degradação de saúde detectada.
- `Suspended`: suspensa para avaliação.
- `Reduced`: alocação de capital reduzida.
- `Deprecated`: descontinuada.
- `Archived`: terminal.

Transições: `Draft → Published`; `Published → Active`; `Active → Degraded`; `Degraded → Active` ou `Degraded → Suspended`; `Active/Suspended → Suspended`; `Suspended → Active` ou `Suspended → Reduced`; `Reduced → Deprecated`; `Published/Active/Degraded/Suspended → Deprecated`; `Deprecated → Archived`.

Versão imutável a partir de `Published`. Nova versão/correção gera um novo `Draft`.

## Relações e integridade referencial

Grafo de referências (todas versionadas por `{id, version}`):

```text
Strategy Version ── experiment (1) ── hypothesis (1)
        │             │                   │
        ├─ patterns (n>=1)                │
        ├─ contexts (n>=1)                │
        ├─ eligible_datasets (n>=1)       │
        │                                 │
        └─────────────────────────────────┤
Experiment ── hypothesis (1)
        ├─ datasets (n>=1)
        ├─ patterns (n)
        └─ contexts (n)
Hypothesis ── patterns (n), contexts (n), datasets (n>=1)
Dataset (derivado) ── dataset origem (1)
Context Definition ── features (n)
```

Regras:

- Referência a agregado/versão inexistente é rejeitada no registro.
- Durante a edição (`Draft`), o referenciador pode apontar para versões ainda mutáveis; na publicação, todas as referências devem apontar para versões imutáveis.
- Referências circulares não são permitidas (o grafo é acíclico na direção Strategy → Experiment → Hypothesis → Datasets).

## Regras de versão e publicação por agregado

| Agregado | Chave de versão | Imutável a partir de | Gatilho de nova versão |
| --- | --- | --- | --- |
| Context Definition | `(context_id, version)` | `Experimental` | mudança de estados suportados, features, parâmetros ou critérios |
| Dataset | `(dataset_id, version)` + checksum | `Ready`/`Restricted` | mudança de conteúdo, limpeza, ajuste ou transformação que altere resultados |
| Hypothesis | `(hypothesis_id, version)` | `Proposed` | mudança de claim, critérios falsificáveis ou referências |
| Experiment Definition | `(experiment_id, version)` | `Defined` | mudança de hipótese, critérios prévios, referências ou parâmetros |
| Strategy Version | `(strategy_id, version)` | `Published` | mudança de regras, parâmetros ou referências |

## Compatibilidade com `VERSIONING.md`

- Uso de semantic version para definições de Context, Hypothesis, Experiment e Strategy.
- Dataset com checksum + versão explícita (identificador imutável), conforme `VERSIONING.md`.
- Imutabilidade de versões publicadas; correções geram novas versões (item "Imutabilidade").
- Toda execução relevante aponta para versões específicas e imutáveis (item "Reprodutibilidade").

## Fora de escopo desta decisão

Não são decididos aqui: adapter de persistência ou registry do Builder, engine de classificação, observações, transições calculadas, detecção de padrões, gate de promoção de estratégia para produção, e qualquer alteração em contratos compartilhados do Builder (`EventEnvelope`, `WorkspaceContext`, `AuthenticatedActor`, `DomainEvent`, `CapabilityDefinition`).
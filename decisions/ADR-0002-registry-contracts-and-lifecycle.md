# ADR-0002 — Contratos de Registries e Ciclo de Vida

## Status

Accepted — aprovado como decisão da task `ST-S02-002`. A liberação de `ST-S02-003` permanece condicionada à revisão Codex desta decisão.

## Contexto

O Sprint `ST-S02` precisa materializar cinco registries de domínio: Context, Dataset, Hypothesis, Experiment e Strategy. As fontes documentais (`docs/03-trading/PATTERN_REGISTRY.md`, `docs/03-trading/CONTEXT_ENGINE.md`, `docs/04-data/DATASETS.md`, `docs/02-architecture/DOMAINS.md`, `docs/06-governance/VERSIONING.md`, `docs/02-architecture/EVENT_MODEL.md` e `domain/ubiquitous-language.md`) definem campos mínimos e alguns ciclos de vida — Pattern e Dataset possuem ciclo de vida documentado —, mas deixam implícitos:

- os campos mínimos e os identificadores de Hypothesis, Experiment e Strategy;
- a chave de versão e a regra de imutabilidade por agregado;
- as relações obrigatórias entre agregados (o que pode e o que deve ser referenciado);
- as regras de transição de estado por agregado.

A task `ST-S02-001` demonstrou que contratos explícitos reduzem ambiguidade para o executor. Sem esta decisão, as tasks `ST-S02-003` a `ST-S02-006` seriam forçadas a inventar regras de ciclo de vida, versão e relação, exatamente o que o sprint proíbe.

## Decisão

Adotar um documento normativo único, `docs/03-trading/REGISTRY_CONTRACTS.md`, como fonte de verdade para os contratos de Context, Dataset, Hypothesis, Experiment e Strategy, com:

- **Contrato por agregado**: identidade, campos mínimos, ciclo de vida com transições, chave de versão e estado de imutabilidade.
- **Princípios comuns**: UUID imutável, `(x_id, version)` como chave única, UTC ISO-8601, `owner` obrigatório, referências versionadas por `{id, version}`, valores abertos como `unknown` (sem `any`).
- **Ciclo de vida explícito e específico por agregado**, sem taxonomia genérica compartilhada:

| Agregado | Ciclo de vida | Imutável a partir de |
| --- | --- | --- |
| Context Definition | Draft → Experimental → Validated → Active → Deprecated → Archived | `Experimental` |
| Dataset | Draft → Importing → Validating → Ready → Restricted → Deprecated → Archived | `Ready`/`Restricted` |
| Hypothesis | Draft → Proposed → Testable → Supported → Contradicted → Superseded → Archived | `Proposed` |
| Experiment Definition | Draft → Defined → Ready → Completed → Blocked → Superseded → Archived | `Defined` |
| Strategy (agregado) | Draft → Published → Active → Degraded → Suspended → Reduced → Deprecated → Archived | `Published` |

- **Relações obrigatórias explícitas**: Strategy Version referencia obrigatoriamente uma Hypothesis e um Experiment, pelo menos um Pattern, um Context e um Dataset elegível; Experiment referencia obrigatoriamente uma Hypothesis e pelo menos um Dataset.
- **Imutabilidade**: versões publicadas não são sobrescritas; correções geram novas versões (alinha `VERSIONING.md`).
- **Integridade referencial**: referências são rejeitadas quando apontam para id/versão inexistentes; na publicação do referenciador todas as referências devem apontar para versões imutáveis; grafo acíclico (Strategy → Experiment → Hypothesis → Datasets).
- **Sem framework genérico**: nenhum `BaseRegistry`, `GenericRepository` ou CRUD universal; cada contrato é específico.

O ADR `0001` continua válido: o System Builder permanece dono de identidade, workspace, registry, auditoria e workflow; este documento apenas especifica contratos de domínio Trading.

## Consequências positivas

- implementação determinística das tasks `ST-S02-003` a `ST-S02-006`, sem regras inventadas;
- consulta por id + versão reproduzível, base do DoD da sprint;
- decisões de ciclo de vida explícitas e auditáveis;
- compatibilidade com `VERSIONING.md` e com os eventos canônicos existentes (`HypothesisRegistered`, `ExperimentCreated`, `ExperimentCompleted`, `StrategyVersionPublished`, `StrategyPromoted`, `StrategySuspended`, `StrategyReduced`, `StrategyDeprecated`, `DatasetRegistered`, `DatasetVersionCreated`).

## Consequências negativas

- a especificação antecipa estados que só terão uso completo em sprints posteriores (ex.: `Suspended`, `Reduced`);
- qualquer ajuste futuro de ciclo de vida exige nova revisão desta decisão;
- risco de interpretação divergente entre a documentação e a implementação se as tasks seguintes não citarem o documento normativo.

## Alternativas consideradas

### Ciclo de vida genérico único para todos os agregados

Rejeitada. Produziria uma taxonomia genérica com estados irrelevantes por agregado (ex.: `Importing` não faz sentido para Hypothesis) e contraria o risco explícito da task de criar abstração genérica.

### Manter lifecycle implícito para o executor decidir nas tasks seguintes

Rejeitada. É exatamente o vazio documental que `ST-S02-002` existe para fechar; cada executor inventaria regras diferentes.

### Adiar versão e imutabilidade para a implementação de persistência (`ST-S02-009`)

Rejeitada. `VERSIONING.md` exige imutabilidade de versões publicadas e o DoD da sprint depende de consulta por id + versão desde o componente em memória (`ST-S02-008`).

## Regra de aplicação

Toda task de implementação de registro em `ST-S02` deve derivar campos, ciclo de vida, chave de versão, relações e imutabilidade exclusivamente de `docs/03-trading/REGISTRY_CONTRACTS.md` e desta decisão. Nenhuma alteração em contratos compartilhados do Builder (`EventEnvelope`, `WorkspaceContext`, `AuthenticatedActor`, `DomainEvent`, `CapabilityDefinition`) é permitida.

# ST-S02 - Registries

Documento executivo consolidado e versionado no repositório `delmacy/system-trading`.

## Identificação

- Sprint: `ST-S02`
- Título: Registries
- Produto e repositório de implementação: `delmacy/system-trading`
- Fase do roadmap: Fase 1 - Trading Lab
- Phase de execução: Minimum vertical flow
- Frente: System Trading / Domain and Registries
- Prioridade: alta
- Regime: serial, uma task `opencode_worker` por vez, PR curta, `AUTO_MERGE=false`
- Base inicial verificada: `d009d1b222e30351fe1078c03edc273907aeab3d`
- Estado em 2026-08-03: ativa; `ST-S02-001` entregue na PR `system-trading#2` e aguardando revisão Codex

## Objetivo

Registrar e consultar conhecimento de trading por contratos explícitos e versionados, sem depender de arquivos informais e sem duplicar capacidades genéricas do System Builder.

## Resultado demonstrável

Um teste integrado deve cadastrar uma versão de estratégia que referencia uma hipótese, um experimento, um padrão, um contexto e um dataset válidos; em seguida, deve consultá-la pelo identificador e versão, reproduzindo os mesmos dados persistidos e a trilha de evento/auditoria.

## Entregas obrigatórias

- Pattern Registry;
- Context Registry;
- Strategy Registry;
- Experiment Registry;
- Dataset Registry de metadados;
- lifecycle explícito por agregado;
- versionamento e imutabilidade de versões publicadas;
- casos de uso de cadastro e consulta;
- validação de referências entre agregados;
- adapter para persistência oficial do Builder;
- eventos canônicos e evidência auditável;
- demonstração integrada reproduzível.

## Limites da sprint

### Incluído

- contratos e regras específicas do domínio Trading;
- schemas de runtime e tipos derivados;
- portas de aplicação específicas, sem framework genérico de registry;
- adapter de teste em memória apenas para testes de componente;
- adapter oficial do Builder quando o contrato externo estiver disponível;
- testes unitários, de contrato, componente e integração;
- documentação de operação e closeout.

### Excluído

- importação ou validação de candles OHLC, reservada para `ST-S03`;
- detector de padrões, reservado para `ST-S04`;
- backtest, contexto calculado, sinais, oportunidades, risco ou execução;
- UI de produto completa;
- banco ou migrations próprios do Trading para substituir o Builder;
- autenticação, workspace, workflow, auditoria ou registry genéricos;
- mudanças em contratos do System Builder dentro de PRs do Trading;
- broker, MT5, credenciais, datasets reais ou ordens.

## Divisão de responsabilidades

- Codex: plano, task orders, contratos congelados, revisão, correções solicitadas e decisão dos gates.
- OpenCode: implementação pela esteira `opencode_worker`, testes, branch, commits, PR, correções e evidências.
- Jules: não é necessário para ST-S02 e não deve ser acionado como fallback automático desta fila.
- System Builder: persistência/registry genérico, workspace, identidade e auditoria por contrato oficial.
- System Trading: entidades, invariantes, relacionamentos e casos de uso específicos de trading.

## Contratos congelados

Durante ST-S02 nenhuma task Trading pode alterar:

- `EventEnvelope` de `trading-protocols` sem task exclusiva de compatibilidade;
- `WorkspaceContext`;
- `AuthenticatedActor`;
- `DomainEvent` da plataforma;
- `CapabilityDefinition`;
- contratos de workflow, audit ou persistence do Builder.

Mudança necessária em contrato congelado bloqueia a task afetada e gera ordem exclusiva antes da continuação.

## Estratégia de integração

1. Contratos explícitos por agregado.
2. Decisão documentada de lifecycle e versionamento.
3. Strategy como agregado que referencia os demais registros.
4. Casos de uso e portas de persistência.
5. Adapter em memória somente para validar o componente.
6. Adapter oficial do Builder e eventos/auditoria.
7. Teste integrado persistido e closeout.

Não criar `BaseRegistry`, `GenericRepository`, CRUD universal ou outra camada genérica durante esta sprint.

## Mapa serial de tasks

| Ordem | ID | Entrega | Dependência | Estado inicial |
| --- | --- | --- | --- | --- |
| 1 | `ST-S02-001` | Pattern Registry domain contract | `ST-S01-001` | `needs_codex`, PR #2 |
| 2 | `ST-S02-002` | Registry contracts and lifecycle decision | `ST-S02-001` | `planned_gated` |
| 3 | `ST-S02-003` | Context Registry domain contract | `ST-S02-002` | `planned_gated` |
| 4 | `ST-S02-004` | Dataset Registry metadata contract | `ST-S02-003` | `planned_gated` |
| 5 | `ST-S02-005` | Hypothesis and Experiment Registry contracts | `ST-S02-004` | `planned_gated` |
| 6 | `ST-S02-006` | Strategy Registry aggregate contract | `ST-S02-005` | `planned_gated` |
| 7 | `ST-S02-007` | Registry application ports and use cases | `ST-S02-006` | `planned_gated` |
| 8 | `ST-S02-008` | In-memory component adapter and reference validation | `ST-S02-007` | `planned_gated` |
| 9 | `ST-S02-009` | Builder persistence adapter and canonical audit events | `ST-S02-008`, Builder contract gate | `planned_gated_external` |
| 10 | `ST-S02-010` | Persisted vertical demo and sprint closeout | `ST-S02-009` | `planned_gated` |

## Task orders

### ST-S02-001 - Pattern Registry Domain Contract

- Frente: Domain and Registries
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: alta / `needs_codex`
- Objetivo: implementar o contrato versionado de Pattern Definition conforme documentação vigente.
- Escopo incluído: schema runtime, tipo público, lifecycle documentado, validações e testes.
- Escopo excluído: detector, observação, persistência, UI e abstração genérica.
- Dependência: `ST-S01-001` mesclada.
- Arquivos: conforme ordem detalhada `ST-S02-001.md`, incluindo `tsconfig.json` somente para project reference.
- Contratos: consome documentação de Pattern; não altera `EventEnvelope` nem Builder.
- Aceite: todos os campos mínimos e sete estados documentados; UUID, semver, UTC e coleções obrigatórias validados.
- Testes/evidência: gates npm completos, diff, base/head SHA, invariantes e ausência de arquivos proibidos.
- Risco: abstração genérica ou regras de transição inventadas.
- Gate/revisão: revisão Codex da PR #2; solicitar correção se escopo, testes ou build não forem comprovados.

### ST-S02-002 - Registry Contracts and Lifecycle Decision

- Frente: Architecture and Domain Contracts
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: alta / `planned_gated`
- Objetivo: fechar os gaps documentais dos contratos de Context, Dataset, Hypothesis, Experiment e Strategy antes da implementação.
- Escopo incluído: campos mínimos, identificadores, referências, lifecycle explícito por agregado, regras de criação de versão, publicação, depreciação e imutabilidade.
- Escopo excluído: código de produção, CRUD genérico, persistência, UI e mudanças em conceitos já estáveis sem justificativa.
- Dependência: `ST-S02-001` aceita e mesclada.
- Arquivos prováveis/permitidos: um ADR em `decisions/` e um documento específico de contratos em `docs/03-trading/`; índices estritamente necessários.
- Arquivos proibidos: `packages/**`, manifests, lockfile, Builder e documentos não relacionados.
- Contratos: pode especificar contratos Trading; não pode alterar contratos compartilhados do Builder.
- Aceite: cada agregado possui campos, lifecycle, version key e relações explícitas; nenhuma regra fica implícita para o executor inventar depois.
- Testes/evidência: `git diff --check`, links internos válidos, checklist de cobertura dos cinco registries e revisão de compatibilidade com VERSIONING.md.
- Risco: criar taxonomia genérica em vez de decisões específicas.
- Gate/revisão: Codex aprova a decisão antes de liberar `ST-S02-003`.

### ST-S02-003 - Context Registry Domain Contract

- Frente: Domain and Registries
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: alta / `planned_gated`
- Objetivo: implementar Context Definition versionada, sem classificar mercado nesta sprint.
- Escopo incluído: identidade, versão, descrição, estados suportados, features requeridas, parâmetros, lifecycle, autoria e validação runtime.
- Escopo excluído: Context Engine, scores, observações, transições calculadas e persistência.
- Dependências: `ST-S02-002`.
- Arquivos prováveis/permitidos: arquivos explícitos de Context em `packages/trading-domain/src` e testes correspondentes; exports e lock somente se necessário.
- Arquivos proibidos: Pattern já aceito, protocolos, docs institucionais, Builder, apps e banco.
- Contratos: implementa somente o contrato aprovado na task 002.
- Aceite: schema/tipo público, semver/UTC/lifecycle válidos, casos inválidos cobertos, sem `any`.
- Testes/evidência: gates npm completos e testes determinísticos focados.
- Risco: antecipar o engine de `ST-S06`.
- Gate/revisão: PR pequena, exclusiva e serial.

### ST-S02-004 - Dataset Registry Metadata Contract

- Frente: Domain and Data Contracts
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: alta / `planned_gated`
- Objetivo: implementar o contrato de metadados e versão de Dataset sem ingerir dados.
- Escopo incluído: source/license, instruments, resolution, period, timezone, schema reference, checksum, transformations, gaps, quality-report reference, artifact location, ingestion timestamp, owner e lifecycle.
- Escopo excluído: CSV, candles, object storage, qualidade calculada, lineage executado e banco.
- Dependências: `ST-S02-003`.
- Arquivos prováveis/permitidos: arquivos explícitos de Dataset em `trading-domain`, testes e exports.
- Arquivos proibidos: workers, apps, storage adapters, fixtures grandes, dados reais e Builder.
- Contratos: segue DATASETS.md e a decisão 002.
- Aceite: versão/checksum/UTC/período validados; dados sintéticos/restritos representáveis; nenhum arquivo de mercado incluído.
- Testes/evidência: gates npm e cenários de checksum, período, timezone, lifecycle e campos ausentes.
- Risco: invadir `ST-S03`.
- Gate/revisão: rejeitar qualquer ingestão ou relatório de qualidade artificial.

### ST-S02-005 - Hypothesis and Experiment Registry Contracts

- Frente: Research Domain
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: alta / `planned_gated`
- Objetivo: registrar a hipótese testável e o experimento que a avalia.
- Escopo incluído: Hypothesis, Experiment Definition, versão, critérios prévios, referências a dataset/pattern/context, lifecycle, autoria e validação.
- Escopo excluído: execução de experimento, backtest, métricas calculadas, evidência produzida e decisões de promoção.
- Dependências: `ST-S02-004`.
- Arquivos prováveis/permitidos: arquivos explícitos de Research/Experiment em `trading-domain`, testes e exports.
- Arquivos proibidos: engines, workers, persistence, Builder e alterações nos contratos anteriores sem ordem de compatibilidade.
- Contratos: relações conforme decisão 002; IDs referenciados, sem acesso direto a storage.
- Aceite: hipótese é testável, experimento registra critérios e referências versionadas, schemas rejeitam relações malformadas.
- Testes/evidência: gates npm, casos válidos/inválidos e ausência de execução simulada.
- Risco: misturar definição de experimento com resultado.
- Gate/revisão: revisão de fronteira Research x Backtest.

### ST-S02-006 - Strategy Registry Aggregate Contract

- Frente: Strategy Domain
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: alta / `planned_gated`
- Objetivo: implementar Strategy e Strategy Version como agregado que referencia os registros anteriores.
- Escopo incluído: identidade, versão, hipótese, patterns, contexts, dataset eligibility, parameter set, entry/exit/management/eligibility rule descriptors, lifecycle e autoria.
- Escopo excluído: execução de regra, detector, backtest, risk engine, portfolio e persistência.
- Dependências: `ST-S02-003`, `004` e `005` aceitas; execução serial após `005`.
- Arquivos prováveis/permitidos: arquivos explícitos de Strategy em `trading-domain`, testes e exports.
- Arquivos proibidos: engines, apps, protocols, Builder e generic registry.
- Contratos: referências tipadas aos IDs/versões aprovados; nenhuma importação de persistência.
- Aceite: Strategy Version exige hipótese e referências versionadas; não aceita listas vazias onde a decisão 002 exigir relação; sem lógica de execução.
- Testes/evidência: gates npm, invariantes do agregado e compatibilidade dos exports.
- Risco: transformar descritores em engine prematuro.
- Gate/revisão: review de domínio e escopo antes dos casos de uso.

### ST-S02-007 - Registry Application Ports and Use Cases

- Frente: Application Contracts
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: alta / `planned_gated`
- Objetivo: definir cadastro, publicação de nova versão e consulta sem acoplar o domínio a banco ou Builder.
- Escopo incluído: portas específicas, comandos/queries, resultados tipados, validação de referência e emissão de fatos canônicos.
- Escopo excluído: implementação de banco, HTTP, UI, generic repository e transações externas.
- Dependência: `ST-S02-006`.
- Arquivos prováveis/permitidos: `packages/trading-domain/src/application/**`, testes e exports explicitamente listados na ordem final.
- Arquivos proibidos: adapters de produção, apps, Builder e mudança no EventEnvelope.
- Contratos: consome agregados Trading e `EventEnvelope`; ports são específicos aos registries da sprint.
- Aceite: cadastrar/consultar por ID+versão, rejeitar referência inexistente, impedir overwrite de versão publicada e retornar erros estruturados.
- Testes/evidência: testes unitários com fakes estritos, gates npm e nenhuma asserção trivial.
- Risco: criar um framework CRUD genérico.
- Gate/revisão: confirmar que ports traduzem limites, não escondem domínio.

### ST-S02-008 - In-Memory Component Adapter and Reference Validation

- Frente: Component Testing
- phase/Fase: Minimum vertical flow / ST-S02
- Prioridade/estado: média-alta / `planned_gated`
- Objetivo: provar os casos de uso e relações em um componente determinístico sem representar persistência de produção.
- Escopo incluído: adapter em memória de teste, fixtures pequenas, cenários de cadastro/consulta/versionamento e integridade referencial.
- Escopo excluído: uso em produção, banco, arquivo local, cache distribuído, UI e alegação de persistência real.
- Dependência: `ST-S02-007`.
- Arquivos prováveis/permitidos: test adapters sob `packages/trading-domain/tests/**`; source apenas se a porta exigir correção aprovada.
- Arquivos proibidos: adapters de produção, apps, Builder, datasets reais e docs que afirmem conclusão da sprint.
- Contratos: implementa as portas sem alterar contratos.
- Aceite: cenário completo funciona em processo; duplicidade, versão imutável e referências ausentes falham de forma estruturada.
- Testes/evidência: teste de componente reproduzível e todos os gates npm.
- Risco: o adapter de teste ser promovido como solução real.
- Gate/revisão: evidência deve declarar explicitamente que o gate persistido continua aberto.

### ST-S02-009 - Builder Persistence Adapter and Canonical Audit Events

- Frente: Controlled Integration
- phase/Fase: Controlled integrations / ST-S02
- Prioridade/estado: alta / `planned_gated_external`
- Objetivo: conectar os casos de uso Trading à persistência/registry/audit oficiais do Builder por contrato suportado.
- Escopo incluído: adapter no repositório Trading, tradução de DTOs, workspace isolation, actor/correlation, idempotência, eventos e testes de contrato.
- Escopo excluído: editar `gestaotecnica`, criar banco Trading paralelo, contornar autorização, mockar integração como real ou alterar contrato externo silenciosamente.
- Dependências: `ST-S02-008`, `SB-ST-S01-001` e contrato oficial de registry/persistence disponível.
- Arquivos prováveis/permitidos: package de adapter explícito no Trading, testes de contrato e configuração sem secrets; lista exata definida contra o `main` vigente.
- Arquivos proibidos: qualquer arquivo Builder, secrets, migrations próprias e alterações nos agregados sem task de compatibilidade.
- Contratos: consome APIs/SDK oficiais do Builder; alterações externas exigem task exclusiva no Builder.
- Aceite: dados sobrevivem ao processo, workspace/actor são obrigatórios, retries não duplicam versão, audit trail e eventos possuem correlation ID.
- Testes/evidência: contrato, integração com ambiente de teste, isolamento negativo, idempotência, gates npm e registros persistidos inspecionáveis.
- Risco: dependência externa indisponível ou contrato do Builder incompleto.
- Gate/revisão: bloquear honestamente se o contrato oficial não existir; não substituir por fallback em memória.

### ST-S02-010 - Persisted Vertical Demo and Sprint Closeout

- Frente: Quality and Product Evidence
- phase/Fase: Installable-operable-demoable / ST-S02
- Prioridade/estado: alta / `planned_gated`
- Objetivo: demonstrar o critério da sprint com dados persistidos e produzir a decisão final de promoção.
- Escopo incluído: fixture pequena, fluxo register/query, reinício entre escrita/leitura quando aplicável, eventos/audit, documentação operacional e closeout.
- Escopo excluído: UI completa, dados reais, engines posteriores e correções fora da sprint.
- Dependência: `ST-S02-009`.
- Arquivos prováveis/permitidos: testes de integração/E2E, scripts de fixture oficiais e documentação de evidência em caminhos definidos pela task final.
- Arquivos proibidos: root evidence solta, screenshots sem dados verificáveis, secrets, datasets grandes e mudanças de domínio não revisadas.
- Contratos: não altera; valida todos os contratos aceitos.
- Aceite: cadastrar e consultar a mesma Strategy Version com hypothesis, experiment, pattern, context e dataset; persistência sobrevive; auditoria e evento são rastreáveis; isolamento negativo passa.
- Testes/evidência: `npm ci`, lint, typecheck, testes unitários/contrato/integração, build, `git diff --check`, comandos de bootstrap/validate aplicáveis e demonstração reproduzível.
- Risco: closeout documental esconder integração parcial.
- Gate/revisão: Codex decide aceitar, corrigir, fechar ou reiniciar; CI verde isoladamente não encerra ST-S02.

## Gates comuns de cada PR

- branch criada do `origin/main` vigente e SHA base registrado;
- somente uma task e uma execução `opencode_worker` canônica;
- fallback para Jules desabilitado; falha de todos os modelos OpenCode vira bloqueio explícito, sem troca silenciosa de executor;
- arquivos dentro da allowlist final;
- nenhum `any` explícito, secret, dataset real, artefato gerado ou evidência artificial;
- `npm ci`, lint, typecheck, testes, build e `git diff --check` passando;
- testes existentes preservados;
- README/CHANGELOG somente quando a mudança for verdadeira e necessária;
- PR sem auto-merge;
- decisão Codex obrigatória.

## Definition of Done técnico do System Trading

- tasks `001` a `008` mescladas após revisão;
- cinco registries representados por contratos explícitos;
- Strategy referencia hypothesis, experiment, pattern, context e dataset por ID/versão;
- casos de uso register/query e regras de versão passam em teste de componente;
- nenhuma capability genérica do Builder foi duplicada;
- todos os gates locais e CI passam.

O DoD técnico permite continuar desenvolvimento isolado, mas não promove a sprint como produto integrado.

## Gate de promoção integrado

ST-S02 só recebe estado `done` quando:

- `SB-ST-S01-001` estiver concluída e revisada;
- task `ST-S02-009` usar persistência/registry oficial, sem fallback de produção;
- task `ST-S02-010` demonstrar cadastro e consulta persistidos;
- isolamento por workspace, autorização, idempotência, evento e auditoria forem comprovados;
- Codex registrar decisão final de aceite.

## Política de falha e correção

- PR correta: revisar e integrar.
- PR corrigível: solicitar mudanças na mesma branch somente enquanto escopo e evidência permanecerem confiáveis.
- PR contaminada, repetidamente divergente ou com evidência falsa: fechar e reiniciar de `main` com task menor.
- Falha externa real do Builder: manter `ST-S02-009` bloqueada com evidência; não reduzir escopo nem declarar sprint concluída.
- Resultado técnico negativo válido: documentar limitação e decidir retrabalho ou descarte sem fabricar sucesso.

## Evidência final obrigatória

- SHAs base/head e PRs de todas as tasks;
- matriz de contratos e versões;
- lista final de arquivos por task;
- resultados reproduzíveis dos gates;
- registros persistidos de teste;
- eventos/audit receipts com workspace, actor e correlation ID;
- prova de isolamento negativo;
- riscos e limitações remanescentes;
- decisão Codex de promoção.

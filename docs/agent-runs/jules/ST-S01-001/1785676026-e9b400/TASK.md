# ST-S01-001 - Executable Repository Foundation

        # ST-S01-001 - Executable Repository Foundation

## ID

`ST-S01-001`

## Frente

System Trading / Quality and Protocols

## Fase

ST-S01 - Foundation and Dogfooding

## Prioridade e estado inicial

- Prioridade: alta
- Estado: ready
- Repositorio: `delmacy/system-trading`
- Branch base: `main`

## Objetivo

Transformar a documentacao inicial em uma primeira entrega executavel, observavel e testavel, sem antecipar banco, UI, broker ou execucao real.

## Contexto

O repositorio contem a especificacao institucional do System Trading, mas ainda nao possui codigo, package manifest ou CI. A primeira entrega deve estabelecer a baseline tecnica e implementar o envelope canonico de eventos definido em `docs/02-architecture/EVENT_MODEL.md`.

Esta tarefa pode rodar em paralelo com o System Builder porque nao altera contratos ou arquivos do repositorio `delmacy/gestaotecnica`. Ela apenas materializa, no System Trading, um protocolo que sera posteriormente adaptado ao contrato oficial do Builder.

## Escopo incluido

- baseline Node.js 24, npm 11 e TypeScript;
- estrutura minima de workspace coerente com `docs/07-development/CODING_STANDARD.md`;
- package `trading-protocols` com tipos e validacao do envelope canonico de evento;
- testes unitarios e de contrato para campos obrigatorios, versao, ambiente e metadados seguros;
- scripts de lint/typecheck/test/build adequados ao incremento;
- GitHub Actions para instalar de forma reproduzivel e executar os gates;
- atualizacao documental minima para executar e verificar a baseline;

## Escopo excluido

- workspace/capability no System Builder;
- banco, migrations, filas ou object storage;
- UI ou API de produto;
- Pattern, Context, Signal, Backtest, Risk, Portfolio ou Execution Engine;
- broker, MT5, credenciais ou ordens;
- alteracao do significado do envelope documentado;
- publicacao de pacote externo.

## Dependencias

- `main` atual de `delmacy/system-trading`;
- `README.md`;
- `docs/02-architecture/EVENT_MODEL.md`;
- `docs/07-development/CODING_STANDARD.md`;
- `docs/07-development/TEST_STRATEGY.md`.

## Arquivos permitidos

- `package.json`
- `package-lock.json`
- `tsconfig*.json`
- arquivos de configuracao estritamente necessarios para lint/build/test
- `.github/workflows/**`
- `packages/trading-protocols/**`
- `tests/**`
- `README.md`
- `docs/07-development/**`
- `CHANGELOG.md`

## Arquivos proibidos

- `docs/00-manifesto/**`
- `docs/01-product/**`
- `docs/03-trading/**`
- `docs/04-data/**`
- `docs/05-ai/**`
- `docs/06-governance/**`
- `backlog/**`
- `decisions/**`
- qualquer segredo, credencial, dataset real ou artefato gerado;
- qualquer arquivo no repositorio `delmacy/gestaotecnica`.

## Regras arquiteturais

- manter o dominio independente de fornecedor;
- tipos explicitos nas fronteiras;
- timestamps em UTC e formato ISO-8601;
- eventos representam fatos passados;
- schema version obrigatorio e positivo;
- nenhum segredo no payload, metadata, fixtures ou logs;
- validacao deve ser deterministica;
- nao criar abstracoes para capacidades ainda inexistentes;
- nao usar `any` explicito nem enfraquecer testes.

## Contratos consumidos e alteraveis

- Consumido: envelope em `docs/02-architecture/EVENT_MODEL.md`.
- Alteravel nesta tarefa: apenas a implementacao local de `trading-protocols`.
- Congelados e nao alteraveis: contratos do System Builder, incluindo `WorkspaceContext`, `AuthenticatedActor` e `DomainEvent` da plataforma.

## Criterios de aceite

- `npm ci` funciona a partir de checkout limpo;
- lint, typecheck, testes e build passam;
- o envelope canonico possui tipo publico e validacao de runtime;
- testes cobrem evento valido, campos ausentes, schema version invalida, timestamp invalido e rejeicao documentada de dados sensiveis;
- a mesma entrada produz o mesmo resultado de validacao;
- exports publicos estao definidos e nao vazam estrutura interna;
- README informa pre-requisitos e comandos reais;
- CI executa os mesmos gates locais;
- nenhuma capability futura foi simulada como implementada.

## Testes obrigatorios

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `git diff --check`

## Operacoes GitHub

- criar branch exclusiva a partir de `main`;
- registrar SHA base no PR;
- abrir PR contra `main`;
- incluir arquivos alterados, comandos e resultados honestos;
- nao fazer merge automatico.

## Evidencias obrigatorias

- SHA base;
- arvore criada;
- resultado de cada comando obrigatorio;
- lista de testes e invariantes cobertos;
- riscos e limitacoes restantes;
- confirmacao de ausencia de secrets e dados reais.

## Riscos

- divergir do futuro `DomainEvent` oficial do Builder;
- introduzir dependencias antes de necessidade real;
- transformar scaffold em arquitetura prematura;
- validar apenas tipos sem invariantes de runtime.

## Gate

O PR so pode ser aceito apos revisao Codex de escopo, arquitetura, seguranca, testes, documentacao, Git hygiene e evidencia. CI verde isoladamente nao conclui a tarefa.

## Instrucoes de revisao

Rejeitar se houver arquivo fora do allowlist, secret, pacote sem justificativa, teste trivial, alteracao silenciosa da documentacao institucional, capability simulada ou afirmacao de integracao com o System Builder sem teste real.

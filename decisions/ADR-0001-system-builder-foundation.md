# ADR-0001 — System Trading sobre o System Builder

## Status

Accepted

## Contexto

O System Trading necessita de identidade, workspaces, workflows, registry, documentos, storage, notificações, auditoria, observabilidade e governança. Duplicar essas capacidades criaria acoplamento, custo e inconsistência.

O System Builder existe para produzir e governar sistemas orientados a processos. O System Trading será seu primeiro produto interno complexo e projeto de dogfooding.

## Decisão

O System Trading será desenvolvido como repositório especializado e aplicação vinculada ao workspace `System Trading` dentro do System Builder.

O System Builder permanece responsável por capabilities genéricas. O System Trading implementa apenas capacidades específicas do domínio quantitativo e integra a plataforma por contratos, SDKs e eventos.

Workspace e repositório não serão tratados como equivalentes. Um workspace poderá consumir uma ou mais aplicações e repositórios.

## Consequências positivas

- validação real do System Builder;
- redução de duplicação;
- separação entre plataforma e domínio;
- possibilidade de ciclos independentes de desenvolvimento;
- arquitetura mais próxima de um produto comercial;
- reaproveitamento de capabilities genéricas.

## Consequências negativas

- dependência de contratos ainda em evolução;
- necessidade de definir fronteiras com rigor;
- possibilidade de bloquear uma entrega de trading enquanto capability genérica é implementada na plataforma;
- maior disciplina de versionamento e integração.

## Alternativas consideradas

### Colocar todo o trading no monorepo do System Builder

Rejeitada como padrão inicial porque especializaria o core genérico e misturaria ciclos de implantação e tecnologias diferentes.

### Criar produto totalmente independente

Rejeitada porque duplicaria capabilities transversais e perderia a principal prova de dogfooding.

### Um repositório por workspace

Rejeitada como regra. A relação correta é workspace → aplicações → repositórios.

## Regra de aplicação

Quando uma necessidade do System Trading for genérica e reutilizável, deverá ser proposta no System Builder. Quando for específica de trading, permanecerá neste repositório.
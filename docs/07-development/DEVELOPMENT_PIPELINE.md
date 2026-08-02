# Esteira de Desenvolvimento

## Fluxo padrão

```text
Idea
  ↓
Specification
  ↓
Architecture
  ↓
Domain Model
  ↓
Implementation
  ↓
Unit Test
  ↓
Integration Test
  ↓
Backtest or Simulation
  ↓
Walk-Forward
  ↓
Shadow
  ↓
Paper
  ↓
Micro Live
  ↓
Production
  ↓
Monitoring
  ↓
Improvement or Retirement
```

Nem toda alteração percorre todas as etapas. Documentação, UI ou infraestrutura seguem os gates aplicáveis. Estratégias e componentes de execução seguem o fluxo completo.

## Estados de uma task

- Backlog
- Ready
- In Progress
- Review
- Validation
- Done
- Blocked
- Cancelled

## Artefatos mínimos por etapa

### Idea

- problema observado;
- valor esperado;
- risco de não fazer;
- hipótese inicial.

### Specification

- escopo;
- não escopo;
- critérios de aceitação;
- dependências;
- riscos.

### Architecture

- contratos;
- fronteiras;
- dados;
- eventos;
- ADR quando necessário.

### Implementation

- código;
- testes;
- logs;
- documentação técnica.

### Validation

- evidências;
- resultados;
- limitações;
- decisão de promoção, retrabalho ou descarte.

## Regras

- decisões reversíveis devem ser testadas rapidamente;
- decisões difíceis de desfazer exigem análise maior;
- nenhuma arquitetura permanece mais de uma sprint sem entrega demonstrável;
- tasks devem ser pequenas o suficiente para revisão objetiva;
- alterações de escopo devem ser registradas;
- resultado negativo válido encerra uma hipótese sem ser tratado como fracasso de execução.

## Branches e commits

- branches curtas por feature ou fix;
- commits com propósito claro;
- PR com descrição, testes e riscos;
- preferir squash merge quando fizer sentido para manter histórico legível.

## Gate para produção

Produção exige evidência técnica, política de risco, observabilidade e capacidade de reversão ou desligamento seguro.
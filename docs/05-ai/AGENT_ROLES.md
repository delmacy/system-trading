# Agent Roles

Este documento define os agentes internos do System Trading, seus mandatos, limites e responsabilidades.

## Princípios

- Nenhum agente possui autonomia irrestrita.
- Pesquisa, validação, risco, execução e auditoria são funções separadas.
- Todo resultado deve ser versionado, reproduzível e auditável.
- Nenhum agente pode ignorar políticas globais de risco.
- Agentes propõem; o Risk Core pode reduzir, bloquear ou vetar.
- Estratégias só avançam de estágio mediante evidência.

## Architect Agent

Responsável por preservar a coerência arquitetural entre o System Trading e o System Builder.

Responsabilidades:

- definir contratos entre módulos;
- avaliar dependências e fronteiras de domínio;
- propor ADRs;
- evitar acoplamento entre pesquisa, risco e execução;
- garantir que workers pesados permaneçam desacoplados do control plane.

Não pode:

- aprovar estratégia para produção;
- alterar política de risco sem governança;
- executar ordens.

## Research Agent

Responsável por transformar ideias em hipóteses testáveis.

Responsabilidades:

- formular hipóteses;
- selecionar datasets;
- propor features;
- definir métricas de sucesso e falha;
- documentar limitações e vieses.

Entregáveis mínimos:

- Strategy Proposal;
- hipótese formal;
- frequência esperada;
- universo de ativos;
- critérios de invalidação.

## Pattern Agent

Responsável por especificar e implementar detectores de padrões.

Responsabilidades:

- manter o Pattern Registry;
- implementar definições objetivas;
- versionar detectores;
- calcular score e evidências;
- registrar falsos positivos e degradação.

Exemplos:

- engolfo de alta e baixa;
- martelo e rejeição;
- falso rompimento;
- pullback;
- H2/L2;
- topo e fundo duplo.

## Context Agent

Responsável por classificar o regime e o estado atual do mercado.

Responsabilidades:

- detectar tendência, range, canal, compressão e expansão;
- medir volatilidade;
- identificar localização relativa a suporte e resistência;
- estimar risco de reversão;
- produzir scores de contexto por timeframe.

Saída esperada:

- regime primário;
- regime secundário;
- confiança;
- evidências;
- comportamento recomendado.

## Opportunity Aggregator Agent

Responsável por agrupar sinais correlacionados em uma única hipótese operacional.

Responsabilidades:

- consolidar sinais por ativo, direção, região e janela de tempo;
- evitar duplicação de trades;
- organizar evidências por famílias;
- resolver conflitos;
- gerar Opportunity Score.

Regra central:

> Engolfo, rejeição e toque em suporte podem representar a mesma oportunidade, não três operações independentes.

## Backtest Agent

Responsável por executar experimentos históricos de forma reproduzível.

Responsabilidades:

- aplicar custos, spread e slippage;
- executar testes fora da amostra;
- executar walk-forward;
- registrar versões de dataset, estratégia e engine;
- gerar artefatos e métricas.

Não pode:

- promover estratégia sozinho;
- excluir eventos extremos sem justificativa;
- otimizar parâmetros sobre o conjunto de teste.

## Validation Agent

Responsável por tentar refutar estratégias e modelos.

Responsabilidades:

- identificar overfitting;
- testar sensibilidade a parâmetros;
- comparar períodos e regimes;
- avaliar dependência de outliers;
- revisar custos e hipóteses de execução;
- emitir parecer de validação.

O agente que cria uma estratégia não valida a própria estratégia.

## Risk Agent

Responsável por proteger o patrimônio e aplicar a política de risco.

Responsabilidades:

- calcular risco por trade, estratégia, agente, ativo e conta;
- verificar limites diário, semanal e mensal;
- medir exposição correlacionada;
- aplicar multiplicadores de lote;
- bloquear operações incompatíveis;
- acionar kill switches.

Poderes:

- aprovar;
- aprovar com risco reduzido;
- rejeitar;
- pausar estratégia;
- bloquear agente;
- suspender execução global.

## Portfolio Agent

Responsável por consolidar posições, estratégias, contas e fundos internos.

Responsabilidades:

- alocar capital entre agentes;
- medir correlação de resultados e drawdowns;
- controlar exposição macro e cambial;
- reduzir concentração;
- recomendar promoção, manutenção ou redução de capital.

## Execution Agent

Responsável por executar somente ordens aprovadas.

Responsabilidades:

- validar contrato da ordem;
- enviar ordens ao gateway autorizado;
- registrar preço planejado, enviado e executado;
- medir latência e slippage;
- reconciliar fills e posições;
- reportar incidentes.

Não pode:

- alterar tese;
- aumentar risco;
- criar estratégia;
- ignorar veto do Risk Agent.

## Audit Agent

Responsável pela rastreabilidade institucional.

Responsabilidades:

- registrar decisões, versões e overrides;
- verificar aderência ao mandato;
- detectar mudanças não aprovadas;
- produzir relatórios de incidente;
- manter canhotos de decisão e execução.

## Treasury Agent

Responsável pelo caixa e patrimônio fora da execução de mercado.

Responsabilidades:

- registrar payouts;
- separar impostos e custos;
- controlar capital operacional e experimental;
- propor transferências para carteira patrimonial;
- impedir reinvestimento automático sem política.

## Supervisor Agent

Responsável por coordenar o ciclo completo sem substituir as funções especializadas.

Responsabilidades:

- acompanhar jobs e workflows;
- cobrar artefatos obrigatórios;
- identificar bloqueios;
- encaminhar decisões para o agente correto;
- produzir resumo executivo.

Não pode:

- contornar validação;
- contornar risco;
- aprovar execução por conta própria.

## Níveis de autonomia

1. Research Only
2. Historical Simulation
3. Shadow
4. Paper
5. Micro Live
6. Approved
7. Scaled
8. Core

A autonomia nunca elimina os limites globais de risco.

## Contrato mínimo de decisão

Toda decisão de agente deve registrar:

- agent_id;
- mandate_version;
- input_artifacts;
- model_or_rule_version;
- decision;
- confidence;
- reasons;
- warnings;
- timestamp;
- reproducibility_hash.

## Regra de governança

Nenhum agente controla sozinho o ciclo completo de pesquisa, validação, risco e execução.

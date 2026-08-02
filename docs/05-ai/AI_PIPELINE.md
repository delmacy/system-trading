# Esteira de IA

## Objetivo

Definir como tarefas assistidas por IA entram no desenvolvimento sem comprometer governança, custo ou segurança.

## Fluxo

```text
Task
  ↓
Classification
  ↓
Model Routing
  ↓
Execution
  ↓
Artifact Review
  ↓
Validation
  ↓
Commit or Rework
```

## Classificação de tarefas

- arquitetura;
- pesquisa;
- implementação;
- testes;
- documentação;
- revisão;
- diagnóstico;
- análise de dados.

## Roteamento de modelos

- modelos mais capazes para decisões difíceis e especificações;
- modelos intermediários para implementação e revisão;
- modelos baratos para tarefas repetitivas e transformações;
- execução local quando custo e capacidade justificarem.

## Controles

- orçamento mensal e por tarefa;
- registro de custo;
- limite de tentativas;
- artefatos pequenos e verificáveis;
- proibição de segredos em prompts;
- revisão humana ou automatizada antes de merge;
- testes obrigatórios para código gerado;
- nenhuma alteração direta em produção.

## Métricas

- custo por task concluída;
- taxa de retrabalho;
- defeitos encontrados;
- tempo até merge;
- utilidade percebida;
- percentual de tarefas executadas por faixa de modelo.

## Regra

O modelo caro deve pensar onde isso produz alavancagem. A execução repetitiva deve migrar para ferramentas e modelos mais baratos conforme o processo amadurece.
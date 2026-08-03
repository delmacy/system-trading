# Registry Contracts

## Prop�sito

Definir os contratos expl�citos e versionados para os cinco registros do dom�nio Trading: Context, Dataset, Hypothesis, Experiment e Strategy. Cada contrato especifica campos m�nimos, identificadores, refer�ncias, lifecycle, regras de vers�o, publica��o, deprecia��o e imutabilidade.

Estes contratos servem como base para implementa��o e n�o podem ser alterados sem nova decis�o documentada.

## Conven��es gerais

- Todo identificador de registry usa UUID v4;
- Toda vers�o usa versionamento sem�ntico;
- Todo timestamp de autoria usa ISO-8601 em UTC;
- Refer�ncias entre registros s�o tipadas por ID e vers�o;
- Vers�es publicadas s�o imut�veis;
- Corre��es geram novas vers�es;
- Depreca��o marca uma vers�o como obsoleta sem exclu��o;
- Nenhum campo `any` � permitido nos schemas runtime.

---

## Context Registry

### Prop�sito

Registrar defini��es versionadas de contexto de mercado, representadas por evid�ncias e scores, sem executar classifica��o nesta sprint.

### Estrutura m�nima

- `context_id` (UUID);
- `name` (string n�o vazia);
- `description` (string n�o vazia);
- `version` (semver);
- `states` (array de strings n�o vazias, estados suportados);
- `required_features` (array de strings n�o vazias, features necess�rias);
- `parameters` (mapa aberto de valores desconhecidos);
- `references` (array de strings, refer�ncias a datasets e patterns por ID+vers�o);
- `status` (lifecycle);
- `author` (string n�o vazia);
- `authored_at` (ISO-8601 UTC);
- `deprecation_reason` (string, presente apenas quando status for Deprecated).

### Lifecycle

- Draft
- Experimental
- Validated
- Active
- Degraded
- Deprecated
- Archived

### Regras de transi��o

- Draft pode avançar para Experimental;
- Experimental pode avançar para Validated ou retornar a Draft;
- Validated pode avançar para Active;
- Active pode avançar para Degraded;
- Degraded pode ser restaurado para Active ou avançar para Deprecated;
- Deprecated pode avançar para Archived;
- Archived � estado terminal;
- Nenhuma transi��o permite skip de estados (exceto restaura��o de Degraded para Active).

### Regras de vers�o

- Nova vers�o � criada quando o estado muda para Active ou quando `parameters` ou `required_features` s�o alterados;
- Altera��o em `states` gera nova vers�o;
- Vers�o publicada n�o pode ser sobrescrita.

---

## Dataset Registry

### Prop�sito

Registrar metadados e vers�o de datasets sem ingerir dados reais.

### Estrutura m�nima

- `dataset_id` (UUID);
- `name` (string n�o vazia);
- `description` (string n�o vazia);
- `version` (semver);
- `source` (string n�o vazia, origem dos dados);
- `license` (string n�o vazia);
- `instruments` (array de strings n�o vazias);
- `resolution` (string n�o vazia, ex.: M5, H1, D1);
- `period` (objeto com `start` e `end` em ISO-8601 UTC);
- `timezone` (string n�o vazia);
- `schema_reference` (string n�o vazia, refer�ncia ao schema dos dados);
- `checksum` (string n�o vazia, hash do artifact);
- `transformations` (array de strings descrevendo transforma��es aplicadas);
- `gaps` (array de objetos com `type` e `range`, descrevendo lacunas identificadas);
- `quality_report_reference` (string, refer�ncia ao relat�rio de qualidade);
- `artifact_location` (string n�o vazia, localiza��o do artifact);
- `ingested_at` (ISO-8601 UTC);
- `owner` (string n�o vazia);
- `status` (lifecycle);
- `author` (string n�o vazia);
- `authored_at` (ISO-8601 UTC).

### Lifecycle

- Draft
- Validated
- Active
- Deprecated
- Archived

### Regras de transi��o

- Draft pode avançar para Validated;
- Validated pode avançar para Active;
- Active pode avançar para Deprecated;
- Deprecated pode avançar para Archived;
- Archived � estado terminal;
- Nenhuma transi��o permite skip de estados.

### Regras de vers�o

- Nova vers�o � criada quando dados s�o re-ingestados ou quando `transformations` s�o alteradas;
- Alteração em `checksum` gera nova vers�o;
- Alteração em `period`, `resolution` ou `instruments` gera nova versão;
- Checksum e versão são imutáveis ap�s publicação.

---

## Hypothesis Registry

### Prop�sito

Registrar hipóteses testáveis sobre comportamento de mercado, estratégia, risco ou execução.

### Estrutura mínima

- `hypothesis_id` (UUID);
- `name` (string não vazia);
- `description` (string não vazia);
- `version` (semver);
- `statement` (string não vazia, a hipótese testável);
- `success_criteria` (array de objetos com `metric` e `threshold`, critérios prévios de sucesso);
- `dataset_references` (array de objetos com `dataset_id` e `version`, referências a datasets);
- `pattern_references` (array de objetos com `pattern_id` e `version`, referências a patterns);
- `context_references` (array de objetos com `context_id` e `version`, referências a contexts);
- `parameters` (mapa aberto de valores desconhecidos);
- `status` (lifecycle);
- `author` (string não vazia);
- `authored_at` (ISO-8601 UTC).

### Lifecycle

- Draft
- Active
- Deprecated
- Archived

### Regras de transição

- Draft pode avançar para Active;
- Active pode ser movido para Deprecated;
- Deprecated pode avançar para Archived;
- Archived é estado terminal;
- Nenhuma transição permite skip de estados.

### Regras de versão

- Nova versão é criada quando `statement`, `success_criteria` ou referências são alterados;
- Versão publicada não pode ser sobrescrita.

---

## Experiment Registry

### Propósito

Registrar o procedimento definido para testar uma hipótese usando dados, regras e critérios prévios.

### Estrutura mínima

- `experiment_id` (UUID);
- `name` (string não vazia);
- `description` (string não vazia);
- `version` (semver);
- `hypothesis_reference` (objeto com `hypothesis_id` e `version`, referência à hipótese);
- `dataset_references` (array de objetos com `dataset_id` e `version`, referências a datasets);
- `pattern_references` (array de objetos com `pattern_id` e `version`, referências a patterns);
- `context_references` (array de objetos com `context_id` e `version`, referências a contexts);
- `criteria` (array de objetos com `metric`, `threshold` e `comparison`, critérios de avaliação);
- `parameters` (mapa aberto de valores desconhecidos);
- `status` (lifecycle);
- `author` (string não vazia);
- `authored_at` (ISO-8601 UTC).

### Lifecycle

- Draft
- Running
- Completed
- Deprecated
- Archived

### Regras de transição

- Draft pode avançar para Running;
- Running pode avançar para Completed;
- Completed não pode retroceder para Running;
- Running ou Completed podem ser movidos para Deprecated;
- Deprecated pode avançar para Archived;
- Archived é estado terminal;
- Nenhuma transição permite skip de estados.

### Regras de versão

- Nova versão é criada quando o experimento é re-executado com alterações em `criteria`, `parameters` ou referências;
- Resultados não são parte da definição do experimento;
- Versão publicada não pode ser sobrescrita.

---

## Strategy Registry

### Propósito

Registrar estratégias como agregados que referenciam hipóteses, patterns, contexts e datasets, com descritores de regras de entrada, saída, manejo e elegibilidade.

### Estrutura mínima

- `strategy_id` (UUID);
- `name` (string não vazia);
- `description` (string não vazia);
- `version` (semver);
- `hypothesis_reference` (objeto com `hypothesis_id` e `version`, referência à hipótese);
- `pattern_references` (array de objetos com `pattern_id` e `version`, referências a patterns; não vazio);
- `context_references` (array de objetos com `context_id` e `version`, referências a contexts);
- `dataset_eligibility` (array de objetos com `dataset_id` e `version`, datasets elegíveis);
- `parameters` (mapa aberto de valores desconhecidos);
- `entry_rule` (objeto com `descriptor` e `parameters`, descritor da regra de entrada);
- `exit_rule` (objeto com `descriptor` e `parameters`, descritor da regra de saída);
- `management_rule` (objeto com `descriptor` e `parameters`, descritor da regra de manejo);
- `eligibility_rule` (objeto com `descriptor` e `parameters`, descritor da regra de elegibilidade);
- `status` (lifecycle);
- `author` (string não vazia);
- `authored_at` (ISO-8601 UTC).

### Lifecycle

- Draft
- Experimental
- Validated
- Active
- Degraded
- Deprecated
- Archived

### Regras de transição

- Draft pode avançar para Experimental;
- Experimental pode avançar para Validated ou retornar a Draft;
- Validated pode avançar para Active;
- Active pode avançar para Degraded;
- Degraded pode ser restaurado para Active ou avançar para Deprecated;
- Deprecated pode avançar para Archived;
- Archived é estado terminal;
- Nenhuma transição permite skip de estados (exceto restauração de Degraded para Active).

### Regras de versão

- Nova versão é criada quando qualquer regra, referência, parâmetro ou `hypothesis_reference` é alterado;
- Versão publicada não pode ser sobrescrita.

### Regras de publicação

- Publicação exige que todas as referências existam no registry e estejam em estado Active ou Validated;
- `pattern_references` não pode estar vazio;
- `hypothesis_reference` é obrigatório;
- `dataset_eligibility` pode estar vazio apenas se a decisão 002 permitir;
- `entry_rule`, `exit_rule`, `management_rule` e `eligibility_rule` devem possuir `descriptor` não vazio.

---

## Regras gerais de imutabilidade e depreciação

- Versões publicadas não podem ser sobrescritas;
- Correções geram novas versões semânticas;
- Deprecação marca uma versão como obsoleta sem excluí-la;
- Arquivamento marca uma versão como encerrada sem excluí-la;
- Nenhum registro pode ser excluído fisicamente;
- Apenas o status pode mudar conforme as regras de lifecycle.
# Risk Engine

## Propósito

Proteger capital antes, durante e depois da execução. O Risk Engine possui autoridade para ajustar, vetar, reduzir ou encerrar exposição.

## Níveis de controle

- global;
- portfólio;
- conta;
- estratégia;
- instrumento;
- grupo de correlação;
- sessão;
- trade.

## Entradas

- oportunidade;
- quality score;
- contexto;
- volatilidade;
- liquidez estimada;
- custos;
- exposição atual;
- perdas acumuladas;
- saúde da estratégia;
- regras da conta ou prop;
- limites institucionais.

## Saídas

- `approved`;
- `approved_with_adjustment`;
- `rejected`;
- `blocked`;
- tamanho autorizado;
- stop máximo;
- risco monetário;
- restrições adicionais;
- motivos e regras aplicadas.

## Limites iniciais

- risco máximo por trade;
- perda máxima diária;
- perda máxima semanal e mensal;
- número máximo de posições;
- exposição máxima por ativo;
- exposição máxima por moeda ou fator;
- concentração por estratégia;
- sequência máxima de perdas antes de redução;
- limite de slippage;
- limite de divergência de reconciliação.

## Position sizing de referência

- Normal: `1.00x`
- Boa: `1.25x`
- Premium: `1.50x`
- Excepcional: até `2.00x`

Multiplicadores são apenas referência de pesquisa. A política real deverá respeitar risco monetário, volatilidade, liquidez, correlação e limites da conta.

## Kill switches

Devem existir mecanismos para:

- bloquear novas ordens globalmente;
- bloquear uma conta;
- bloquear uma estratégia;
- bloquear um instrumento;
- encerrar exposição quando permitido;
- exigir intervenção humana para liberação.

## Regras institucionais

- nenhuma estratégia controla seu próprio limite máximo;
- regras de prop e broker são restrições externas obrigatórias;
- múltiplas contas com a mesma estratégia representam uma exposição lógica agregada;
- perdas recentes não justificam aumento de risco para recuperação;
- ganhos recentes não justificam aumento automático sem evidência de capacidade;
- alterações de política são versionadas e auditadas.

## MVP

O primeiro Risk Engine deverá implementar:

- risco fixo por trade;
- limite diário;
- máximo de posições simultâneas;
- veto por indisponibilidade de stop;
- bloqueio por custos excessivos;
- kill switch global;
- registro completo da decisão.
# Shadow Trading

## Propósito

Observar decisões do sistema em fluxo de mercado sem enviar ordens reais. O Shadow Ledger registra o que teria sido decidido, aprovado, executado e encerrado segundo regras conhecidas.

## Objetivos

- validar integração de dados em tempo quase real;
- medir atraso e estabilidade dos sinais;
- comparar backtest com comportamento corrente;
- identificar divergências operacionais;
- avaliar custos e slippage estimados;
- testar risco e observabilidade;
- detectar intervenções manuais ocultas.

## Registro mínimo

- market snapshot;
- contexto;
- sinais;
- oportunidade;
- decisão de risco;
- ordem simulada;
- fill simulado;
- posição simulada;
- saída;
- métricas;
- versão de todos os componentes;
- latência entre etapas.

## Modos

### Replay

Executa dados históricos como fluxo temporal controlado.

### Near Real-Time

Consome dados atuais e toma decisões sem transmitir ordens.

### Parallel Shadow

Executa em paralelo a uma operação paper ou real para comparar versões de estratégia e risco.

## Regras

- nenhuma credencial de execução real é necessária;
- decisões não podem ser corrigidas retroativamente;
- mudanças de regra geram nova versão;
- gaps de dados devem invalidar ou marcar observações;
- o shadow deve usar a mesma interface de decisão do caminho de produção sempre que possível;
- resultados devem ser separados de backtests e paper trading.

## Gate de saída

Uma estratégia somente poderá avançar quando demonstrar estabilidade mínima definida em política, ausência de falhas críticas, qualidade de dados aceitável e comportamento compatível com os resultados esperados.
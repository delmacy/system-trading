# Workspaces e Ambientes

## Workspace principal

O produto nasce dentro de um workspace institucional denominado `System Trading`.

Campos mínimos:

- `workspace_id`;
- `name`;
- `type = internal-product`;
- `status = incubation`;
- `source_repository = delmacy/system-trading`;
- `platform = system-builder`;
- `capability_profile = trading-lab`;
- `default_environment = research`.

## Ambientes lógicos iniciais

### Research

Uso para experimentação, exploração e desenvolvimento de hipóteses. Não possui permissão para envio de ordens reais.

### Simulation

Uso para backtest, replay, walk-forward e paper trading.

### Shadow

Uso para decisões em tempo de mercado sem envio de ordem ao broker. Registra o que o sistema teria feito.

### Production

Uso para execução real. Deve permanecer desabilitado por padrão e exigir políticas adicionais de autorização.

### Archive

Uso para versões aposentadas, datasets congelados, relatórios e artefatos históricos.

## Regra de separação

A promoção entre ambientes não significa copiar código manualmente. Significa promover uma versão identificável de estratégia, parâmetros, dataset, policy e build.

## Relação com repositórios

Workspace não é sinônimo de repositório. Um workspace pode consumir várias aplicações e repositórios. O System Trading começa com um único repositório especializado e poderá futuramente separar modelos, infraestrutura ou gateways quando isso trouxer benefício operacional claro.

## Dados e segredos

- dados de research e production devem ser logicamente separados;
- credenciais reais não podem existir em ambientes de research;
- chaves e tokens não podem ser persistidos em documentos de configuração versionados;
- acesso a production deve seguir princípio do menor privilégio.

## Critério de promoção

Uma versão só pode avançar de ambiente quando atender aos gates definidos no pipeline de desenvolvimento e na política de risco.
# Versionamento

## Objetivo

Garantir que estratégias, dados, políticas, modelos, contratos e releases sejam reproduzíveis e comparáveis.

## Itens versionados

- Strategy Definition
- Pattern Definition
- Context Engine
- Feature Set
- Parameter Set
- Dataset
- Risk Policy
- Portfolio Policy
- Broker Adapter
- Event Schema
- API Contract
- Application Release
- AI Prompt ou configuração relevante

## Convenção

Usar versionamento semântico quando aplicável:

- MAJOR: mudança incompatível;
- MINOR: nova capacidade compatível;
- PATCH: correção compatível.

Para datasets e experimentos, usar identificador imutável, checksum e versão explícita.

## Reprodutibilidade

Toda execução relevante deve apontar para:

- commit ou build;
- versão da estratégia;
- parâmetros;
- dataset;
- política de risco;
- engine version;
- ambiente;
- timestamp.

## Imutabilidade

Versões publicadas não devem ser sobrescritas. Correções geram novas versões.

## Compatibilidade

Mudanças em eventos, contratos e schemas devem indicar política de migração e janela de compatibilidade.

## Promoção

Promover significa selecionar uma versão específica e seus artefatos associados. Não é permitido promover apenas uma ideia abstrata ou código não identificado.
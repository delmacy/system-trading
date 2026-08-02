# Política de Segurança

## Escopo

Esta política cobre código, infraestrutura, dados, credenciais, integrações de broker e componentes de execução do System Trading.

## Reporte de vulnerabilidades

Não publique credenciais, chaves, tokens, dados pessoais ou detalhes exploráveis em issues públicas. Registre o problema de forma privada pelo canal seguro disponível ao mantenedor.

## Regras obrigatórias

- nenhum segredo deve ser versionado;
- credenciais de broker devem usar secret manager ou mecanismo equivalente;
- ambientes de pesquisa não devem possuir credenciais de produção;
- produção deve operar com menor privilégio;
- execução real deve permanecer desabilitada por padrão;
- logs não podem expor segredos;
- dependências devem ser revisadas quanto a licença e vulnerabilidades;
- comandos externos exigem autenticação, autorização e idempotência;
- kill switches devem possuir caminho independente e testado.

## Dados

- dados licenciados devem respeitar termos de uso;
- informações de contas devem ser tratadas como sensíveis;
- artefatos públicos não devem conter saldos, números de conta ou tokens;
- backups e retenção devem ser compatíveis com o ambiente.

## Incidentes

Incidentes críticos incluem:

- ordem não autorizada;
- duplicação de exposição;
- falha de kill switch;
- vazamento de credencial;
- corrupção de dataset ou posição;
- divergência não detectada entre estado local e broker.

Todo incidente crítico exige contenção, registro, análise de causa raiz e ação preventiva antes da retomada.

## Aviso

Este repositório é público. Nunca utilize valores reais de segredos em exemplos, testes ou documentação.
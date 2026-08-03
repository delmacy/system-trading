# ADR-0002 - Registry Contracts and Lifecycle Decision

## Status

Accepted

## Contexto

O System Trading precisa registrar conhecimento de trading por contratos expl�citos e versionados, sem depender de arquivos informais e sem duplicar capacidades gen�ricas do System Builder.

O Pattern Registry (ST-S02-001) estabeleceu o padr�o de contrato versionado com schema runtime, tipo p�blico e ciclo de vida documentado. Os registros restantes — Context, Dataset, Hypothesis, Experiment e Strategy — precisam de contratos equivalentes antes da implementa��o.

Sem contratos congelados, cada executor inventaria regras de lifecycle, versionamento e refer�ncias, gerando inconsist�ncia entre registros e impossibilitando a valida��o de integridade referencial.

## Decis�o

Cada agregado de registry ter� um contrato expl�cito com:

- identificador UUID imut�vel;
- nome e descri��o;
- chave de vers�o sem�ntica;
- estados de lifecycle documentados;
- regras de transi��o entre estados;
- refer�ncias tipadas a outros registros por ID e vers�o;
- metadados de autoria com timestamp UTC;
- imutabilidade de vers�es publicadas;
- regras de cria��o de nova vers�o, publica��o e deprecia��o.

Os cinco registros e seus ciclos de vida s�o:

### Context Registry

- Estados: Draft, Experimental, Validated, Active, Degraded, Deprecated, Archived;
- Vers�o sem�ntica;
- Refer�ncias a Dataset e Pattern por ID+vers�o;
- Nova vers�o gerada quando o estado muda para Active ou quando crit�rios de classifica��o s�o alterados;
- Vers�o publicada n�o pode ser sobrescrita;
- Depreca��o marca a vers�o como obsoleta sem exclu��o.

### Dataset Registry

- Estados: Draft, Validated, Active, Deprecated, Archived;
- Vers�o imut�vel por checksum;
- Campos obrigat�rios: source, license, instruments, resolution, period, timezone, schema reference, checksum, transformations, quality-report reference, artifact location, ingestion timestamp, owner;
- Nova vers�o gerada quando dados s�o re-ingestados ou transforma��es s�o aplicadas;
- Checksum e vers�o s�o imut ap�s publica��o;
- Depreca��o n�o remove o registro, apenas impede novo uso.

### Hypothesis Registry

- Estados: Draft, Active, Deprecated, Archived;
- Vers�o sem�ntica;
- Refer�ncias a Dataset, Pattern e Context por ID+vers�o;
- Crit�rios pr�vios de sucesso registrados;
- Nova vers�o gerada quando crit�rios ou refer�ncias s�o alterados;
- Vers�o publicada n�o pode ser sobrescrita.

### Experiment Registry

- Estados: Draft, Running, Completed, Deprecated, Archived;
- Vers�o sem�ntica;
- Refer�ncias a Hypothesis, Dataset, Pattern e Context por ID+vers�o;
- Crit�rios de avalia��o registrados;
- Nova vers�o gerada quando o experimento � re-executado com altera��es;
- Resultados n�o s�o parte da defini��o do experimento;
- Vers�o publicada n�o pode ser sobrescrita.

### Strategy Registry

- Estados: Draft, Experimental, Validated, Active, Degraded, Deprecated, Archived;
- Vers�o sem�ntica;
- Estrutura como agregado que referencia Hypothesis, Pattern, Context e Dataset por ID+vers�o;
- Parameter set e rule descriptors (entry, exit, management, eligibility) como campos tipados;
- Nova vers�o gerada quando qualquer regra, refer�ncia ou par�metro � alterado;
- Vers�o publicada n�o pode ser sobrescrita;
- Publica��o exige que todas as refer�ncias existam e estejam em estado Active ou Validated;
- Depreca��o marca a vers�o como obsoleta sem exclu��o.

## Consequ�ncias positivas

- cada agregado possui campos, lifecycle e regras de vers�o expl�citos;
- nenhuma regra fica impl�cita para o executor inventar depois;
- valida��o de refer�ncias entre agregados � poss�vel em runtime;
- imutabilidade de vers�es publicadas � garantida por contrato;
- versionamento sem�ntico consistente com VERSIONING.md;
- separa��o clara entre defini��o e execu��o.

## Consequ�ncias negativas

- contratos iniciais podem precisar de ajustes quando o Builder fornecer o contrato externo de persist�ncia;
- regras de transi��o de lifecycle s�o espec�ficas e n�o generalizadas, o que pode exigir atualiza��es futuras;
- a strictness das refer�ncias pode bloquear cadastros parciais durante a constru��o de grafos de depend�ncia.

## Alternativas consideradas

### Usar um registry gen�rico com schema aberto

Rejeitada porque duplicaria capacidades do System Builder e eliminaria a fronteira expl�cita entre dom�nio e plataforma.

### Permitir overwrite de vers�es publicadas

Rejeitada porque viola a imutabilidade documentada em VERSIONING.md e compromete a reproducibilidade.

### Usar lifecycle gen�rico para todos os registros

Rejeitada porque cada agregado tem regras de transi��o espec�ficas que n�o podem ser generalizadas sem perder precis�o.

## Regra de aplica��o

Quando um contrato de registry precisar ser alterado, uma nova vers�o sem�ntica deve ser criada. Mudan�as em contratos congelados do Builder exigem task exclusiva de compatibilidade. Nenhuma regra de lifecycle pode ser inventada fora deste ADR.
import { z } from 'zod';

export const ArchitectureDecisionStatusSchema = z.enum([
  'Proposed',
  'Accepted',
  'Deprecated',
  'Superseded',
]);

export type ArchitectureDecisionStatus = z.infer<typeof ArchitectureDecisionStatusSchema>;

export const ArchitectureDecisionScopeSchema = z.enum(['platform', 'trading']);

export type ArchitectureDecisionScope = z.infer<typeof ArchitectureDecisionScopeSchema>;

export const ArchitectureDecisionSchema = z.object({
  adr_id: z.string().regex(/^ADR-\d{4}$/, 'Invalid ADR id'),
  title: z.string().min(1),
  status: ArchitectureDecisionStatusSchema,
  scope: ArchitectureDecisionScopeSchema,
  decided_at: z.string().datetime().optional(),
  summary: z.string().min(1),
  decisions: z.array(z.string().min(1)).min(1),
  rules: z.array(z.string().min(1)),
});

export type ArchitectureDecision = z.infer<typeof ArchitectureDecisionSchema>;

export const ArchitectureDecisionsSchema = z
  .array(ArchitectureDecisionSchema)
  .min(1, 'At least one architecture decision is required')
  .superRefine((adrs, ctx) => {
    const seen = new Set<string>();
    adrs.forEach((adr, index) => {
      if (seen.has(adr.adr_id)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate ADR id: ${adr.adr_id}`,
          path: [index],
        });
      }
      seen.add(adr.adr_id);
    });
  });

export type ArchitectureDecisions = z.infer<typeof ArchitectureDecisionsSchema>;

const canonicalArchitectureDecisions: ArchitectureDecisions = [
  {
    adr_id: 'ADR-0001',
    title: 'System Trading sobre o System Builder',
    status: 'Accepted',
    scope: 'platform',
    summary:
      'O System Trading será desenvolvido como repositório especializado e aplicação vinculada ao workspace System Trading dentro do System Builder. O System Builder permanece responsável por capabilities genéricas; o System Trading implementa apenas capacidades específicas do domínio quantitativo e integra a plataforma por contratos, SDKs e eventos.',
    decisions: [
      'Desenvolver o System Trading como repositório especializado e aplicação vinculada ao workspace System Trading dentro do System Builder.',
      'Delegar ao System Builder todas as capabilities genéricas e implementar apenas as capacidades específicas do domínio quantitativo.',
      'Integrar a plataforma por contratos, SDKs e eventos, sem duplicar capabilities genéricas.',
      'Tratar workspace e repositório como conceitos distintos: um workspace pode consumir uma ou mais aplicações e repositórios.',
    ],
    rules: [
      'Quando uma necessidade do System Trading for genérica e reutilizável, deverá ser proposta no System Builder. Quando for específica de trading, permanecerá neste repositório.',
    ],
  },
  {
    adr_id: 'ADR-0002',
    title: 'Contratos de Registry e Ciclo de Vida',
    status: 'Proposed',
    scope: 'trading',
    summary:
      'Define a chave de identidade e versão dos agregados de definição, o ciclo de vida canônico das definições versionadas, o ciclo de vida específico de Dataset, as regras de imutabilidade e as referências entre agregados, com o documento docs/03-trading/REGISTRY_CONTRACTS.md como fonte única.',
    decisions: [
      'Agregados de definição (Pattern, Context, Hypothesis, Experiment, Strategy Version) usam chave de versão composta por (aggregate_id, version): aggregate_id UUID imutável e version semântica.',
      'Dataset usa dataset_id UUID imutável, versão explícita e checksum imutável da versão.',
      'Definições versionadas reutilizam o ciclo de vida Draft, Experimental, Validated, Active, Degraded, Deprecated, Archived.',
      'Dataset mantém o ciclo de vida próprio Draft, Importing, Validating, Ready, Restricted, Deprecated, Archived.',
      'Referências entre agregados são sempre (id, version) apontando para uma versão específica, nunca para um nome ou registro abstrato.',
    ],
    rules: [
      'docs/03-trading/REGISTRY_CONTRACTS.md é a fonte única dos campos mínimos, identificadores, chaves de versão, referências e ciclos de vida. Qualquer desvio exige novo ADR ou ordem de compatibilidade.',
      'Nenhuma versão publicada é sobrescrita; correções geram novas versões (PATCH), não edição da publicada.',
      'Depreciação não remove dados: versões deprecated permanecem legíveis para auditoria e comparação.',
    ],
  },
];

export const architectureDecisions: ArchitectureDecisions = canonicalArchitectureDecisions;

export const validateArchitectureDecisions = (data: unknown): ArchitectureDecisions => {
  return ArchitectureDecisionsSchema.parse(data);
};

export const listArchitectureDecisions = (
  scope?: ArchitectureDecisionScope,
): ArchitectureDecision[] => {
  return scope === undefined
    ? architectureDecisions
    : architectureDecisions.filter((adr) => adr.scope === scope);
};

export const getArchitectureDecision = (adrId: string): ArchitectureDecision => {
  const adr = architectureDecisions.find((candidate) => candidate.adr_id === adrId);
  if (adr === undefined) {
    throw new Error(`Unknown architecture decision: ${adrId}`);
  }
  return adr;
};

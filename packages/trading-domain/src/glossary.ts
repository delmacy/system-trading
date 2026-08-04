import { z } from 'zod';

export const GlossaryCategorySchema = z.enum([
  'entity',
  'process',
  'decision',
  'value',
  'measurement',
]);

export type GlossaryCategory = z.infer<typeof GlossaryCategorySchema>;

export const GlossaryTermStatusSchema = z.enum(['canonical', 'provisional']);

export type GlossaryTermStatus = z.infer<typeof GlossaryTermStatusSchema>;

export const GlossaryTermSchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1),
  category: GlossaryCategorySchema,
  status: GlossaryTermStatusSchema,
});

export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;

export const GlossarySchema = z
  .array(GlossaryTermSchema)
  .min(1, 'Glossary must contain at least one term')
  .superRefine((terms, ctx) => {
    const seen = new Set<string>();
    terms.forEach((entry, index) => {
      if (seen.has(entry.term)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate glossary term: ${entry.term}`,
          path: [index],
        });
      }
      seen.add(entry.term);
    });
  });

export type Glossary = z.infer<typeof GlossarySchema>;

const canonicalTerms: Glossary = [
  {
    term: 'Account',
    definition: 'Conta de execução ou simulação associada a broker, prop, ambiente e regras externas.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Allocation',
    definition: 'Parcela de capital ou risco autorizada para estratégia, conta, instrumento ou grupo.',
    category: 'decision',
    status: 'canonical',
  },
  {
    term: 'Backtest',
    definition: 'Execução histórica de uma estratégia sobre dataset versionado sob regras conhecidas.',
    category: 'process',
    status: 'canonical',
  },
  {
    term: 'Context',
    definition: 'Estado estimado do mercado, representado por evidências e scores.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Dataset',
    definition: 'Conjunto de dados identificado, versionado e auditável usado por pesquisa ou operação.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Degradation',
    definition:
      'Deterioração relevante e persistente de métricas, frequência, distribuição ou comportamento operacional.',
    category: 'measurement',
    status: 'canonical',
  },
  {
    term: 'Evidence',
    definition: 'Observação calculada ou fato registrado que sustenta ou contradiz uma hipótese.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Experiment',
    definition: 'Procedimento definido para testar uma hipótese usando dados, regras e critérios prévios.',
    category: 'process',
    status: 'canonical',
  },
  {
    term: 'Feature',
    definition: 'Variável calculada a partir de dados de mercado ou estado do sistema.',
    category: 'value',
    status: 'canonical',
  },
  {
    term: 'Fill',
    definition: 'Execução parcial ou total confirmada por broker ou simulador.',
    category: 'value',
    status: 'canonical',
  },
  {
    term: 'Hypothesis',
    definition: 'Afirmação testável sobre comportamento de mercado, estratégia, risco ou execução.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Instrument',
    definition: 'Ativo negociável com especificações, sessão e regras próprias.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Lab',
    definition: 'Espaço governado de pesquisa que contém hipóteses, experimentos e decisões.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Opportunity',
    definition: 'Agregação de sinais compatíveis que representa uma hipótese potencial de trade.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Order Intent',
    definition: 'Comando interno que descreve uma ordem desejada depois da aprovação de risco.',
    category: 'decision',
    status: 'canonical',
  },
  {
    term: 'Pattern',
    definition: 'Estrutura observável definida por critérios explícitos. Não equivale a ordem.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Portfolio',
    definition: 'Visão consolidada de capital, estratégias, contas, exposições e risco.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Position',
    definition: 'Exposição aberta em um instrumento dentro de uma conta.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Risk Decision',
    definition: 'Resultado auditável da avaliação de uma oportunidade ou exposição por políticas de risco.',
    category: 'decision',
    status: 'canonical',
  },
  {
    term: 'Shadow Trade',
    definition: 'Operação registrada sem envio de ordem real, usando condições temporais correntes ou replay.',
    category: 'process',
    status: 'canonical',
  },
  {
    term: 'Signal',
    definition: 'Evidência atômica produzida por regra, detector ou modelo.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Strategy',
    definition: 'Conjunto versionado de regras de elegibilidade, entrada, saída, manejo e risco.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Strategy Health',
    definition: 'Avaliação atual da estabilidade estatística e operacional de uma estratégia.',
    category: 'measurement',
    status: 'canonical',
  },
  {
    term: 'Trade',
    definition: 'Resultado econômico e operacional de uma posição encerrada ou unidade equivalente definida pela estratégia.',
    category: 'entity',
    status: 'canonical',
  },
  {
    term: 'Walk-Forward',
    definition: 'Processo de validação temporal que alterna janelas de calibração e teste fora da amostra.',
    category: 'process',
    status: 'canonical',
  },
];

export const glossary: Glossary = canonicalTerms;

export const validateGlossary = (data: unknown): Glossary => {
  return GlossarySchema.parse(data);
};

export const listGlossaryTerms = (category?: GlossaryCategory): GlossaryTerm[] => {
  return category === undefined
    ? glossary
    : glossary.filter((entry) => entry.category === category);
};

export const getGlossaryTerm = (term: string): GlossaryTerm => {
  const entry = glossary.find((candidate) => candidate.term === term);
  if (entry === undefined) {
    throw new Error(`Unknown glossary term: ${term}`);
  }
  return entry;
};

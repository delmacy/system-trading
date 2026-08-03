import { z } from 'zod';

export const PatternLifecycleSchema = z.enum([
  'Draft',
  'Experimental',
  'Validated',
  'Active',
  'Degraded',
  'Deprecated',
  'Archived',
]);

export type PatternLifecycle = z.infer<typeof PatternLifecycleSchema>;

const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const PatternDefinitionSchema = z.object({
  pattern_id: z.string().uuid(),
  name: z.string().min(1),
  family: z.string().min(1),
  description: z.string().min(1),
  version: z.string().regex(semverRegex, "Invalid semantic version"),
  eligible_markets: z.array(z.string().min(1)).min(1),
  eligible_timeframes: z.array(z.string().min(1)).min(1),
  required_data: z.array(z.string().min(1)).min(1),
  deterministic_criteria: z.record(z.unknown()),
  parameters: z.record(z.unknown()),
  tolerances: z.record(z.unknown()),
  favorable_contexts: z.array(z.string().min(1)),
  unfavorable_contexts: z.array(z.string().min(1)),
  invalidation_signals: z.array(z.string().min(1)),
  references: z.array(z.string().min(1)),
  status: PatternLifecycleSchema,
  author: z.string().min(1),
  authored_at: z.string().datetime(), // Enforces UTC ISO-8601
  detector_association: z.string().min(1),
});

export type PatternDefinition = z.infer<typeof PatternDefinitionSchema>;

export const validatePatternDefinition = (data: unknown): PatternDefinition => {
  return PatternDefinitionSchema.parse(data);
};

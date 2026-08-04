import { z } from 'zod';
import { VersionedReferenceSchema } from './versioned-reference.js';

export const ExperimentLifecycleSchema = z.enum([
  'Draft',
  'Experimental',
  'Validated',
  'Active',
  'Degraded',
  'Deprecated',
  'Archived',
]);

export type ExperimentLifecycle = z.infer<typeof ExperimentLifecycleSchema>;

const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const ExperimentDefinitionSchema = z.object({
  experiment_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().regex(semverRegex, 'Invalid semantic version'),
  hypothesis_reference: VersionedReferenceSchema,
  dataset_references: z.array(VersionedReferenceSchema).min(1),
  pattern_references: z.array(VersionedReferenceSchema).optional(),
  context_references: z.array(VersionedReferenceSchema).optional(),
  prior_criteria: z.array(z.string().min(1)).min(1),
  parameters: z.record(z.unknown()),
  lifecycle: ExperimentLifecycleSchema,
  author: z.string().min(1),
  authored_at: z.string().datetime(),
});

export type ExperimentDefinition = z.infer<typeof ExperimentDefinitionSchema>;

export const validateExperimentDefinition = (data: unknown): ExperimentDefinition => {
  return ExperimentDefinitionSchema.parse(data);
};

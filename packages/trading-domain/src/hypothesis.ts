import { z } from 'zod';
import { VersionedReferenceSchema } from './versioned-reference.js';

export const HypothesisLifecycleSchema = z.enum([
  'Draft',
  'Experimental',
  'Validated',
  'Active',
  'Degraded',
  'Deprecated',
  'Archived',
]);

export type HypothesisLifecycle = z.infer<typeof HypothesisLifecycleSchema>;

export const HypothesisSubjectSchema = z.enum([
  'market',
  'strategy',
  'risk',
  'execution',
]);

export type HypothesisSubject = z.infer<typeof HypothesisSubjectSchema>;

const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const HypothesisSchema = z.object({
  hypothesis_id: z.string().uuid(),
  statement: z.string().min(1),
  description: z.string().min(1),
  version: z.string().regex(semverRegex, 'Invalid semantic version'),
  subject: HypothesisSubjectSchema,
  testability_criteria: z.array(z.string().min(1)).min(1),
  lifecycle: HypothesisLifecycleSchema,
  author: z.string().min(1),
  authored_at: z.string().datetime(),
  references: z.array(z.string().min(1)).optional(),
  pattern_references: z.array(VersionedReferenceSchema).optional(),
  dataset_references: z.array(VersionedReferenceSchema).optional(),
});

export type Hypothesis = z.infer<typeof HypothesisSchema>;

export const validateHypothesis = (data: unknown): Hypothesis => {
  return HypothesisSchema.parse(data);
};

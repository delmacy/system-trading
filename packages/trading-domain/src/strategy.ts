import { z } from 'zod';
import { VersionedReferenceSchema } from './versioned-reference.js';

export const StrategyLifecycleSchema = z.enum([
  'Draft',
  'Experimental',
  'Validated',
  'Active',
  'Degraded',
  'Deprecated',
  'Archived',
]);

export type StrategyLifecycle = z.infer<typeof StrategyLifecycleSchema>;

export const RuleDescriptorSchema = z.object({
  name: z.string().min(1),
  kind: z.string().min(1),
  description: z.string().min(1),
  parameters: z.record(z.unknown()),
});

export type RuleDescriptor = z.infer<typeof RuleDescriptorSchema>;

export const StrategyRuleDescriptorsSchema = z.object({
  entry_rules: z.array(RuleDescriptorSchema).min(1),
  exit_rules: z.array(RuleDescriptorSchema).min(1),
  management_rules: z.array(RuleDescriptorSchema),
  eligibility_rules: z.array(RuleDescriptorSchema).min(1),
});

export type StrategyRuleDescriptors = z.infer<typeof StrategyRuleDescriptorsSchema>;

const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const StrategyVersionSchema = z.object({
  strategy_id: z.string().uuid(),
  version: z.string().regex(semverRegex, 'Invalid semantic version'),
  name: z.string().min(1),
  description: z.string().min(1),
  hypothesis_reference: VersionedReferenceSchema,
  experiment_reference: VersionedReferenceSchema,
  pattern_references: z.array(VersionedReferenceSchema).min(1),
  context_references: z.array(VersionedReferenceSchema).min(1),
  dataset_eligibility: z.array(VersionedReferenceSchema).min(1),
  parameter_set: z.record(z.unknown()).refine((val) => Object.keys(val).length > 0, {
    message: 'Parameter set must not be empty',
  }),
  rule_descriptors: StrategyRuleDescriptorsSchema,
  lifecycle: StrategyLifecycleSchema,
  author: z.string().min(1),
  authored_at: z.string().datetime(),
  references: z.array(z.string().min(1)).optional(),
});

export type StrategyVersion = z.infer<typeof StrategyVersionSchema>;

export const validateStrategyVersion = (data: unknown): StrategyVersion => {
  return StrategyVersionSchema.parse(data);
};

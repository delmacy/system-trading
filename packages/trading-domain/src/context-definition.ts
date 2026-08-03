import { z } from 'zod';

export const ContextDefinitionLifecycleSchema = z.enum([
  'Draft',
  'Experimental',
  'Validated',
  'Active',
  'Degraded',
  'Deprecated',
  'Archived',
]);

export type ContextDefinitionLifecycle = z.infer<typeof ContextDefinitionLifecycleSchema>;

export const ContextSupportedStateSchema = z.enum([
  'uptrend',
  'downtrend',
  'range',
  'channel',
  'compression',
  'expansion',
  'high_volatility',
  'low_volatility',
  'exhaustion',
  'reversal_attempt',
  'undefined',
]);

export type ContextSupportedState = z.infer<typeof ContextSupportedStateSchema>;

const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9A-Za-z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const ContextDefinitionSchema = z.object({
  context_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().regex(semverRegex, 'Invalid semantic version'),
  supported_states: z.array(ContextSupportedStateSchema).min(1),
  required_features: z.array(z.string().min(1)).min(1),
  parameters: z.record(z.unknown()),
  lifecycle: ContextDefinitionLifecycleSchema,
  author: z.string().min(1),
  authored_at: z.string().datetime(),
  references: z.array(z.string().min(1)).optional(),
});

export type ContextDefinition = z.infer<typeof ContextDefinitionSchema>;

export const validateContextDefinition = (data: unknown): ContextDefinition => {
  return ContextDefinitionSchema.parse(data);
};
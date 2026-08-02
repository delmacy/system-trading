import { z } from 'zod';

const SensitiveDataRegex = /(password|secret|token|key|credential)/i;

const detectSensitiveData = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return SensitiveDataRegex.test(value);
  }
  if (Array.isArray(value)) {
    return value.some(detectSensitiveData);
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).some(
      ([k, v]) => SensitiveDataRegex.test(k) || detectSensitiveData(v),
    );
  }
  return false;
};

export const EventEnvelopeSchema = z.object({
  event_id: z.string().uuid(),
  event_type: z.string().min(1),
  schema_version: z.number().int().positive(),
  occurred_at: z.string().datetime(), // ISO-8601 with timezone (UTC enforced in app logic / datetime)
  workspace_id: z.string().uuid(),
  environment: z.string().min(1),
  aggregate_type: z.string().min(1),
  aggregate_id: z.string().uuid(),
  aggregate_version: z.number().int().nonnegative(),
  correlation_id: z.string().uuid(),
  causation_id: z.string().uuid().nullable(),
  producer: z.string().min(1),
  actor: z.string().min(1),
  payload: z.record(z.unknown()).refine((val) => !detectSensitiveData(val), {
    message: 'Payload contains sensitive data',
  }),
  metadata: z.record(z.unknown()).refine((val) => !detectSensitiveData(val), {
    message: 'Metadata contains sensitive data',
  }),
});

export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;

export const validateEventEnvelope = (data: unknown): EventEnvelope => {
  return EventEnvelopeSchema.parse(data);
};

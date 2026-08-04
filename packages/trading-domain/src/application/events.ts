import { randomUUID } from 'node:crypto';
import { validateEventEnvelope, type EventEnvelope } from 'trading-protocols';
import type { EventPublisher } from './ports.js';

export interface CanonicalEventInput {
  event_type: string;
  schema_version?: number;
  workspace_id: string;
  environment: string;
  aggregate_type: string;
  aggregate_id: string;
  aggregate_version: number;
  correlation_id: string;
  causation_id?: string | null;
  producer: string;
  actor: string;
  payload: Record<string, unknown>;
}

export const buildCanonicalEvent = (input: CanonicalEventInput): EventEnvelope => {
  return validateEventEnvelope({
    event_id: randomUUID(),
    event_type: input.event_type,
    schema_version: input.schema_version ?? 1,
    occurred_at: new Date().toISOString(),
    workspace_id: input.workspace_id,
    environment: input.environment,
    aggregate_type: input.aggregate_type,
    aggregate_id: input.aggregate_id,
    aggregate_version: input.aggregate_version,
    correlation_id: input.correlation_id,
    causation_id: input.causation_id ?? null,
    producer: input.producer,
    actor: input.actor,
    payload: input.payload,
    metadata: {},
  });
};

export const publishEvent = async (
  publisher: EventPublisher,
  event: EventEnvelope,
): Promise<EventEnvelope> => {
  await publisher.publish(event);
  return event;
};

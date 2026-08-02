import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateEventEnvelope } from '../src/event-envelope.js';
import crypto from 'node:crypto';

describe('EventEnvelope validation', () => {
  const validEvent = {
    event_id: crypto.randomUUID(),
    event_type: 'StrategyCreated',
    schema_version: 1,
    occurred_at: '2023-01-01T12:00:00.000Z',
    workspace_id: crypto.randomUUID(),
    environment: 'research',
    aggregate_type: 'strategy',
    aggregate_id: crypto.randomUUID(),
    aggregate_version: 1,
    correlation_id: crypto.randomUUID(),
    causation_id: null,
    producer: 'test-worker',
    actor: 'test-user',
    payload: { some_data: 123 },
    metadata: { some_meta: 'abc' },
  };

  test('should validate a valid event envelope deterministically', () => {
    const result1 = validateEventEnvelope(validEvent);
    const result2 = validateEventEnvelope(validEvent);

    assert.deepStrictEqual(result1, validEvent);
    assert.deepStrictEqual(result2, validEvent);
  });

  test('should reject missing mandatory fields', () => {
    const { event_id: _event_id, ...missingFields } = validEvent;
    assert.throws(() => validateEventEnvelope(missingFields), /Required/);
  });

  test('should reject invalid schema_version (0 or negative)', () => {
    assert.throws(() => validateEventEnvelope({ ...validEvent, schema_version: 0 }), /Number must be greater than 0/);
    assert.throws(() => validateEventEnvelope({ ...validEvent, schema_version: -1 }), /Number must be greater than 0/);
  });

  test('should reject invalid timestamp (not ISO-8601)', () => {
    assert.throws(() => validateEventEnvelope({ ...validEvent, occurred_at: '2023/01/01 12:00:00' }), /Invalid datetime/);
  });

  test('should reject sensitive data in payload keys', () => {
    assert.throws(() => validateEventEnvelope({ ...validEvent, payload: { password: '123' } }), /Payload contains sensitive data/);
    assert.throws(() => validateEventEnvelope({ ...validEvent, payload: { userToken: 'abc' } }), /Payload contains sensitive data/);
  });

  test('should reject sensitive data in payload values (strings)', () => {
    assert.throws(() => validateEventEnvelope({ ...validEvent, payload: { somedata: 'my secret here' } }), /Payload contains sensitive data/);
  });

  test('should reject sensitive data in metadata', () => {
    assert.throws(() => validateEventEnvelope({ ...validEvent, metadata: { apiKey: '123' } }), /Metadata contains sensitive data/);
  });

  test('should reject sensitive data in nested payload structures', () => {
    assert.throws(() => validateEventEnvelope({
      ...validEvent,
      payload: {
        nested: {
          array: [{ innerKey: 'val', password_hash: 'abc' }]
        }
      }
    }), /Payload contains sensitive data/);
  });
});

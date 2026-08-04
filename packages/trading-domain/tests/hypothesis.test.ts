import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { validateHypothesis } from '../src/hypothesis.js';

describe('Hypothesis', () => {
  const validHypothesis = {
    hypothesis_id: '123e4567-e89b-12d3-a456-426614174000',
    statement: 'Bullish engulfing after support leads to higher highs within five candles',
    description: 'Tests the continuation hypothesis of bullish engulfing at support',
    version: '1.0.0',
    subject: 'market',
    testability_criteria: [
      'requires at least 100 observed samples',
      'defines a measurable forward window of five candles',
    ],
    lifecycle: 'Draft',
    author: 'jules@delmacy',
    authored_at: '2023-10-25T10:00:00Z',
  };

  it('should validate a correct Hypothesis', () => {
    const result = validateHypothesis(validHypothesis);
    assert.deepStrictEqual(result, validHypothesis);
  });

  it('should accept optional references to patterns and datasets', () => {
    const withReferences = {
      ...validHypothesis,
      references: ['docs/hypotheses/engulfing-continuation.md'],
      pattern_references: [
        { id: '123e4567-e89b-12d3-a456-426614174001', version: '1.0.0' },
      ],
      dataset_references: [
        { id: '123e4567-e89b-12d3-a456-426614174002', version: '2.1.0' },
      ],
    };
    const result = validateHypothesis(withReferences);
    assert.strictEqual(result.pattern_references?.length, 1);
    assert.strictEqual(result.dataset_references?.length, 1);
  });

  it('should accept each of the seven documented lifecycle states', () => {
    const lifecycles = [
      'Draft',
      'Experimental',
      'Validated',
      'Active',
      'Degraded',
      'Deprecated',
      'Archived',
    ];

    for (const lifecycle of lifecycles) {
      const result = validateHypothesis({ ...validHypothesis, lifecycle });
      assert.strictEqual(result.lifecycle, lifecycle);
    }
  });

  it('should accept each documented subject', () => {
    const subjects = ['market', 'strategy', 'risk', 'execution'];

    for (const subject of subjects) {
      const result = validateHypothesis({ ...validHypothesis, subject });
      assert.strictEqual(result.subject, subject);
    }
  });

  it('should reject invalid UUID for hypothesis_id', () => {
    assert.throws(() => {
      validateHypothesis({ ...validHypothesis, hypothesis_id: 'invalid-uuid' });
    }, /Invalid uuid/i);
  });

  it('should reject invalid semantic version', () => {
    assert.throws(() => {
      validateHypothesis({ ...validHypothesis, version: 'v1.0' });
    }, /Invalid semantic version/i);
  });

  it('should reject an invalid subject', () => {
    assert.throws(() => {
      validateHypothesis({ ...validHypothesis, subject: 'operations' });
    }, /Invalid enum value/i);
  });

  it('should reject empty statement', () => {
    assert.throws(() => {
      validateHypothesis({ ...validHypothesis, statement: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject empty testability_criteria', () => {
    assert.throws(() => {
      validateHypothesis({ ...validHypothesis, testability_criteria: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject invalid authored_at (not ISO-8601 UTC)', () => {
    assert.throws(() => {
      validateHypothesis({ ...validHypothesis, authored_at: '2023-10-25 10:00:00' });
    }, /Invalid datetime/i);
  });

  it('should reject invalid lifecycle', () => {
    assert.throws(() => {
      validateHypothesis({ ...validHypothesis, lifecycle: 'Running' });
    }, /Invalid enum value/i);
  });

  it('should reject a pattern_reference with invalid id', () => {
    assert.throws(() => {
      validateHypothesis({
        ...validHypothesis,
        pattern_references: [{ id: 'invalid-uuid', version: '1.0.0' }],
      });
    }, /Invalid uuid/i);
  });

  it('should reject a pattern_reference with empty version', () => {
    assert.throws(() => {
      validateHypothesis({
        ...validHypothesis,
        pattern_references: [
          { id: '123e4567-e89b-12d3-a456-426614174001', version: '' },
        ],
      });
    }, /String must contain at least 1 character/i);
  });
});

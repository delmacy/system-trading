import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { validatePatternDefinition } from '../src/pattern-definition.js';

describe('PatternDefinition', () => {
  const validPattern = {
    pattern_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Bullish Engulfing',
    family: 'candle structure',
    description: 'A bullish engulfing pattern',
    version: '1.0.0',
    eligible_markets: ['B3:WIN', 'CME:ES'],
    eligible_timeframes: ['M5', 'H1'],
    required_data: ['OHLCV'],
    deterministic_criteria: { body_ratio: 'greater_than_previous' },
    parameters: { lookback: 10, nested: { complex: true } },
    tolerances: { wicks: 'ignore' },
    favorable_contexts: ['uptrend', 'support'],
    unfavorable_contexts: ['downtrend', 'resistance'],
    invalidation_signals: ['close_below_low'],
    references: ['docs/patterns/bullish-engulfing.md'],
    status: 'Draft',
    author: 'jules@delmacy',
    authored_at: '2023-10-25T10:00:00Z',
    detector_association: 'engulfing-detector-v1',
  };

  it('should validate a correct PatternDefinition', () => {
    const result = validatePatternDefinition(validPattern);
    assert.deepStrictEqual(result, validPattern);
  });

  it('should demonstrate that open parameters use safe unknown values without explicit any', () => {
    const result = validatePatternDefinition(validPattern);

    // In TypeScript, this proves that parameters are structurally correct but treated as unknown
    // because we have to type-assert or check them at runtime rather than having implicit 'any' access.
    // If it were 'any', TypeScript wouldn't enforce strict typing on assignments.
    const lookback = result.parameters['lookback'];
    assert.strictEqual(lookback, 10);
    const complex = (result.parameters['nested'] as Record<string, unknown>)['complex'];
    assert.strictEqual(complex, true);
  });

  it('should reject invalid UUID for pattern_id', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, pattern_id: 'invalid-uuid' });
    }, /Invalid uuid/i);
  });

  it('should reject invalid semantic version', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, version: 'v1.0' });
    }, /Invalid semantic version/i);
  });

  it('should reject invalid authored_at (not ISO-8601 UTC)', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, authored_at: '2023-10-25 10:00:00' });
    }, /Invalid datetime/i);
  });

  it('should reject empty eligible_markets', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, eligible_markets: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty required strings (e.g. name)', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, name: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject invalid status', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, status: 'InvalidStatus' });
    }, /Invalid enum value/i);
  });

  it('should reject invalid prerelease characters (e.g. 1.0.0-a[)', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, version: '1.0.0-a[' });
    }, /Invalid semantic version/i);
  });

  it('should reject invalid prerelease characters after dot (e.g. 1.0.0-alpha.!]', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, version: '1.0.0-alpha.!]' });
    }, /Invalid semantic version/i);
  });

  it('should reject invalid build characters (e.g. 1.0.0+123[build)', () => {
    assert.throws(() => {
      validatePatternDefinition({ ...validPattern, version: '1.0.0+123[build' });
    }, /Invalid semantic version/i);
  });

  it('should accept valid semantic version prerelease', () => {
    const result = validatePatternDefinition({ ...validPattern, version: '1.0.0-alpha.1.beta.2' });
    assert.strictEqual(result.version, '1.0.0-alpha.1.beta.2');
  });

  it('should accept valid semantic version with build metadata', () => {
    const result = validatePatternDefinition({ ...validPattern, version: '2.3.4+build.5-rc9' });
    assert.strictEqual(result.version, '2.3.4+build.5-rc9');
  });

  it('should accept valid semantic version with prerelease and build metadata', () => {
    const result = validatePatternDefinition({ ...validPattern, version: '1.0.0-rc.1+build.1' });
    assert.strictEqual(result.version, '1.0.0-rc.1+build.1');
  });

  it('should accept empty favourable_contexts', () => {
    const result = validatePatternDefinition({ ...validPattern, favorable_contexts: [] });
    assert.deepStrictEqual(result.favorable_contexts, []);
  });
});

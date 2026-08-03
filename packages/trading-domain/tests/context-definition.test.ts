import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { validateContextDefinition } from '../src/context-definition.js';

describe('ContextDefinition', () => {
  const validContext = {
    context_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'High Volatility Regime',
    description: 'A context defined for high volatility market states',
    version: '1.0.0',
    supported_states: ['high_volatility', 'expansion'],
    required_features: ['atr', 'relative_range'],
    parameters: { atr_window: 14, lookback: 100 },
    lifecycle: 'Draft',
    author: 'jules@delmacy',
    authored_at: '2023-10-25T10:00:00Z',
    references: ['docs/contexts/high-volatility.md'],
  };

  it('should validate a correct ContextDefinition', () => {
    const result = validateContextDefinition(validContext);
    assert.deepStrictEqual(result, validContext);
  });

  it('should demonstrate that open parameters use safe unknown values without explicit any', () => {
    const result = validateContextDefinition(validContext);

    const atrWindow = result.parameters['atr_window'];
    assert.strictEqual(atrWindow, 14);
    const lookback = result.parameters['lookback'];
    assert.strictEqual(lookback, 100);
  });

  it('should accept every documented supported market state', () => {
    const allStates = [
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
    ];

    const result = validateContextDefinition({ ...validContext, supported_states: allStates });
    assert.deepStrictEqual(result.supported_states, allStates);
  });

  it('should reject invalid UUID for context_id', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, context_id: 'invalid-uuid' });
    }, /Invalid uuid/i);
  });

  it('should reject invalid semantic version', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, version: 'v1.0' });
    }, /Invalid semantic version/i);
  });

  it('should accept valid semantic version prerelease', () => {
    const result = validateContextDefinition({ ...validContext, version: '1.0.0-alpha.1.beta.2' });
    assert.strictEqual(result.version, '1.0.0-alpha.1.beta.2');
  });

  it('should accept valid semantic version with build metadata', () => {
    const result = validateContextDefinition({ ...validContext, version: '2.3.4+build.5-rc9' });
    assert.strictEqual(result.version, '2.3.4+build.5-rc9');
  });

  it('should accept valid semantic version with prerelease and build metadata', () => {
    const result = validateContextDefinition({ ...validContext, version: '1.0.0-rc.1+build.1' });
    assert.strictEqual(result.version, '1.0.0-rc.1+build.1');
  });

  it('should reject invalid authored_at (not ISO-8601 UTC)', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, authored_at: '2023-10-25 10:00:00' });
    }, /Invalid datetime/i);
  });

  it('should reject empty supported_states', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, supported_states: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject a supported state outside the documented set', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, supported_states: ['bullish_momentum'] });
    }, /Invalid enum value/i);
  });

  it('should reject empty required_features', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, required_features: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty required strings (e.g. name)', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, name: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject empty required strings (e.g. description)', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, description: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject empty required strings (e.g. author)', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, author: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject invalid lifecycle', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, lifecycle: 'Running' });
    }, /Invalid enum value/i);
  });

  it('should accept each of the seven documented definition lifecycle states', () => {
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
      const result = validateContextDefinition({ ...validContext, lifecycle });
      assert.strictEqual(result.lifecycle, lifecycle);
    }
  });

  it('should accept a definition without optional references', () => {
    const { references: _references, ...withoutReferences } = validContext;
    const result = validateContextDefinition(withoutReferences);
    assert.strictEqual(result.references, undefined);
  });

  it('should reject a reference that is an empty string', () => {
    assert.throws(() => {
      validateContextDefinition({ ...validContext, references: [''] });
    }, /String must contain at least 1 character/i);
  });
});

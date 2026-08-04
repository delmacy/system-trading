import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { validateStrategyVersion } from '../src/strategy.js';

describe('StrategyVersion', () => {
  const validStrategy = {
    strategy_id: '123e4567-e89b-12d3-a456-426614174000',
    version: '1.0.0',
    name: 'Engulfing Continuation',
    description: 'Entries on bullish engulfing at support with defined risk',
    hypothesis_reference: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      version: '1.0.0',
    },
    experiment_reference: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      version: '1.0.0',
    },
    pattern_references: [
      { id: '123e4567-e89b-12d3-a456-426614174003', version: '1.2.0' },
    ],
    context_references: [
      { id: '123e4567-e89b-12d3-a456-426614174004', version: '0.9.0' },
    ],
    dataset_eligibility: [
      { id: '123e4567-e89b-12d3-a456-426614174005', version: '2.1.0' },
    ],
    parameter_set: { risk_per_trade: 0.01, max_positions: 1 },
    rule_descriptors: {
      entry_rules: [
        { name: 'engulfing_entry', kind: 'pattern', description: 'Enter on validated engulfing', parameters: {} },
      ],
      exit_rules: [
        { name: 'target_exit', kind: 'fixed', description: 'Exit at 2R target', parameters: { multiple: 2 } },
      ],
      management_rules: [],
      eligibility_rules: [
        { name: 'dataset_eligible', kind: 'dataset', description: 'Only eligible datasets', parameters: {} },
      ],
    },
    lifecycle: 'Draft',
    author: 'jules@delmacy',
    authored_at: '2023-10-25T10:00:00Z',
  };

  it('should validate a correct StrategyVersion', () => {
    const result = validateStrategyVersion(validStrategy);
    assert.deepStrictEqual(result, validStrategy);
  });

  it('should demonstrate that open parameters use safe unknown values without explicit any', () => {
    const result = validateStrategyVersion(validStrategy);
    const riskPerTrade = result.parameter_set['risk_per_trade'];
    assert.strictEqual(riskPerTrade, 0.01);
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
      const result = validateStrategyVersion({ ...validStrategy, lifecycle });
      assert.strictEqual(result.lifecycle, lifecycle);
    }
  });

  it('should accept optional external references', () => {
    const result = validateStrategyVersion({
      ...validStrategy,
      references: ['docs/strategies/engulfing-continuation.md'],
    });
    assert.strictEqual(result.references?.length, 1);
  });

  it('should reject invalid UUID for strategy_id', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, strategy_id: 'invalid-uuid' });
    }, /Invalid uuid/i);
  });

  it('should reject invalid semantic version', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, version: 'v1.0' });
    }, /Invalid semantic version/i);
  });

  it('should reject empty pattern_references', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, pattern_references: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty context_references', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, context_references: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty dataset_eligibility', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, dataset_eligibility: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty parameter_set', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, parameter_set: {} });
    }, /Parameter set must not be empty/i);
  });

  it('should reject empty entry_rules', () => {
    assert.throws(() => {
      validateStrategyVersion({
        ...validStrategy,
        rule_descriptors: { ...validStrategy.rule_descriptors, entry_rules: [] },
      });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty exit_rules', () => {
    assert.throws(() => {
      validateStrategyVersion({
        ...validStrategy,
        rule_descriptors: { ...validStrategy.rule_descriptors, exit_rules: [] },
      });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty eligibility_rules', () => {
    assert.throws(() => {
      validateStrategyVersion({
        ...validStrategy,
        rule_descriptors: { ...validStrategy.rule_descriptors, eligibility_rules: [] },
      });
    }, /Array must contain at least 1 element/i);
  });

  it('should accept empty management_rules', () => {
    const result = validateStrategyVersion(validStrategy);
    assert.deepStrictEqual(result.rule_descriptors.management_rules, []);
  });

  it('should reject a rule descriptor with empty name', () => {
    assert.throws(() => {
      validateStrategyVersion({
        ...validStrategy,
        rule_descriptors: {
          ...validStrategy.rule_descriptors,
          entry_rules: [{ name: '', kind: 'pattern', description: 'Entry', parameters: {} }],
        },
      });
    }, /String must contain at least 1 character/i);
  });

  it('should reject invalid authored_at (not ISO-8601 UTC)', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, authored_at: '2023-10-25 10:00:00' });
    }, /Invalid datetime/i);
  });

  it('should reject invalid lifecycle', () => {
    assert.throws(() => {
      validateStrategyVersion({ ...validStrategy, lifecycle: 'Running' });
    }, /Invalid enum value/i);
  });
});

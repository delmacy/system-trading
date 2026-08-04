import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { validateExperimentDefinition } from '../src/experiment-definition.js';

describe('ExperimentDefinition', () => {
  const validExperiment = {
    experiment_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Engulfing Continuation Study',
    description: 'Evaluates the continuation hypothesis of bullish engulfing at support',
    version: '1.0.0',
    hypothesis_reference: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      version: '1.0.0',
    },
    dataset_references: [
      { id: '123e4567-e89b-12d3-a456-426614174002', version: '2.1.0' },
    ],
    prior_criteria: [
      'at least 100 observed samples',
      'positive expectancy before promotion',
    ],
    parameters: { forward_window: 5, min_samples: 100 },
    lifecycle: 'Draft',
    author: 'jules@delmacy',
    authored_at: '2023-10-25T10:00:00Z',
  };

  it('should validate a correct ExperimentDefinition', () => {
    const result = validateExperimentDefinition(validExperiment);
    assert.deepStrictEqual(result, validExperiment);
  });

  it('should accept optional pattern and context references', () => {
    const withReferences = {
      ...validExperiment,
      pattern_references: [
        { id: '123e4567-e89b-12d3-a456-426614174003', version: '1.2.0' },
      ],
      context_references: [
        { id: '123e4567-e89b-12d3-a456-426614174004', version: '0.9.0' },
      ],
    };
    const result = validateExperimentDefinition(withReferences);
    assert.strictEqual(result.pattern_references?.length, 1);
    assert.strictEqual(result.context_references?.length, 1);
  });

  it('should demonstrate that open parameters use safe unknown values without explicit any', () => {
    const result = validateExperimentDefinition(validExperiment);
    const forwardWindow = result.parameters['forward_window'];
    assert.strictEqual(forwardWindow, 5);
  });

  it('should reject an experiment without a hypothesis_reference', () => {
    const { hypothesis_reference: _hypothesis_reference, ...withoutHypothesis } = validExperiment;
    assert.throws(() => {
      validateExperimentDefinition(withoutHypothesis);
    }, /Required/i);
  });

  it('should reject empty dataset_references', () => {
    assert.throws(() => {
      validateExperimentDefinition({ ...validExperiment, dataset_references: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty prior_criteria', () => {
    assert.throws(() => {
      validateExperimentDefinition({ ...validExperiment, prior_criteria: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject invalid UUID for experiment_id', () => {
    assert.throws(() => {
      validateExperimentDefinition({ ...validExperiment, experiment_id: 'invalid-uuid' });
    }, /Invalid uuid/i);
  });

  it('should reject invalid semantic version', () => {
    assert.throws(() => {
      validateExperimentDefinition({ ...validExperiment, version: 'v1.0' });
    }, /Invalid semantic version/i);
  });

  it('should reject invalid hypothesis reference id', () => {
    assert.throws(() => {
      validateExperimentDefinition({
        ...validExperiment,
        hypothesis_reference: { id: 'invalid-uuid', version: '1.0.0' },
      });
    }, /Invalid uuid/i);
  });

  it('should reject invalid hypothesis reference version', () => {
    assert.throws(() => {
      validateExperimentDefinition({
        ...validExperiment,
        hypothesis_reference: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          version: '',
        },
      });
    }, /String must contain at least 1 character/i);
  });

  it('should reject a dataset reference with invalid id', () => {
    assert.throws(() => {
      validateExperimentDefinition({
        ...validExperiment,
        dataset_references: [{ id: 'invalid-uuid', version: '2.1.0' }],
      });
    }, /Invalid uuid/i);
  });

  it('should reject invalid authored_at (not ISO-8601 UTC)', () => {
    assert.throws(() => {
      validateExperimentDefinition({ ...validExperiment, authored_at: '2023-10-25 10:00:00' });
    }, /Invalid datetime/i);
  });

  it('should reject invalid lifecycle', () => {
    assert.throws(() => {
      validateExperimentDefinition({ ...validExperiment, lifecycle: 'Running' });
    }, /Invalid enum value/i);
  });
});

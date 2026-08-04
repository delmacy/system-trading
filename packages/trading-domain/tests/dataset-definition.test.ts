import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { validateDatasetDefinition } from '../src/dataset-definition.js';

describe('DatasetDefinition', () => {
  const validDataset = {
    dataset_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'B3 WIN OHLC M5',
    description: 'Minute candles for the B3 WIN futures contract',
    source: 'provider-x',
    license: 'internal-restricted',
    instruments: ['B3:WIN'],
    resolution: 'M5',
    period: {
      start: '2023-01-01T00:00:00Z',
      end: '2023-12-31T23:55:00Z',
    },
    timezone: 'America/Sao_Paulo',
    schema_reference: 'ohlc-csv-v1',
    version: '1.0.0',
    checksum: 'sha256:deadbeef',
    transformations: [],
    adjustments: [],
    known_gaps: [],
    artifact_location: 's3://datasets/b3-win-m5/2023',
    ingested_at: '2024-01-05T10:00:00Z',
    owner: 'data-team@delmacy',
    lifecycle: 'Ready',
  };

  it('should validate a correct DatasetDefinition', () => {
    const result = validateDatasetDefinition(validDataset);
    assert.deepStrictEqual(result, validDataset);
  });

  it('should accept a dataset with lineage information', () => {
    const withLineage = {
      ...validDataset,
      lineage: [
        {
          source_dataset_id: '123e4567-e89b-12d3-a456-426614174001',
          source_version: '0.9.0',
          transformation: 'clean-gaps',
          code_version: '1.2.3',
          parameters: { max_gap_ratio: 0.01 },
          timestamp: '2024-01-04T09:00:00Z',
          output_artifact: 's3://datasets/b3-win-m5/2023/clean',
        },
      ],
    };
    const result = validateDatasetDefinition(withLineage);
    assert.strictEqual(result.lineage?.length, 1);
  });

  it('should accept empty transformations, adjustments and known_gaps', () => {
    const result = validateDatasetDefinition(validDataset);
    assert.deepStrictEqual(result.transformations, []);
    assert.deepStrictEqual(result.adjustments, []);
    assert.deepStrictEqual(result.known_gaps, []);
  });

  it('should accept a quality report reference', () => {
    const result = validateDatasetDefinition({
      ...validDataset,
      quality_report_reference: 'reports/2023-quality.json',
    });
    assert.strictEqual(result.quality_report_reference, 'reports/2023-quality.json');
  });

  it('should accept each of the seven documented dataset lifecycle states', () => {
    const lifecycles = [
      'Draft',
      'Importing',
      'Validating',
      'Ready',
      'Restricted',
      'Deprecated',
      'Archived',
    ];

    for (const lifecycle of lifecycles) {
      const result = validateDatasetDefinition({ ...validDataset, lifecycle });
      assert.strictEqual(result.lifecycle, lifecycle);
    }
  });

  it('should reject invalid UUID for dataset_id', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, dataset_id: 'invalid-uuid' });
    }, /Invalid uuid/i);
  });

  it('should reject empty instruments', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, instruments: [] });
    }, /Array must contain at least 1 element/i);
  });

  it('should reject empty required strings (e.g. source)', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, source: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject empty checksum', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, checksum: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject empty version', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, version: '' });
    }, /String must contain at least 1 character/i);
  });

  it('should reject invalid ingested_at (not ISO-8601 UTC)', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, ingested_at: '2024-01-05 10:00:00' });
    }, /Invalid datetime/i);
  });

  it('should reject invalid period timestamps', () => {
    assert.throws(() => {
      validateDatasetDefinition({
        ...validDataset,
        period: { start: '2023-01-01', end: '2023-12-31' },
      });
    }, /Invalid datetime/i);
  });

  it('should reject invalid lifecycle', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, lifecycle: 'Running' });
    }, /Invalid enum value/i);
  });

  it('should reject a transformation that is an empty string', () => {
    assert.throws(() => {
      validateDatasetDefinition({ ...validDataset, transformations: [''] });
    }, /String must contain at least 1 character/i);
  });

  it('should reject an invalid source_dataset_id in lineage', () => {
    assert.throws(() => {
      validateDatasetDefinition({
        ...validDataset,
        lineage: [
          {
            source_dataset_id: 'invalid-uuid',
            source_version: '0.9.0',
            transformation: 'clean-gaps',
            code_version: '1.2.3',
            parameters: {},
            timestamp: '2024-01-04T09:00:00Z',
            output_artifact: 's3://datasets/clean',
          },
        ],
      });
    }, /Invalid uuid/i);
  });

  it('should reject invalid lineage timestamp', () => {
    assert.throws(() => {
      validateDatasetDefinition({
        ...validDataset,
        lineage: [
          {
            source_dataset_id: '123e4567-e89b-12d3-a456-426614174001',
            source_version: '0.9.0',
            transformation: 'clean-gaps',
            code_version: '1.2.3',
            parameters: {},
            timestamp: 'not-a-date',
            output_artifact: 's3://datasets/clean',
          },
        ],
      });
    }, /Invalid datetime/i);
  });

  it('should reject a lineage entry with empty transformation', () => {
    assert.throws(() => {
      validateDatasetDefinition({
        ...validDataset,
        lineage: [
          {
            source_dataset_id: '123e4567-e89b-12d3-a456-426614174001',
            source_version: '0.9.0',
            transformation: '',
            code_version: '1.2.3',
            parameters: {},
            timestamp: '2024-01-04T09:00:00Z',
            output_artifact: 's3://datasets/clean',
          },
        ],
      });
    }, /String must contain at least 1 character/i);
  });
});

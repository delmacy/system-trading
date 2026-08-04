import type { PatternDefinition } from '../../src/pattern-definition.js';
import type { ContextDefinition } from '../../src/context-definition.js';
import type { DatasetDefinition } from '../../src/dataset-definition.js';
import type { Hypothesis } from '../../src/hypothesis.js';
import type { ExperimentDefinition } from '../../src/experiment-definition.js';
import type { StrategyVersion } from '../../src/strategy.js';

const BASE_PATTERN_ID = '123e4567-e89b-12d3-a456-426614174010';
const BASE_CONTEXT_ID = '123e4567-e89b-12d3-a456-426614174011';
const BASE_DATASET_ID = '123e4567-e89b-12d3-a456-426614174012';
const BASE_HYPOTHESIS_ID = '123e4567-e89b-12d3-a456-426614174013';
const BASE_EXPERIMENT_ID = '123e4567-e89b-12d3-a456-426614174014';
const BASE_STRATEGY_ID = '123e4567-e89b-12d3-a456-426614174015';

export const makePattern = (id?: string): PatternDefinition => ({
  pattern_id: id ?? BASE_PATTERN_ID,
  name: 'Bullish Engulfing',
  family: 'candle structure',
  description: 'A bullish engulfing pattern',
  version: '1.0.0',
  eligible_markets: ['B3:WIN'],
  eligible_timeframes: ['M5'],
  required_data: ['OHLCV'],
  deterministic_criteria: { body_ratio: 'greater_than_previous' },
  parameters: {},
  tolerances: {},
  favorable_contexts: ['uptrend'],
  unfavorable_contexts: [],
  invalidation_signals: [],
  references: [],
  status: 'Draft',
  author: 'jules@delmacy',
  authored_at: '2023-10-25T10:00:00Z',
  detector_association: 'engulfing-detector-v1',
});

export const makeContext = (): ContextDefinition => ({
  context_id: BASE_CONTEXT_ID,
  name: 'High Volatility',
  description: 'High volatility context',
  version: '1.0.0',
  supported_states: ['high_volatility'],
  required_features: ['atr'],
  parameters: {},
  lifecycle: 'Draft',
  author: 'jules@delmacy',
  authored_at: '2023-10-25T10:00:00Z',
});

export const makeDataset = (): DatasetDefinition => ({
  dataset_id: BASE_DATASET_ID,
  name: 'B3 WIN M5',
  description: 'M5 candles',
  source: 'provider',
  license: 'internal',
  instruments: ['B3:WIN'],
  resolution: 'M5',
  period: { start: '2023-01-01T00:00:00Z', end: '2023-12-31T23:55:00Z' },
  timezone: 'America/Sao_Paulo',
  schema_reference: 'ohlc-csv-v1',
  version: '1.0.0',
  checksum: 'sha256:abc',
  transformations: [],
  adjustments: [],
  known_gaps: [],
  artifact_location: 's3://datasets/b3-win',
  ingested_at: '2024-01-05T10:00:00Z',
  owner: 'data@delmacy',
  lifecycle: 'Ready',
});

export const makeHypothesis = (): Hypothesis => ({
  hypothesis_id: BASE_HYPOTHESIS_ID,
  statement: 'Bullish engulfing at support leads to higher highs',
  description: 'Continuation hypothesis',
  version: '1.0.0',
  subject: 'market',
  testability_criteria: ['at least 100 samples'],
  lifecycle: 'Draft',
  author: 'jules@delmacy',
  authored_at: '2023-10-25T10:00:00Z',
});

export const makeExperiment = (): ExperimentDefinition => ({
  experiment_id: BASE_EXPERIMENT_ID,
  name: 'Engulfing Study',
  description: 'Evaluates continuation hypothesis',
  version: '1.0.0',
  hypothesis_reference: { id: BASE_HYPOTHESIS_ID, version: '1.0.0' },
  dataset_references: [{ id: BASE_DATASET_ID, version: '1.0.0' }],
  prior_criteria: ['at least 100 samples'],
  parameters: {},
  lifecycle: 'Draft',
  author: 'jules@delmacy',
  authored_at: '2023-10-25T10:00:00Z',
});

export const makeStrategy = (): StrategyVersion => ({
  strategy_id: BASE_STRATEGY_ID,
  version: '1.0.0',
  name: 'Engulfing Continuation',
  description: 'Entries on bullish engulfing at support',
  hypothesis_reference: { id: BASE_HYPOTHESIS_ID, version: '1.0.0' },
  experiment_reference: { id: BASE_EXPERIMENT_ID, version: '1.0.0' },
  pattern_references: [{ id: BASE_PATTERN_ID, version: '1.0.0' }],
  context_references: [{ id: BASE_CONTEXT_ID, version: '1.0.0' }],
  dataset_eligibility: [{ id: BASE_DATASET_ID, version: '1.0.0' }],
  parameter_set: { risk_per_trade: 0.01 },
  rule_descriptors: {
    entry_rules: [{ name: 'entry', kind: 'pattern', description: 'Entry', parameters: {} }],
    exit_rules: [{ name: 'exit', kind: 'fixed', description: 'Exit', parameters: {} }],
    management_rules: [],
    eligibility_rules: [{ name: 'eligible', kind: 'dataset', description: 'Eligible', parameters: {} }],
  },
  lifecycle: 'Draft',
  author: 'jules@delmacy',
  authored_at: '2023-10-25T10:00:00Z',
});

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import type { EventEnvelope } from 'trading-protocols';
import type { PatternDefinition } from '../../src/pattern-definition.js';
import type { ContextDefinition } from '../../src/context-definition.js';
import type { DatasetDefinition } from '../../src/dataset-definition.js';
import type { Hypothesis } from '../../src/hypothesis.js';
import type { ExperimentDefinition } from '../../src/experiment-definition.js';
import type { StrategyVersion } from '../../src/strategy.js';
import type {
  ContextStore,
  DatasetStore,
  ExperimentStore,
  HypothesisStore,
  PatternStore,
  StrategyStore,
  RegistryReferenceLookup,
  EventPublisher,
} from '../../src/application/ports.js';
import {
  registerPattern,
  queryPattern,
  publishPatternVersion,
  registerContext,
  queryContext,
  registerDataset,
  queryDataset,
  registerHypothesis,
  queryHypothesis,
  registerExperiment,
  queryExperiment,
  registerStrategy,
  queryStrategy,
  publishStrategyVersion,
  type CommandContext,
} from '../../src/application/registry.js';
import {
  RegistryNotFoundError,
  RegistryReferenceNotFoundError,
  RegistryVersionExistsError,
  RegistryVersionPublishedError,
} from '../../src/application/errors.js';

const ctx: CommandContext = {
  workspace_id: '123e4567-e89b-12d3-a456-426614174000',
  environment: 'research',
  actor: 'jules@delmacy',
  producer: 'registry-test',
  correlation_id: '123e4567-e89b-12d3-a456-426614174001',
};

class InMemoryRegistry implements PatternStore, ContextStore, DatasetStore, HypothesisStore, ExperimentStore, StrategyStore, RegistryReferenceLookup {
  patterns = new Map<string, PatternDefinition>();
  contexts = new Map<string, ContextDefinition>();
  datasets = new Map<string, DatasetDefinition>();
  hypotheses = new Map<string, Hypothesis>();
  experiments = new Map<string, ExperimentDefinition>();
  strategies = new Map<string, StrategyVersion>();

  private key(id: string, version: string): string {
    return `${id}@${version}`;
  }

  async patternExists(id: string, version: string): Promise<boolean> {
    return this.patterns.has(this.key(id, version));
  }

  async contextExists(id: string, version: string): Promise<boolean> {
    return this.contexts.has(this.key(id, version));
  }

  async datasetExists(id: string, version: string): Promise<boolean> {
    return this.datasets.has(this.key(id, version));
  }

  async hypothesisExists(id: string, version: string): Promise<boolean> {
    return this.hypotheses.has(this.key(id, version));
  }

  async experimentExists(id: string, version: string): Promise<boolean> {
    return this.experiments.has(this.key(id, version));
  }

  async save(pattern: PatternDefinition): Promise<void>;
  async save(context: ContextDefinition): Promise<void>;
  async save(dataset: DatasetDefinition): Promise<void>;
  async save(hypothesis: Hypothesis): Promise<void>;
  async save(experiment: ExperimentDefinition): Promise<void>;
  async save(strategy: StrategyVersion): Promise<void>;
  async save(
    record:
      | PatternDefinition
      | ContextDefinition
      | DatasetDefinition
      | Hypothesis
      | ExperimentDefinition
      | StrategyVersion,
  ): Promise<void> {
    const key = this.key(String(record['pattern_id'] ?? record['context_id'] ?? record['dataset_id'] ?? record['hypothesis_id'] ?? record['experiment_id'] ?? record['strategy_id']), String(record['version']));
    const aggregateType = 'pattern_id' in record ? 'pattern' : 'context_id' in record ? 'context' : 'dataset_id' in record ? 'dataset' : 'hypothesis_id' in record ? 'hypothesis' : 'experiment_id' in record ? 'experiment' : 'strategy';
    if (aggregateType === 'pattern') {
      this.patterns.set(key, record as PatternDefinition);
    } else if (aggregateType === 'context') {
      this.contexts.set(key, record as ContextDefinition);
    } else if (aggregateType === 'dataset') {
      this.datasets.set(key, record as DatasetDefinition);
    } else if (aggregateType === 'hypothesis') {
      this.hypotheses.set(key, record as Hypothesis);
    } else if (aggregateType === 'experiment') {
      this.experiments.set(key, record as ExperimentDefinition);
    } else {
      this.strategies.set(key, record as StrategyVersion);
    }
  }

  async findByIdAndVersion(id: string, version: string): Promise<PatternDefinition | ContextDefinition | DatasetDefinition | Hypothesis | ExperimentDefinition | StrategyVersion | null> {
    return (
      this.patterns.get(this.key(id, version)) ??
      this.contexts.get(this.key(id, version)) ??
      this.datasets.get(this.key(id, version)) ??
      this.hypotheses.get(this.key(id, version)) ??
      this.experiments.get(this.key(id, version)) ??
      this.strategies.get(this.key(id, version)) ??
      null
    );
  }

  async isPublished(id: string, version: string): Promise<boolean> {
    const key = this.key(id, version);
    const pattern = this.patterns.get(key);
    if (pattern !== undefined) {
      return pattern.status !== 'Draft';
    }
    const strategy = this.strategies.get(key);
    if (strategy !== undefined) {
      return strategy.lifecycle !== 'Draft';
    }
    return false;
  }
}

class RecordingPublisher implements EventPublisher {
  events: EventEnvelope[] = [];

  async publish(event: EventEnvelope): Promise<void> {
    this.events.push(event);
  }
}

const makePattern = (id = '123e4567-e89b-12d3-a456-426614174010'): PatternDefinition => ({
  pattern_id: id,
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

const makeContext = (): ContextDefinition => ({
  context_id: '123e4567-e89b-12d3-a456-426614174011',
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

const makeDataset = (): DatasetDefinition => ({
  dataset_id: '123e4567-e89b-12d3-a456-426614174012',
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

const makeHypothesis = (): Hypothesis => ({
  hypothesis_id: '123e4567-e89b-12d3-a456-426614174013',
  statement: 'Bullish engulfing at support leads to higher highs',
  description: 'Continuation hypothesis',
  version: '1.0.0',
  subject: 'market',
  testability_criteria: ['at least 100 samples'],
  lifecycle: 'Draft',
  author: 'jules@delmacy',
  authored_at: '2023-10-25T10:00:00Z',
});

const makeExperiment = (): ExperimentDefinition => ({
  experiment_id: '123e4567-e89b-12d3-a456-426614174014',
  name: 'Engulfing Study',
  description: 'Evaluates continuation hypothesis',
  version: '1.0.0',
  hypothesis_reference: { id: makeHypothesis().hypothesis_id, version: '1.0.0' },
  dataset_references: [{ id: makeDataset().dataset_id, version: '1.0.0' }],
  prior_criteria: ['at least 100 samples'],
  parameters: {},
  lifecycle: 'Draft',
  author: 'jules@delmacy',
  authored_at: '2023-10-25T10:00:00Z',
});

const makeStrategy = (): StrategyVersion => ({
  strategy_id: '123e4567-e89b-12d3-a456-426614174015',
  version: '1.0.0',
  name: 'Engulfing Continuation',
  description: 'Entries on bullish engulfing at support',
  hypothesis_reference: { id: makeHypothesis().hypothesis_id, version: '1.0.0' },
  experiment_reference: { id: makeExperiment().experiment_id, version: '1.0.0' },
  pattern_references: [{ id: makePattern().pattern_id, version: '1.0.0' }],
  context_references: [{ id: makeContext().context_id, version: '1.0.0' }],
  dataset_eligibility: [{ id: makeDataset().dataset_id, version: '1.0.0' }],
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

const setupSeededRegistry = (): { registry: InMemoryRegistry; publisher: RecordingPublisher } => {
  const registry = new InMemoryRegistry();
  const publisher = new RecordingPublisher();
  return { registry, publisher };
};

describe('Registry use cases', () => {
  it('registers a pattern and emits a canonical event', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const pattern = makePattern();
    const result = await registerPattern(registry, publisher, ctx, pattern);
    assert.deepStrictEqual(result.record, pattern);
    assert.strictEqual(publisher.events.length, 1);
    assert.strictEqual(publisher.events[0].event_type, 'PatternRegistered');
    assert.strictEqual(publisher.events[0].aggregate_id, pattern.pattern_id);
    assert.strictEqual(publisher.events[0].workspace_id, ctx.workspace_id);
    assert.strictEqual(publisher.events[0].actor, ctx.actor);
  });

  it('rejects duplicate registration of the same version', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const pattern = makePattern();
    await registerPattern(registry, publisher, ctx, pattern);
    await assert.rejects(
      () => registerPattern(registry, publisher, ctx, pattern),
      RegistryVersionExistsError,
    );
  });

  it('queries a registered pattern by id and version', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const pattern = makePattern();
    await registerPattern(registry, publisher, ctx, pattern);
    const result = await queryPattern(registry, pattern.pattern_id, pattern.version);
    assert.deepStrictEqual(result.record, pattern);
  });

  it('throws structured error when querying a missing pattern', async () => {
    const { registry } = setupSeededRegistry();
    await assert.rejects(
      () => queryPattern(registry, '123e4567-e89b-12d3-a456-426614174099', '1.0.0'),
      RegistryNotFoundError,
    );
  });

  it('registers and queries a context', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const context = makeContext();
    await registerContext(registry, publisher, ctx, context);
    const result = await queryContext(registry, context.context_id, context.version);
    assert.deepStrictEqual(result.record, context);
    assert.strictEqual(publisher.events[0].event_type, 'ContextRegistered');
  });

  it('registers and queries a dataset', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const dataset = makeDataset();
    await registerDataset(registry, publisher, ctx, dataset);
    const result = await queryDataset(registry, dataset.dataset_id, dataset.version);
    assert.deepStrictEqual(result.record, dataset);
    assert.strictEqual(publisher.events[0].event_type, 'DatasetRegistered');
  });

  it('registers and queries a hypothesis', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const hypothesis = makeHypothesis();
    await registerHypothesis(registry, publisher, ctx, hypothesis);
    const result = await queryHypothesis(registry, hypothesis.hypothesis_id, hypothesis.version);
    assert.deepStrictEqual(result.record, hypothesis);
    assert.strictEqual(publisher.events[0].event_type, 'HypothesisRegistered');
  });

  it('registers and queries an experiment', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const experiment = makeExperiment();
    await registerExperiment(registry, publisher, ctx, experiment);
    const result = await queryExperiment(registry, experiment.experiment_id, experiment.version);
    assert.deepStrictEqual(result.record, experiment);
    assert.strictEqual(publisher.events[0].event_type, 'ExperimentCreated');
  });

  it('registers a strategy when all references exist', async () => {
    const { registry, publisher } = setupSeededRegistry();
    await registerPattern(registry, publisher, ctx, makePattern());
    await registerContext(registry, publisher, ctx, makeContext());
    await registerDataset(registry, publisher, ctx, makeDataset());
    await registerHypothesis(registry, publisher, ctx, makeHypothesis());
    await registerExperiment(registry, publisher, ctx, makeExperiment());
    const strategy = makeStrategy();
    const result = await registerStrategy(registry, registry, publisher, ctx, strategy);
    assert.deepStrictEqual(result.record, strategy);
    const lastEvent = publisher.events[publisher.events.length - 1];
    assert.strictEqual(lastEvent.event_type, 'StrategyCreated');
  });

  it('rejects a strategy with a missing hypothesis reference', async () => {
    const { registry, publisher } = setupSeededRegistry();
    await registerPattern(registry, publisher, ctx, makePattern());
    await registerContext(registry, publisher, ctx, makeContext());
    await registerDataset(registry, publisher, ctx, makeDataset());
    await registerExperiment(registry, publisher, ctx, makeExperiment());
    const strategy = makeStrategy();
    await assert.rejects(
      () => registerStrategy(registry, registry, publisher, ctx, strategy),
      RegistryReferenceNotFoundError,
    );
  });

  it('queries a registered strategy', async () => {
    const { registry, publisher } = setupSeededRegistry();
    await registerPattern(registry, publisher, ctx, makePattern());
    await registerContext(registry, publisher, ctx, makeContext());
    await registerDataset(registry, publisher, ctx, makeDataset());
    await registerHypothesis(registry, publisher, ctx, makeHypothesis());
    await registerExperiment(registry, publisher, ctx, makeExperiment());
    const strategy = makeStrategy();
    await registerStrategy(registry, registry, publisher, ctx, strategy);
    const result = await queryStrategy(registry, strategy.strategy_id, strategy.version);
    assert.deepStrictEqual(result.record, strategy);
  });

  it('prevents overwrite of a published pattern version', async () => {
    const { registry, publisher } = setupSeededRegistry();
    const pattern = makePattern();
    await registerPattern(registry, publisher, ctx, pattern);
    await publishPatternVersion(registry, publisher, ctx, pattern.pattern_id, pattern.version);
    await assert.rejects(
      () => publishPatternVersion(registry, publisher, ctx, pattern.pattern_id, pattern.version),
      RegistryVersionPublishedError,
    );
  });

  it('publishes a strategy version and emits StrategyVersionPublished', async () => {
    const { registry, publisher } = setupSeededRegistry();
    await registerPattern(registry, publisher, ctx, makePattern());
    await registerContext(registry, publisher, ctx, makeContext());
    await registerDataset(registry, publisher, ctx, makeDataset());
    await registerHypothesis(registry, publisher, ctx, makeHypothesis());
    await registerExperiment(registry, publisher, ctx, makeExperiment());
    const strategy = makeStrategy();
    await registerStrategy(registry, registry, publisher, ctx, strategy);
    const result = await publishStrategyVersion(registry, publisher, ctx, strategy.strategy_id, strategy.version);
    assert.strictEqual(result.record.lifecycle, 'Experimental');
    const lastEvent = publisher.events[publisher.events.length - 1];
    assert.strictEqual(lastEvent.event_type, 'StrategyVersionPublished');
  });
});

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import type { CommandContext } from '../../src/application/registry.js';
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
} from '../../src/application/registry.js';
import {
  RegistryNotFoundError,
  RegistryReferenceNotFoundError,
  RegistryVersionExistsError,
  RegistryVersionPublishedError,
} from '../../src/application/errors.js';
import { InMemoryRegistry, RecordingPublisher } from '../adapters/in-memory-registry.js';
import { makePattern, makeContext, makeDataset, makeHypothesis, makeExperiment, makeStrategy } from '../fixtures/registry-fixtures.js';

const ctx: CommandContext = {
  workspace_id: '123e4567-e89b-12d3-a456-426614174000',
  environment: 'research',
  actor: 'jules@delmacy',
  producer: 'registry-test',
  correlation_id: '123e4567-e89b-12d3-a456-426614174001',
};

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

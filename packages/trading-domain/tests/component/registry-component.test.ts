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
  producer: 'registry-component',
  correlation_id: '123e4567-e89b-12d3-a456-426614174001',
};

/*
 * ATENÇÃO — Gate de persistência ainda aberto
 * =============================================
 * Este teste usa InMemoryRegistry, um adapter volátil em processo.
 * Dados NÃO sobrevivem a reinícios de processo.
 * O gate de persistência oficial (ST-S02-009) continua aberto e
 * exige adapter real conectado ao System Builder.
 * Nenhum código de produção deve depender desta implementação.
 */
describe('Registry component (ST-S02-008)', () => {
  describe('Scenario: Register and query each aggregate type', () => {
    it('registers a pattern and queries it back', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      const pattern = makePattern();
      await registerPattern(registry, publisher, ctx, pattern);
      const result = await queryPattern(registry, pattern.pattern_id, pattern.version);
      assert.deepStrictEqual(result.record, pattern);
    });

    it('registers a context and queries it back', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      const context = makeContext();
      await registerContext(registry, publisher, ctx, context);
      const result = await queryContext(registry, context.context_id, context.version);
      assert.deepStrictEqual(result.record, context);
    });

    it('registers a dataset and queries it back', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      const dataset = makeDataset();
      await registerDataset(registry, publisher, ctx, dataset);
      const result = await queryDataset(registry, dataset.dataset_id, dataset.version);
      assert.deepStrictEqual(result.record, dataset);
    });

    it('registers a hypothesis and queries it back', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      const hypothesis = makeHypothesis();
      await registerHypothesis(registry, publisher, ctx, hypothesis);
      const result = await queryHypothesis(registry, hypothesis.hypothesis_id, hypothesis.version);
      assert.deepStrictEqual(result.record, hypothesis);
    });

    it('registers an experiment and queries it back', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      const experiment = makeExperiment();
      await registerExperiment(registry, publisher, ctx, experiment);
      const result = await queryExperiment(registry, experiment.experiment_id, experiment.version);
      assert.deepStrictEqual(result.record, experiment);
    });

    it('registers a strategy with all references and queries it back', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
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
  });

  describe('Scenario: Duplicate registration rejection', () => {
    it('rejects duplicate pattern version', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      await registerPattern(registry, publisher, ctx, makePattern());
      await assert.rejects(
        () => registerPattern(registry, publisher, ctx, makePattern()),
        RegistryVersionExistsError,
      );
    });

    it('rejects duplicate context version', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      await registerContext(registry, publisher, ctx, makeContext());
      await assert.rejects(
        () => registerContext(registry, publisher, ctx, makeContext()),
        RegistryVersionExistsError,
      );
    });

    it('rejects duplicate experiment version', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      await registerExperiment(registry, publisher, ctx, makeExperiment());
      await assert.rejects(
        () => registerExperiment(registry, publisher, ctx, makeExperiment()),
        RegistryVersionExistsError,
      );
    });
  });

  describe('Scenario: Published version immutability', () => {
    it('rejects re-publishing a pattern version', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      const pattern = makePattern();
      await registerPattern(registry, publisher, ctx, pattern);
      await publishPatternVersion(registry, publisher, ctx, pattern.pattern_id, pattern.version);
      await assert.rejects(
        () => publishPatternVersion(registry, publisher, ctx, pattern.pattern_id, pattern.version),
        RegistryVersionPublishedError,
      );
    });

    it('rejects re-publishing a strategy version', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      await registerPattern(registry, publisher, ctx, makePattern());
      await registerContext(registry, publisher, ctx, makeContext());
      await registerDataset(registry, publisher, ctx, makeDataset());
      await registerHypothesis(registry, publisher, ctx, makeHypothesis());
      await registerExperiment(registry, publisher, ctx, makeExperiment());
      const strategy = makeStrategy();
      await registerStrategy(registry, registry, publisher, ctx, strategy);
      await publishStrategyVersion(registry, publisher, ctx, strategy.strategy_id, strategy.version);
      await assert.rejects(
        () => publishStrategyVersion(registry, publisher, ctx, strategy.strategy_id, strategy.version),
        RegistryVersionPublishedError,
      );
    });
  });

  describe('Scenario: Missing reference rejection', () => {
    it('rejects strategy with missing hypothesis', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      await registerPattern(registry, publisher, ctx, makePattern());
      await registerContext(registry, publisher, ctx, makeContext());
      await registerDataset(registry, publisher, ctx, makeDataset());
      await registerExperiment(registry, publisher, ctx, makeExperiment());
      await assert.rejects(
        () => registerStrategy(registry, registry, publisher, ctx, makeStrategy()),
        RegistryReferenceNotFoundError,
      );
    });

    it('rejects strategy with missing experiment', async () => {
      const registry = new InMemoryRegistry();
      const publisher = new RecordingPublisher();
      await registerPattern(registry, publisher, ctx, makePattern());
      await registerContext(registry, publisher, ctx, makeContext());
      await registerDataset(registry, publisher, ctx, makeDataset());
      await registerHypothesis(registry, publisher, ctx, makeHypothesis());
      const strategy = makeStrategy();
      await assert.rejects(
        () => registerStrategy(registry, registry, publisher, ctx, strategy),
        RegistryReferenceNotFoundError,
      );
    });
  });

  describe('Scenario: Query missing entity', () => {
    it('throws RegistryNotFoundError for unknown pattern', async () => {
      const registry = new InMemoryRegistry();
      await assert.rejects(
        () => queryPattern(registry, '00000000-0000-0000-0000-000000000000', '1.0.0'),
        RegistryNotFoundError,
      );
    });

    it('throws RegistryNotFoundError for unknown strategy', async () => {
      const registry = new InMemoryRegistry();
      await assert.rejects(
        () => queryStrategy(registry, '00000000-0000-0000-0000-000000000000', '1.0.0'),
        RegistryNotFoundError,
      );
    });
  });
});

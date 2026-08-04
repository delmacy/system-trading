import type { PatternDefinition } from '../pattern-definition.js';
import type { ContextDefinition } from '../context-definition.js';
import type { DatasetDefinition } from '../dataset-definition.js';
import type { Hypothesis } from '../hypothesis.js';
import type { ExperimentDefinition } from '../experiment-definition.js';
import type { StrategyVersion } from '../strategy.js';
import type { VersionedReference } from '../versioned-reference.js';
import type {
  ContextStore,
  DatasetStore,
  ExperimentStore,
  HypothesisStore,
  PatternStore,
  StrategyStore,
  RegistryReferenceLookup,
  EventPublisher,
} from './ports.js';
import {
  RegistryNotFoundError,
  RegistryReferenceNotFoundError,
  RegistryVersionExistsError,
  RegistryVersionPublishedError,
} from './errors.js';
import { buildCanonicalEvent, publishEvent } from './events.js';
import type { EventEnvelope } from 'trading-protocols';

export interface CommandContext {
  workspace_id: string;
  environment: string;
  actor: string;
  producer: string;
  correlation_id: string;
  causation_id?: string | null;
}

export interface RegisterResult<T> {
  record: T;
  event: EventEnvelope;
}

export interface QueryResult<T> {
  record: T;
}

const assertNotRegistered = async (
  store: PatternStore | ContextStore | DatasetStore | HypothesisStore | ExperimentStore | StrategyStore,
  aggregate_type: string,
  id: string,
  version: string,
): Promise<void> => {
  const existing = await store.findByIdAndVersion(id, version);
  if (existing !== null) {
    throw new RegistryVersionExistsError(aggregate_type, id, version);
  }
};

const assertNotPublished = async (
  store: PatternStore | ContextStore | DatasetStore | HypothesisStore | ExperimentStore | StrategyStore,
  aggregate_type: string,
  id: string,
  version: string,
): Promise<void> => {
  const published = await store.isPublished(id, version);
  if (published) {
    throw new RegistryVersionPublishedError(aggregate_type, id, version);
  }
};

const buildContext = (ctx: CommandContext, aggregate_type: string, aggregate_id: string) => ({
  event_type: '',
  workspace_id: ctx.workspace_id,
  environment: ctx.environment,
  aggregate_type,
  aggregate_id,
  aggregate_version: 1,
  correlation_id: ctx.correlation_id,
  causation_id: ctx.causation_id ?? null,
  producer: ctx.producer,
  actor: ctx.actor,
  payload: {},
});

export const registerPattern = async (
  store: PatternStore,
  publisher: EventPublisher,
  ctx: CommandContext,
  pattern: PatternDefinition,
): Promise<RegisterResult<PatternDefinition>> => {
  await assertNotRegistered(store, 'pattern', pattern.pattern_id, pattern.version);
  await store.save(pattern);
  const event = await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'pattern', pattern.pattern_id),
      event_type: 'PatternRegistered',
      payload: { pattern_id: pattern.pattern_id, version: pattern.version, status: pattern.status },
    }),
  );
  return { record: pattern, event };
};

export const queryPattern = async (
  store: PatternStore,
  id: string,
  version: string,
): Promise<QueryResult<PatternDefinition>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('pattern', id, version);
  }
  return { record };
};

export const publishPatternVersion = async (
  store: PatternStore,
  publisher: EventPublisher,
  ctx: CommandContext,
  id: string,
  version: string,
): Promise<QueryResult<PatternDefinition>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('pattern', id, version);
  }
  await assertNotPublished(store, 'pattern', id, version);
  await store.save({ ...record, status: 'Experimental' });
  await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'pattern', id),
      event_type: 'PatternVersionPublished',
      payload: { pattern_id: id, version },
    }),
  );
  return { record: { ...record, status: 'Experimental' } };
};

export const registerContext = async (
  store: ContextStore,
  publisher: EventPublisher,
  ctx: CommandContext,
  context: ContextDefinition,
): Promise<RegisterResult<ContextDefinition>> => {
  await assertNotRegistered(store, 'context', context.context_id, context.version);
  await store.save(context);
  const event = await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'context', context.context_id),
      event_type: 'ContextRegistered',
      payload: { context_id: context.context_id, version: context.version, lifecycle: context.lifecycle },
    }),
  );
  return { record: context, event };
};

export const queryContext = async (
  store: ContextStore,
  id: string,
  version: string,
): Promise<QueryResult<ContextDefinition>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('context', id, version);
  }
  return { record };
};

export const registerDataset = async (
  store: DatasetStore,
  publisher: EventPublisher,
  ctx: CommandContext,
  dataset: DatasetDefinition,
): Promise<RegisterResult<DatasetDefinition>> => {
  await assertNotRegistered(store, 'dataset', dataset.dataset_id, dataset.version);
  await store.save(dataset);
  const event = await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'dataset', dataset.dataset_id),
      event_type: 'DatasetRegistered',
      payload: { dataset_id: dataset.dataset_id, version: dataset.version, lifecycle: dataset.lifecycle },
    }),
  );
  return { record: dataset, event };
};

export const queryDataset = async (
  store: DatasetStore,
  id: string,
  version: string,
): Promise<QueryResult<DatasetDefinition>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('dataset', id, version);
  }
  return { record };
};

export const registerHypothesis = async (
  store: HypothesisStore,
  publisher: EventPublisher,
  ctx: CommandContext,
  hypothesis: Hypothesis,
): Promise<RegisterResult<Hypothesis>> => {
  await assertNotRegistered(store, 'hypothesis', hypothesis.hypothesis_id, hypothesis.version);
  await store.save(hypothesis);
  const event = await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'hypothesis', hypothesis.hypothesis_id),
      event_type: 'HypothesisRegistered',
      payload: {
        hypothesis_id: hypothesis.hypothesis_id,
        version: hypothesis.version,
        lifecycle: hypothesis.lifecycle,
      },
    }),
  );
  return { record: hypothesis, event };
};

export const queryHypothesis = async (
  store: HypothesisStore,
  id: string,
  version: string,
): Promise<QueryResult<Hypothesis>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('hypothesis', id, version);
  }
  return { record };
};

export const registerExperiment = async (
  store: ExperimentStore,
  publisher: EventPublisher,
  ctx: CommandContext,
  experiment: ExperimentDefinition,
): Promise<RegisterResult<ExperimentDefinition>> => {
  await assertNotRegistered(store, 'experiment', experiment.experiment_id, experiment.version);
  await store.save(experiment);
  const event = await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'experiment', experiment.experiment_id),
      event_type: 'ExperimentCreated',
      payload: {
        experiment_id: experiment.experiment_id,
        version: experiment.version,
        lifecycle: experiment.lifecycle,
      },
    }),
  );
  return { record: experiment, event };
};

export const queryExperiment = async (
  store: ExperimentStore,
  id: string,
  version: string,
): Promise<QueryResult<ExperimentDefinition>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('experiment', id, version);
  }
  return { record };
};

const assertReferenceExists = async (
  lookup: RegistryReferenceLookup,
  aggregate_type: string,
  reference: VersionedReference,
): Promise<void> => {
  let exists = false;
  switch (aggregate_type) {
    case 'pattern':
      exists = await lookup.patternExists(reference.id, reference.version);
      break;
    case 'context':
      exists = await lookup.contextExists(reference.id, reference.version);
      break;
    case 'dataset':
      exists = await lookup.datasetExists(reference.id, reference.version);
      break;
    case 'hypothesis':
      exists = await lookup.hypothesisExists(reference.id, reference.version);
      break;
    case 'experiment':
      exists = await lookup.experimentExists(reference.id, reference.version);
      break;
    default:
      throw new RegistryReferenceNotFoundError(aggregate_type, reference);
  }
  if (!exists) {
    throw new RegistryReferenceNotFoundError(aggregate_type, reference);
  }
};

export const registerStrategy = async (
  store: StrategyStore,
  lookup: RegistryReferenceLookup,
  publisher: EventPublisher,
  ctx: CommandContext,
  strategy: StrategyVersion,
): Promise<RegisterResult<StrategyVersion>> => {
  await assertNotRegistered(store, 'strategy', strategy.strategy_id, strategy.version);
  await assertReferenceExists(lookup, 'hypothesis', strategy.hypothesis_reference);
  await assertReferenceExists(lookup, 'experiment', strategy.experiment_reference);
  for (const ref of strategy.pattern_references) {
    await assertReferenceExists(lookup, 'pattern', ref);
  }
  for (const ref of strategy.context_references) {
    await assertReferenceExists(lookup, 'context', ref);
  }
  for (const ref of strategy.dataset_eligibility) {
    await assertReferenceExists(lookup, 'dataset', ref);
  }
  await store.save(strategy);
  const event = await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'strategy', strategy.strategy_id),
      event_type: 'StrategyCreated',
      payload: { strategy_id: strategy.strategy_id, version: strategy.version, lifecycle: strategy.lifecycle },
    }),
  );
  return { record: strategy, event };
};

export const queryStrategy = async (
  store: StrategyStore,
  id: string,
  version: string,
): Promise<QueryResult<StrategyVersion>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('strategy', id, version);
  }
  return { record };
};

export const publishStrategyVersion = async (
  store: StrategyStore,
  publisher: EventPublisher,
  ctx: CommandContext,
  id: string,
  version: string,
): Promise<QueryResult<StrategyVersion>> => {
  const record = await store.findByIdAndVersion(id, version);
  if (record === null) {
    throw new RegistryNotFoundError('strategy', id, version);
  }
  await assertNotPublished(store, 'strategy', id, version);
  await store.save({ ...record, lifecycle: 'Experimental' });
  await publishEvent(
    publisher,
    buildCanonicalEvent({
      ...buildContext(ctx, 'strategy', id),
      event_type: 'StrategyVersionPublished',
      payload: { strategy_id: id, version },
    }),
  );
  return { record: { ...record, lifecycle: 'Experimental' } };
};

import type { PatternDefinition } from '../pattern-definition.js';
import type { ContextDefinition } from '../context-definition.js';
import type { DatasetDefinition } from '../dataset-definition.js';
import type { Hypothesis } from '../hypothesis.js';
import type { ExperimentDefinition } from '../experiment-definition.js';
import type { StrategyVersion } from '../strategy.js';
import type { EventEnvelope } from 'trading-protocols';

export interface PatternStore {
  save(pattern: PatternDefinition): Promise<void>;
  findByIdAndVersion(id: string, version: string): Promise<PatternDefinition | null>;
  isPublished(id: string, version: string): Promise<boolean>;
}

export interface ContextStore {
  save(context: ContextDefinition): Promise<void>;
  findByIdAndVersion(id: string, version: string): Promise<ContextDefinition | null>;
  isPublished(id: string, version: string): Promise<boolean>;
}

export interface DatasetStore {
  save(dataset: DatasetDefinition): Promise<void>;
  findByIdAndVersion(id: string, version: string): Promise<DatasetDefinition | null>;
  isPublished(id: string, version: string): Promise<boolean>;
}

export interface HypothesisStore {
  save(hypothesis: Hypothesis): Promise<void>;
  findByIdAndVersion(id: string, version: string): Promise<Hypothesis | null>;
  isPublished(id: string, version: string): Promise<boolean>;
}

export interface ExperimentStore {
  save(experiment: ExperimentDefinition): Promise<void>;
  findByIdAndVersion(id: string, version: string): Promise<ExperimentDefinition | null>;
  isPublished(id: string, version: string): Promise<boolean>;
}

export interface StrategyStore {
  save(strategy: StrategyVersion): Promise<void>;
  findByIdAndVersion(id: string, version: string): Promise<StrategyVersion | null>;
  isPublished(id: string, version: string): Promise<boolean>;
}

export interface RegistryReferenceLookup {
  patternExists(id: string, version: string): Promise<boolean>;
  contextExists(id: string, version: string): Promise<boolean>;
  datasetExists(id: string, version: string): Promise<boolean>;
  hypothesisExists(id: string, version: string): Promise<boolean>;
  experimentExists(id: string, version: string): Promise<boolean>;
}

export interface EventPublisher {
  publish(event: EventEnvelope): Promise<void>;
}

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
import type { EventEnvelope } from 'trading-protocols';

export class InMemoryRegistry implements PatternStore, ContextStore, DatasetStore, HypothesisStore, ExperimentStore, StrategyStore, RegistryReferenceLookup {
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
    const aggregateType: string =
      'pattern_id' in record
        ? 'pattern'
        : 'context_id' in record
          ? 'context'
          : 'dataset_id' in record
            ? 'dataset'
            : 'hypothesis_id' in record
              ? 'hypothesis'
              : 'experiment_id' in record
                ? 'experiment'
                : 'strategy';
    const id: string = String(
      'pattern_id' in record
        ? record.pattern_id
        : 'context_id' in record
          ? record.context_id
          : 'dataset_id' in record
            ? record.dataset_id
            : 'hypothesis_id' in record
              ? record.hypothesis_id
              : 'experiment_id' in record
                ? record.experiment_id
                : record.strategy_id,
    );
    const key = this.key(id, String(record.version));
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

  async findByIdAndVersion(id: string, version: string): Promise<PatternDefinition | ContextDefinition | DatasetDefinition | Hypothesis | ExperimentDefinition | StrategyVersion | null>;
  async findByIdAndVersion(id: string, version: string): Promise<PatternDefinition | null>;
  async findByIdAndVersion(id: string, version: string): Promise<ContextDefinition | null>;
  async findByIdAndVersion(id: string, version: string): Promise<DatasetDefinition | null>;
  async findByIdAndVersion(id: string, version: string): Promise<Hypothesis | null>;
  async findByIdAndVersion(id: string, version: string): Promise<ExperimentDefinition | null>;
  async findByIdAndVersion(id: string, version: string): Promise<StrategyVersion | null>;
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

  reset(): void {
    this.patterns.clear();
    this.contexts.clear();
    this.datasets.clear();
    this.hypotheses.clear();
    this.experiments.clear();
    this.strategies.clear();
  }
}

export class RecordingPublisher implements EventPublisher {
  events: EventEnvelope[] = [];

  async publish(event: EventEnvelope): Promise<void> {
    this.events.push(event);
  }

  reset(): void {
    this.events = [];
  }
}

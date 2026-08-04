import type { VersionedReference } from '../versioned-reference.js';

export class RegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegistryError';
  }
}

export class RegistryValidationError extends RegistryError {
  constructor(message: string) {
    super(message);
    this.name = 'RegistryValidationError';
  }
}

export class RegistryReferenceNotFoundError extends RegistryError {
  readonly aggregate_type: string;
  readonly reference: VersionedReference;

  constructor(aggregate_type: string, reference: VersionedReference) {
    super(
      `Referenced ${aggregate_type} version does not exist: ${reference.id}@${reference.version}`,
    );
    this.name = 'RegistryReferenceNotFoundError';
    this.aggregate_type = aggregate_type;
    this.reference = reference;
  }
}

export class RegistryVersionExistsError extends RegistryError {
  readonly aggregate_type: string;
  readonly aggregate_id: string;
  readonly version: string;

  constructor(aggregate_type: string, aggregate_id: string, version: string) {
    super(`${aggregate_type} version already registered: ${aggregate_id}@${version}`);
    this.name = 'RegistryVersionExistsError';
    this.aggregate_type = aggregate_type;
    this.aggregate_id = aggregate_id;
    this.version = version;
  }
}

export class RegistryVersionPublishedError extends RegistryError {
  readonly aggregate_type: string;
  readonly aggregate_id: string;
  readonly version: string;

  constructor(aggregate_type: string, aggregate_id: string, version: string) {
    super(`${aggregate_type} version is already published and immutable: ${aggregate_id}@${version}`);
    this.name = 'RegistryVersionPublishedError';
    this.aggregate_type = aggregate_type;
    this.aggregate_id = aggregate_id;
    this.version = version;
  }
}

export class RegistryNotFoundError extends RegistryError {
  readonly aggregate_type: string;
  readonly aggregate_id: string;
  readonly version: string;

  constructor(aggregate_type: string, aggregate_id: string, version: string) {
    super(`${aggregate_type} not found: ${aggregate_id}@${version}`);
    this.name = 'RegistryNotFoundError';
    this.aggregate_type = aggregate_type;
    this.aggregate_id = aggregate_id;
    this.version = version;
  }
}

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { getDomainCatalog } from '../src/catalog.js';
import { getWorkspaceDescriptor, validateWorkspaceDescriptor } from '../src/workspace.js';

describe('Published domain catalog', () => {
  it('should expose workspace, glossary and architecture decisions together', () => {
    const catalog = getDomainCatalog();
    assert.strictEqual(catalog.workspace.name, 'System Trading');
    assert.strictEqual(catalog.workspace.source_repository, 'delmacy/system-trading');
    assert.strictEqual(catalog.workspace.platform, 'system-builder');
    assert.strictEqual(catalog.workspace.capability_profile, 'trading-lab');
    assert.strictEqual(catalog.workspace.default_environment, 'research');
    assert.ok(catalog.glossary.length > 0);
    assert.ok(catalog.architecture_decisions.length > 0);
  });

  it('should validate the persisted workspace descriptor on read-back', () => {
    const descriptor = validateWorkspaceDescriptor(getWorkspaceDescriptor());
    assert.strictEqual(descriptor.platform, 'system-builder');
    assert.deepStrictEqual(descriptor.environments, [
      'research',
      'simulation',
      'shadow',
      'production',
      'archive',
    ]);
  });

  it('should reject a workspace descriptor with an unallowed capability profile', () => {
    assert.throws(
      () => validateWorkspaceDescriptor({ ...getWorkspaceDescriptor(), capability_profile: 'other-lab' }),
      /Invalid literal value/,
    );
  });

  it('should reject a workspace descriptor with an unknown environment', () => {
    assert.throws(
      () => validateWorkspaceDescriptor({ ...getWorkspaceDescriptor(), environments: ['research', 'uat'] }),
      /Invalid enum value/,
    );
  });

  it('should reject a workspace descriptor with an invalid repository', () => {
    assert.throws(
      () => validateWorkspaceDescriptor({ ...getWorkspaceDescriptor(), source_repository: 'other/repo' }),
      /Invalid literal value/,
    );
  });

  it('should accept an explicitly provisioned workspace_id', () => {
    const withId = validateWorkspaceDescriptor({
      ...getWorkspaceDescriptor(),
      workspace_id: '123e4567-e89b-12d3-a456-426614174000',
    });
    assert.strictEqual(withId.workspace_id, '123e4567-e89b-12d3-a456-426614174000');
  });
});

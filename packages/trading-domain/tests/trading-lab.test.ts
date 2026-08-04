import { describe, it, after } from 'node:test';
import * as assert from 'node:assert';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildTradingLabInstallation,
  deriveWorkspaceId,
  FileTradingLabInstallationStore,
  installTradingLab,
  loadTradingLab,
  TradingLabInstallError,
} from '../src/trading-lab.js';
import { getWorkspaceDescriptor } from '../src/workspace.js';

const REPOSITORY = 'delmacy/system-trading';
const INSTALLED_AT = '2026-08-04T00:00:00.000Z';

const tempDirs: string[] = [];

const makeStore = async (): Promise<FileTradingLabInstallationStore> => {
  const dir = await fs.mkdtemp(join(tmpdir(), 'trading-lab-'));
  tempDirs.push(dir);
  return new FileTradingLabInstallationStore(join(dir, 'workspace', 'trading-lab.json'));
};

const storageFilePath = (store: FileTradingLabInstallationStore): string =>
  (store as unknown as { filePath: string }).filePath;

after(async () => {
  await Promise.all(tempDirs.map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('Trading Lab install vertical slice', () => {
  it('derives a deterministic, valid workspace_id from the repository', () => {
    const first = deriveWorkspaceId(REPOSITORY);
    const second = deriveWorkspaceId(REPOSITORY);
    assert.strictEqual(first, second);
    assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('installs the Trading Lab and reads the persisted state back', async () => {
    const store = await makeStore();
    const installed = await installTradingLab(store, {
      repository: REPOSITORY,
      installed_by: 'ci-worker',
      installed_at: INSTALLED_AT,
    });

    const fileContent = await fs.readFile(storageFilePath(store), 'utf8');
    assert.match(fileContent, /"capability_profile": "trading-lab"/);
    assert.match(fileContent, /"source_repository": "delmacy\/system-trading"/);

    const loaded = await loadTradingLab(store);
    assert.notStrictEqual(loaded, null);
    assert.deepStrictEqual(loaded, installed);
  });

  it('persists the workspace metadata and repository linkage required by the sprint criterion', async () => {
    const store = await makeStore();
    const descriptor = getWorkspaceDescriptor();
    const installed = await installTradingLab(store, {
      repository: REPOSITORY,
      installed_by: 'ci-worker',
      installed_at: INSTALLED_AT,
    });

    assert.strictEqual(installed.name, descriptor.name);
    assert.strictEqual(installed.source_repository, descriptor.source_repository);
    assert.strictEqual(installed.platform, descriptor.platform);
    assert.strictEqual(installed.capability_profile, descriptor.capability_profile);
    assert.strictEqual(installed.default_environment, descriptor.default_environment);
    assert.deepStrictEqual(installed.environments, descriptor.environments);
    assert.deepStrictEqual(installed.installed_capabilities, ['trading-lab']);
    assert.strictEqual(installed.workspace_id, deriveWorkspaceId(REPOSITORY));
    assert.strictEqual(installed.installed_at, INSTALLED_AT);
  });

  it('rejects a second install of the Trading Lab', async () => {
    const store = await makeStore();
    await installTradingLab(store, { repository: REPOSITORY, installed_by: 'ci', installed_at: INSTALLED_AT });
    await assert.rejects(
      () => installTradingLab(store, { repository: REPOSITORY, installed_by: 'ci', installed_at: INSTALLED_AT }),
      /already installed/,
    );
  });

  it('returns null when no installation has been persisted yet', async () => {
    const store = await makeStore();
    assert.strictEqual(await loadTradingLab(store), null);
  });

  it('fails meaningfully when the persisted state was tampered with', async () => {
    const store = await makeStore();
    await installTradingLab(store, { repository: REPOSITORY, installed_by: 'ci', installed_at: INSTALLED_AT });

    const written = await fs.readFile(storageFilePath(store), 'utf8');
    const state = JSON.parse(written) as Record<string, unknown>;
    await fs.writeFile(
      storageFilePath(store),
      JSON.stringify({ ...state, workspace_id: 'not-a-uuid' }),
      'utf8',
    );

    await assert.rejects(() => loadTradingLab(store), /Invalid persisted trading lab installation/);
  });

  it('fails meaningfully when the persisted file contains invalid JSON', async () => {
    const store = await makeStore();
    await fs.mkdir(join(storageFilePath(store), '..'), { recursive: true });
    await fs.writeFile(storageFilePath(store), '{not valid json', 'utf8');
    await assert.rejects(() => loadTradingLab(store), /invalid JSON/);
  });

  it('rejects an unapproved source repository', async () => {
    const store = await makeStore();
    await assert.rejects(
      () => installTradingLab(store, { repository: 'other/org', installed_by: 'ci', installed_at: INSTALLED_AT }),
      /Invalid literal value/,
    );
  });

  it('rejects an empty actor on installation', async () => {
    await assert.throws(
      () => buildTradingLabInstallation({ repository: REPOSITORY, installed_by: '' }),
      /String must contain at least 1 character/,
    );
  });

  it('fails meaningfully when persistence cannot write', async () => {
    const dir = await fs.mkdtemp(join(tmpdir(), 'trading-lab-'));
    tempDirs.push(dir);
    const blockedDir = join(dir, 'blocked');
    await fs.mkdir(blockedDir);
    const store = new FileTradingLabInstallationStore(blockedDir);

    await assert.rejects(
      () => installTradingLab(store, { repository: REPOSITORY, installed_by: 'ci', installed_at: INSTALLED_AT }),
      (error: unknown) =>
        error instanceof TradingLabInstallError && /Failed to persist trading lab installation/.test(error.message),
    );
  });
});
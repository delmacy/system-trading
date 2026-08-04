import { createHash, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { dirname } from 'node:path';
import { z } from 'zod';
import { WorkspaceEnvironmentSchema } from './workspace.js';

export const TradingLabCapabilityProfileSchema = z.literal('trading-lab');

export type TradingLabCapabilityProfile = z.infer<
  typeof TradingLabCapabilityProfileSchema
>;

export const TradingLabInstallationSchema = z.object({
  schema_version: z.literal(1),
  workspace_id: z.string().uuid(),
  name: z.literal('System Trading'),
  source_repository: z.literal('delmacy/system-trading'),
  platform: z.literal('system-builder'),
  capability_profile: TradingLabCapabilityProfileSchema,
  installed_capabilities: z.array(TradingLabCapabilityProfileSchema).min(1),
  default_environment: WorkspaceEnvironmentSchema,
  environments: z.array(WorkspaceEnvironmentSchema).min(1),
  installed_by: z.string().min(1),
  installed_at: z.string().datetime(),
  correlation_id: z.string().uuid(),
  revision: z.number().int().nonnegative(),
});

export type TradingLabInstallation = z.infer<typeof TradingLabInstallationSchema>;

export class TradingLabInstallError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TradingLabInstallError';
  }
}

const DNS_NAMESPACE_UUID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const uuidToBytes = (uuid: string): Uint8Array => {
  const hex = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

export const deriveWorkspaceId = (repository: string): string => {
  const namespace = Buffer.from(uuidToBytes(DNS_NAMESPACE_UUID));
  const name = Buffer.from(repository, 'utf8');
  const digest = createHash('sha1')
    .update(Buffer.concat([namespace, name]))
    .digest();
  const bytes = digest.subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Buffer.from(bytes).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20,
  )}-${hex.slice(20, 32)}`;
};

export const buildTradingLabInstallation = (input: {
  repository: string;
  installed_by: string;
  installed_at?: string;
}): TradingLabInstallation => {
  return TradingLabInstallationSchema.parse({
    schema_version: 1,
    workspace_id: deriveWorkspaceId(input.repository),
    name: 'System Trading',
    source_repository: input.repository,
    platform: 'system-builder',
    capability_profile: 'trading-lab',
    installed_capabilities: ['trading-lab'],
    default_environment: 'research',
    environments: ['research', 'simulation', 'shadow', 'production', 'archive'],
    installed_by: input.installed_by,
    installed_at: input.installed_at ?? new Date().toISOString(),
    correlation_id: randomUUID(),
    revision: 0,
  });
};

export interface TradingLabInstallationStore {
  read(): Promise<unknown>;
  write(installation: TradingLabInstallation): Promise<void>;
}

export class FileTradingLabInstallationStore implements TradingLabInstallationStore {
  constructor(private readonly filePath: string) {}

  async read(): Promise<unknown> {
    let raw: string;
    try {
      raw = await fs.readFile(this.filePath, 'utf8');
    } catch (error) {
      if (
        error instanceof Error &&
        ((error as NodeJS.ErrnoException).code === 'ENOENT' ||
          (error as NodeJS.ErrnoException).code === 'EISDIR')
      ) {
        return null;
      }
      throw new TradingLabInstallError(
        `Failed to read trading lab installation: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      throw new TradingLabInstallError(
        'Failed to parse persisted trading lab installation: invalid JSON',
      );
    }
  }

  async write(installation: TradingLabInstallation): Promise<void> {
    await fs.mkdir(dirname(this.filePath), { recursive: true });
    try {
      await fs.writeFile(this.filePath, `${JSON.stringify(installation, null, 2)}\n`, 'utf8');
    } catch (error) {
      throw new TradingLabInstallError(
        `Failed to persist trading lab installation: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

export const installTradingLab = async (
  store: TradingLabInstallationStore,
  input: { repository: string; installed_by: string; installed_at?: string },
): Promise<TradingLabInstallation> => {
  const existing = await store.read();
  if (existing !== null) {
    throw new TradingLabInstallError(
      'Trading Lab is already installed in the System Trading workspace',
    );
  }
  const installation = buildTradingLabInstallation(input);
  await store.write(installation);
  return installation;
};

export const loadTradingLab = async (
  store: TradingLabInstallationStore,
): Promise<TradingLabInstallation | null> => {
  const stored = await store.read();
  if (stored === null) {
    return null;
  }
  const parsed = TradingLabInstallationSchema.safeParse(stored);
  if (!parsed.success) {
    throw new TradingLabInstallError(
      'Invalid persisted trading lab installation: failed validation',
    );
  }
  return parsed.data;
};

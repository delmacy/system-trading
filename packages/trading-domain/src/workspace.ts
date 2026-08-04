import { z } from 'zod';

export const WorkspaceEnvironmentSchema = z.enum([
  'research',
  'simulation',
  'shadow',
  'production',
  'archive',
]);

export type WorkspaceEnvironment = z.infer<typeof WorkspaceEnvironmentSchema>;

export const WorkspaceDescriptorSchema = z.object({
  name: z.literal('System Trading'),
  type: z.literal('internal-product'),
  status: z.literal('incubation'),
  source_repository: z.literal('delmacy/system-trading'),
  platform: z.literal('system-builder'),
  capability_profile: z.literal('trading-lab'),
  default_environment: WorkspaceEnvironmentSchema,
  environments: z.array(WorkspaceEnvironmentSchema).min(1),
  workspace_id: z.string().uuid().optional(),
});

export type WorkspaceDescriptor = z.infer<typeof WorkspaceDescriptorSchema>;

export const workspaceDescriptor: WorkspaceDescriptor = {
  name: 'System Trading',
  type: 'internal-product',
  status: 'incubation',
  source_repository: 'delmacy/system-trading',
  platform: 'system-builder',
  capability_profile: 'trading-lab',
  default_environment: 'research',
  environments: ['research', 'simulation', 'shadow', 'production', 'archive'],
};

export const validateWorkspaceDescriptor = (data: unknown): WorkspaceDescriptor => {
  return WorkspaceDescriptorSchema.parse(data);
};

export const getWorkspaceDescriptor = (): WorkspaceDescriptor => {
  return workspaceDescriptor;
};

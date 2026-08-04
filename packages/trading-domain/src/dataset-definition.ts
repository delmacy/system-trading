import { z } from 'zod';

export const DatasetLifecycleSchema = z.enum([
  'Draft',
  'Importing',
  'Validating',
  'Ready',
  'Restricted',
  'Deprecated',
  'Archived',
]);

export type DatasetLifecycle = z.infer<typeof DatasetLifecycleSchema>;

export const DatasetPeriodSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export type DatasetPeriod = z.infer<typeof DatasetPeriodSchema>;

export const DatasetLineageEntrySchema = z.object({
  source_dataset_id: z.string().uuid(),
  source_version: z.string().min(1),
  transformation: z.string().min(1),
  code_version: z.string().min(1),
  parameters: z.record(z.unknown()),
  timestamp: z.string().datetime(),
  output_artifact: z.string().min(1),
});

export type DatasetLineageEntry = z.infer<typeof DatasetLineageEntrySchema>;

export const DatasetDefinitionSchema = z.object({
  dataset_id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  source: z.string().min(1),
  license: z.string().min(1),
  instruments: z.array(z.string().min(1)).min(1),
  resolution: z.string().min(1),
  period: DatasetPeriodSchema,
  timezone: z.string().min(1),
  schema_reference: z.string().min(1),
  version: z.string().min(1),
  checksum: z.string().min(1),
  transformations: z.array(z.string().min(1)),
  adjustments: z.array(z.string().min(1)),
  known_gaps: z.array(z.string().min(1)),
  quality_report_reference: z.string().min(1).optional(),
  artifact_location: z.string().min(1),
  ingested_at: z.string().datetime(),
  owner: z.string().min(1),
  lifecycle: DatasetLifecycleSchema,
  lineage: z.array(DatasetLineageEntrySchema).optional(),
});

export type DatasetDefinition = z.infer<typeof DatasetDefinitionSchema>;

export const validateDatasetDefinition = (data: unknown): DatasetDefinition => {
  return DatasetDefinitionSchema.parse(data);
};

import { z } from 'zod';

export const VersionedReferenceSchema = z.object({
  id: z.string().uuid(),
  version: z.string().min(1),
});

export type VersionedReference = z.infer<typeof VersionedReferenceSchema>;

export const validateVersionedReference = (data: unknown): VersionedReference => {
  return VersionedReferenceSchema.parse(data);
};

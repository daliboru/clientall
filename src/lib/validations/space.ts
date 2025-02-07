import { z } from 'zod'

export const spaceSettingsSchema = z.object({
  name: z.string().min(1, 'Space name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
})

export type SpaceSettingsForm = z.infer<typeof spaceSettingsSchema>

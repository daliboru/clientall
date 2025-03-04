import { z } from 'zod'

export const spaceSettingsSchema = z.object({
  name: z.string().min(1, 'Space name is required').max(50, 'Name is too long'),
  description: z.string().max(200, 'Description is too long'),
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SpaceSettingsForm = z.infer<typeof spaceSettingsSchema>
export type UserLoginForm = z.infer<typeof userLoginSchema>

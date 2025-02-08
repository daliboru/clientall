import * as z from 'zod'

export const userSettingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmPassword: z.string().optional(),
  emailNotifications: z.boolean().default(true),
}).refine((data) => {
  if (data.currentPassword && !data.newPassword) {
    return false
  }
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false
  }
  return true
}, {
  message: "Passwords don't match or are incomplete",
  path: ['confirmPassword'],
})

export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>
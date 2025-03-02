import * as z from 'zod'

export const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  calendly_url: z.string().url('Please enter a valid URL').or(z.literal('')),
})

export const passwordSettingsSchema = z
  .object({
    current: z.string().min(1, 'Current password is required'),
    new: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string(),
  })
  .refine((data) => data.new === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  })

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>
export type PasswordSettingsFormValues = z.infer<typeof passwordSettingsSchema>

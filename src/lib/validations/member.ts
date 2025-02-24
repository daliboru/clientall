import { z } from 'zod'

export const memberInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
})

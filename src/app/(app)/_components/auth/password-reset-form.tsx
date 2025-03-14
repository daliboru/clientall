'use client'

import { Button } from '@/app/(app)/_components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/(app)/_components/ui/form'
import { Input } from '@/app/(app)/_components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from '../../../../lib/use-toast'
import { useAuth } from '../../_providers/Auth'

const passwordResetSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export function PasswordResetForm({ token }: { token: string }) {
  const [isPending, setIsPending] = useState(false)
  const { resetPassword } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (values: z.infer<typeof passwordResetSchema>) => {
    try {
      setIsPending(true)
      const user = await resetPassword(token, values.password)
      if (!user) {
        throw new Error('Failed to reset password')
      }
      toast({
        title: 'Password reset',
        description: 'Your password has been updated successfully',
        variant: 'success',
      })
      router.replace('/dashboard')
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: 'Password reset failed. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Updating...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  )
}

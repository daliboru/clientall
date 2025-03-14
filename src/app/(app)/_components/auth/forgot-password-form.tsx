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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from '../../../../lib/use-toast'
import { useAuth } from '../../_providers/Auth'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false)
  const { forgotPassword } = useAuth()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setIsPending(true)
      await forgotPassword(values.email)
      toast({
        title: 'Reset email sent',
        description: 'Check your email for a password reset link',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset email. Please try again.',
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </Form>
  )
}

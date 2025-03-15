'use client'

import { Button } from '@/app/(app)/_components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(app)/_components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/(app)/_components/ui/form'
import { Input } from '@/app/(app)/_components/ui/input'
import {
  passwordSettingsSchema,
  type PasswordSettingsFormValues,
} from '@/lib/validations/user-settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '../../../../lib/use-toast'
import { useAuth } from '../../_providers/Auth'

export function PasswordSettingsForm() {
  const { changePassword } = useAuth()
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<PasswordSettingsFormValues>({
    resolver: zodResolver(passwordSettingsSchema),
    defaultValues: {
      current: '',
      new: '',
      confirm: '',
    },
  })

  const onSubmit = async (values: PasswordSettingsFormValues) => {
    setIsPending(true)
    try {
      const formData = new FormData()
      formData.append('current', values.current)
      formData.append('new', values.new)
      formData.append('confirm', values.confirm)

      const result = await changePassword({
        current: values.current,
        new: values.new,
        confirm: values.confirm,
      })

      if (!result) {
        throw new Error('Failed to update password.')
      }

      form.reset()
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
        variant: 'success',
      })
    } catch (error: any) {
      if (error.message?.includes('email or password')) {
        form.setError('current', {
          type: 'manual',
          message: 'Current password is incorrect',
        })
      } else if (error.message?.includes('match')) {
        form.setError('confirm', {
          type: 'manual',
          message: 'Passwords do not match',
        })
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to update password.',
          variant: 'destructive',
        })
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

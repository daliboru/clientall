'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  passwordSettingsSchema,
  type PasswordSettingsFormValues,
} from '@/lib/validations/user-settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function PasswordSettingsForm() {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<PasswordSettingsFormValues>({
    resolver: zodResolver(passwordSettingsSchema),
    defaultValues: {
      current: '',
      new: '',
      confirm: '',
    },
  })

  //   const onSubmit = async (values: PasswordSettingsFormValues) => {
  //     try {
  //       setIsPending(true)
  //       const formData = new FormData()
  //       formData.append('current', values.current)
  //       formData.append('new', values.new)
  //       formData.append('confirm', values.confirm)

  //       const result = await updatePassword(formData)

  //       if (!result.success) {
  //         if (result.errors) {
  //           Object.entries(result.errors).forEach(([key, value]) => {
  //             form.setError(key as keyof PasswordSettingsFormValues, {
  //               message: value[0],
  //             })
  //           })
  //         }
  //         throw new Error(result.error || 'Failed to update password')
  //       }

  //       form.reset()
  //       toast({
  //         title: 'Password updated',
  //         description: 'Your password has been updated successfully.',
  //         variant: 'success',
  //       })
  //     } catch (error: any) {
  //       toast({
  //         title: 'Error',
  //         description: error.message || 'Failed to update password.',
  //         variant: 'destructive',
  //       })
  //     } finally {
  //       setIsPending(false)
  //     }
  //   }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
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
                    <Input type="password" {...field} disabled={isPending} />
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
                    <Input type="password" {...field} disabled={isPending} />
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

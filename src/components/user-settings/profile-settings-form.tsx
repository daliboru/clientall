'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { updateUser } from '@/lib/actions/users'
import { isMediaRel } from '@/lib/payload-utils'
import { toast } from '@/lib/use-toast'
import { getInitials } from '@/lib/utils'
import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from '@/lib/validations/user-settings'
import { User } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ProfileSettingsFormProps {
  user: User
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user.name,
    },
  })

  const onSubmit = async (values: ProfileSettingsFormValues) => {
    setIsPending(true)
    try {
      const formData = new FormData()
      if (values.name) {
        formData.append('name', values.name)
      }
      if (avatar) {
        formData.append('avatar', avatar)
      }

      const result = await updateUser(formData)

      if (!result.success) {
        if (result.error) {
          Object.entries(result.error).forEach(([key, value]) => {
            form.setError(key as keyof ProfileSettingsFormValues, {
              message: value as string,
            })
          })
        }
        throw new Error(result.error || 'Failed to update profile')
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile.',
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your account settings and profile information.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={avatarPreview || (isMediaRel(user.avatar) ? user.avatar.url : '')}
                  />
                  <AvatarFallback>{user.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isPending}
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      <Upload className="h-4 w-4" />
                      Upload new picture
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

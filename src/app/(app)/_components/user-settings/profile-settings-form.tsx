'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/(app)/_components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/app/(app)/_components/ui/avatar'
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
import { updateUser } from '@/lib/actions/users'
import { isMediaRel } from '@/lib/payload-utils'
import { useToast } from '@/lib/use-toast'
import { getInitials } from '@/lib/utils'
import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from '@/lib/validations/user-settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash2, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../_providers/Auth'

const MAX_FILE_SIZE = 1024 * 1024 // 1MB

export function ProfileSettingsForm() {
  const { user, setUser } = useAuth()
  const [isPending, setIsPending] = useState(false)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  // Update the form initialization
  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user?.name || '',
      calendly_url: user?.calendly_url || '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        calendly_url: user.calendly_url || '',
      })
    }
  }, [user, router, form])

  const onSubmit = async (values: ProfileSettingsFormValues) => {
    setIsPending(true)

    const formData = new FormData()
    if (values.name) {
      formData.append('name', values.name)
    }
    if (values.calendly_url !== undefined) {
      formData.append('calendly_url', values.calendly_url)
    }
    if (avatar) {
      formData.append('avatar', avatar)
    }

    const updatedUser = await updateUser(formData)

    if (updatedUser) {
      setUser(updatedUser)

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
        variant: 'success',
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      })
    }

    setIsPending(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 1MB.',
          variant: 'destructive',
        })
        // Reset the input
        e.target.value = ''
        return
      }

      setAvatar(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveAvatar = async () => {
    if (user) {
      setIsPending(true)
      const formData = new FormData()
      formData.append('name', user.name)
      formData.append('removeAvatar', 'true')

      const updatedUser = await updateUser(formData)
      if (updatedUser) {
        setUser(updatedUser)
        setAvatar(null)
        setAvatarPreview('')

        toast({
          title: 'Avatar removed',
          description: 'Your profile picture has been removed.',
          variant: 'success',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to remove avatar.',
          variant: 'destructive',
        })
      }
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-600">Profile Settings</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Manage your account settings and profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div>
                <FormLabel className="text-base">Profile Picture</FormLabel>
                <CardDescription>
                  This will be displayed on your profile and in spaces.
                </CardDescription>
              </div>

              <div className="flex items-start gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-2 ring-background">
                    <AvatarImage
                      src={
                        avatarPreview || (isMediaRel(user?.avatar) ? user.avatar.url : undefined)
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {(avatarPreview || isMediaRel(user?.avatar)) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove profile picture?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove your profile picture. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleRemoveAvatar}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col text-sm text-muted-foreground">
                    <span>Upload a new picture or remove the current one</span>
                    <span>JPG, GIF or PNG. 1MB max.</span>
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center gap-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md cursor-pointer transition-colors"
                  >
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isPending}
                      // Add max size to the accept attribute
                      size={MAX_FILE_SIZE}
                    />
                    <Upload className="h-4 w-4" />
                    Choose File
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user?.email || ''} disabled className="bg-muted" />
                </FormControl>
                <CardDescription>Email cannot be changed</CardDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calendly_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calendly URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        disabled={isPending}
                        placeholder="https://calendly.com/your-link"
                      />
                    </FormControl>
                    <CardDescription>
                      Add your Calendly URL to enable scheduling in your spaces
                    </CardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

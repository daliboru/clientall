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
import { Textarea } from '@/app/(app)/_components/ui/textarea'
import { updateSpace } from '@/lib/actions/spaces'
import { isMediaRel } from '@/lib/payload-utils'
import { useToast } from '@/lib/use-toast'
import { spaceSettingsSchema, type SpaceSettingsForm } from '@/lib/validations/space'
import { Space } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  space: Space
}

const MAX_FILE_SIZE = 1024 * 1024 // 1MB

export function SpaceSettingsForm({ space }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const { toast } = useToast()

  const form = useForm<SpaceSettingsForm>({
    resolver: zodResolver(spaceSettingsSchema),
    values: {
      name: space.name,
      description: space.description,
    },
  })

  const onSubmit = async (data: SpaceSettingsForm) => {
    setIsPending(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      if (logo) {
        formData.append('logo', logo)
      }

      const result = await updateSpace(space.id.toString(), formData)

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof SpaceSettingsForm, {
              message: value[0],
            })
          })
        }
        throw new Error(result.error || 'Failed to update portal')
      }

      setLogo(null)

      toast({
        title: 'Settings updated',
        description: 'Your portal settings have been updated successfully.',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update portal settings.',
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 1MB.',
          variant: 'destructive',
        })
        e.target.value = ''
        return
      }

      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveLogo = async () => {
    setIsPending(true)
    try {
      const formData = new FormData()
      formData.append('name', space.name)
      formData.append('description', space.description)
      formData.append('removeLogo', 'true')

      const result = await updateSpace(space.id.toString(), formData)
      if (result.success) {
        setLogo(null)
        setLogoPreview('')

        toast({
          title: 'Logo removed',
          description: 'Your portal logo has been removed.',
          variant: 'success',
        })
      } else {
        throw new Error(result.error || 'Failed to remove logo')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove logo.',
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  // Add character count state
  const [nameCharCount, setNameCharCount] = useState(space.name.length)
  const [descriptionCharCount, setDescriptionCharCount] = useState(space.description.length)

  // Watch form values to update character counts
  useEffect(() => {
    const subscription = form.watch((value) => {
      setNameCharCount(value.name?.length || 0)
      setDescriptionCharCount(value.description?.length || 0)
    })
    return () => subscription.unsubscribe()
  }, [form, form.watch])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="space-y-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-primary">Portal Settings</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Customize your portal appearance and information
              </CardDescription>
            </div>
            <div className="border-b" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div>
                <FormLabel className="text-base">Portal Logo</FormLabel>
                <CardDescription>
                  This will be displayed in the portal card and header.
                </CardDescription>
              </div>

              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-lg border flex items-center justify-center bg-muted ring-2 ring-background overflow-hidden">
                    {logoPreview || isMediaRel(space.logo) ? (
                      <Image
                        src={logoPreview || (isMediaRel(space.logo) ? space.logo.url : '')}
                        alt={space.name}
                        className="h-full w-full object-cover"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  {(logoPreview || isMediaRel(space.logo)) && (
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
                          <AlertDialogTitle>Remove portal logo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove your portal logo. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleRemoveLogo}
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
                    <span>Upload a new logo or remove the current one</span>
                    <span>JPG, GIF or PNG. 1MB max.</span>
                  </div>
                  <label
                    htmlFor="logo-upload"
                    className="inline-flex items-center gap-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md cursor-pointer transition-colors"
                  >
                    <Input
                      id="logo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                      disabled={isPending}
                      size={MAX_FILE_SIZE}
                    />
                    <Upload className="h-4 w-4" />
                    Choose File
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Portal Name</FormLabel>
                      <span className="text-sm text-muted-foreground">{nameCharCount}/50</span>
                    </div>
                    <FormControl>
                      <Input {...field} disabled={isPending} maxLength={50} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Description</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {descriptionCharCount}/200
                      </span>
                    </div>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} maxLength={200} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

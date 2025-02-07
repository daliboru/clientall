'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useSpace } from '@/hooks/useSpace'
import { useUpdateSpace } from '@/hooks/useUpdateSpace'
import { spaceSettingsSchema, type SpaceSettingsForm } from '@/lib/validations/space'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function SpaceSettingsPage() {
  const { toast } = useToast()
  const params = useParams<{ spaceId: string }>()
  const { data: space, isLoading } = useSpace(params.spaceId)
  const { mutate: updateSpace, isPending } = useUpdateSpace(params.spaceId)

  const form = useForm<SpaceSettingsForm>({
    resolver: zodResolver(spaceSettingsSchema),
    values: {
      name: space?.name ?? '',
      description: space?.description ?? '',
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    updateSpace(data, {
      onSuccess: () => {
        toast({
          title: 'Settings updated',
          description: 'Your space settings have been updated successfully.',
          variant: 'success',
        })
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to update space settings.',
          variant: 'destructive',
        })
      },
    })
  })

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  if (!space) return null
  console.log(space)

  return (
    <>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Space Settings</CardTitle>
            <CardDescription>Manage your space settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Space Name</Label>
              <Input id="name" placeholder="Enter space name" {...form.register('name')} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter space description"
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Space</Button>
        </CardContent>
      </Card>
    </>
  )
}

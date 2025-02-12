'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateSpace } from '@/lib/actions/spaces'
import { toast } from '@/lib/use-toast'
import { spaceSettingsSchema, type SpaceSettingsForm } from '@/lib/validations/space'
import { Space } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface Props {
  space: Space
}

export function SpaceSettingsForm({ space }: Props) {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<SpaceSettingsForm>({
    resolver: zodResolver(spaceSettingsSchema),
    values: {
      name: space.name,
      description: space.description,
    },
  })

  const onSubmit = async (data: SpaceSettingsForm) => {
    try {
      setIsPending(true)
      const result = await updateSpace(space.id.toString(), data)

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof SpaceSettingsForm, {
              message: value[0],
            })
          })
        }
        throw new Error(result.error || 'Failed to update space')
      }

      toast({
        title: 'Settings updated',
        description: 'Your space settings have been updated successfully.',
        variant: 'success',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update space settings.',
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
    </>
  )
}

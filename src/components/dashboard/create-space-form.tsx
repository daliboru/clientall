'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createSpace } from '@/lib/actions/spaces'
import { spaceSettingsSchema, type SpaceSettingsForm } from '@/lib/validations/space'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function CreateSpaceForm() {
  const [isPending, setIsPending] = useState(false)

  const form = useForm<SpaceSettingsForm>({
    resolver: zodResolver(spaceSettingsSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: SpaceSettingsForm) => {
    setIsPending(true)
    try {
      await createSpace(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create your first space</CardTitle>
        <CardDescription>Get started by creating a new space for your team</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Space Name</Label>
            <Input
              id="name"
              placeholder="Enter space name"
              {...form.register('name')}
              disabled={isPending}
            />
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
              disabled={isPending}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Space'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
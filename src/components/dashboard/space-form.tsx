'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createSpace } from '@/lib/actions/spaces'
import { toast } from '@/lib/use-toast'
import { spaceSettingsSchema, type SpaceSettingsForm } from '@/lib/validations/space'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface SpaceFormProps {
  onSuccess?: () => void
  submitLabel?: string
}

export function SpaceForm({ onSuccess, submitLabel = 'Create Space' }: SpaceFormProps) {
  const form = useForm<SpaceSettingsForm>({
    resolver: zodResolver(spaceSettingsSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const nameLength = form.watch('name')?.length || 0
  const descriptionLength = form.watch('description')?.length || 0
  const isPending = form.formState.isSubmitting

  const onSubmit = async (data: SpaceSettingsForm) => {
    try {
      const result = await createSpace(data)
      if (result.success) {
        form.reset()
        toast({
          title: 'Success',
          description: 'Space created successfully',
          variant: 'success',
        })
        onSuccess?.()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create space',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="name">Space Name*</Label>
          <span className="text-sm text-muted-foreground">{nameLength}/50</span>
        </div>
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
        <div className="flex justify-between items-center">
          <Label htmlFor="description">Description*</Label>
          <span className="text-sm text-muted-foreground">{descriptionLength}/200</span>
        </div>
        <Textarea
          id="description"
          placeholder="Enter space description"
          {...form.register('description')}
          disabled={isPending}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}

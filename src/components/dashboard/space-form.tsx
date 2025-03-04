'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Space Name*</FormLabel>
                <span className="text-sm text-muted-foreground">{nameLength}/50</span>
              </div>
              <FormControl>
                <Input placeholder="Enter space name" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Description*</FormLabel>
                <span className="text-sm text-muted-foreground">{descriptionLength}/200</span>
              </div>
              <FormControl>
                <Textarea placeholder="Enter space description" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </Form>
  )
}

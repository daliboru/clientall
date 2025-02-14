'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SpaceForm } from './space-form'

export function CreateSpaceForm() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Create your first space</CardTitle>
        <CardDescription>Get started by creating a new space for your team</CardDescription>
      </CardHeader>
      <CardContent>
        <SpaceForm submitLabel="Create Your First Space" />
      </CardContent>
    </Card>
  )
}

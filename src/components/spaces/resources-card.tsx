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
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getResourceSize } from '@/lib/payload-utils'
import { Resource } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Link as LinkIcon, MoreVertical, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface ResourcesCardProps {
  spaceId: string
  resources: Resource[]
}

export function ResourcesCard({ spaceId, resources }: ResourcesCardProps) {
  console.log(resources)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Files and links shared in this space</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button variant="outline" size="sm">
            <LinkIcon className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources yet</p>
          ) : (
            resources.map((resource) => (
              <div
                key={resource.id}
                className="group flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {resource.type === 'file' ? (
                    <FileText className="h-5 w-5 text-blue-500" />
                  ) : (
                    <LinkIcon className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{resource.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Added {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                      {resource.type === 'file' && ` • ${getResourceSize(resource)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {resource.type === 'link' && (
                    <Link href={resource.url!} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        Open Link
                      </Button>
                    </Link>
                  )}
                  {resource.type === 'file' && (
                    <Link href={`/spaces/${spaceId}/resources/${resource.id}/download`}>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </Link>
                  )}
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete resource?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this {resource.type}. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            // TODO: Implement delete functionality
                            console.log('Delete resource:', resource.id)
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

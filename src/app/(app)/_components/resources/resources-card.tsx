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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/(app)/_components/ui/dropdown-menu'
import { Pagination } from '@/app/(app)/_components/ui/pagination'
import { createFileResource, createLinkResource, deleteResource } from '@/lib/actions/resources'
import { getResourceSize, isFileResource, isMediaRel, isRel } from '@/lib/payload-utils'
import { useToast } from '@/lib/use-toast'
import { getInitials } from '@/lib/utils'
import { Resource } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Link as LinkIcon, MoreVertical, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { getResources } from '../../../../lib/functions/resources'
import { AddFileDialog } from './add-resource-file-dialog'
import { AddLinkDialog } from './add-resource-link-dialog'

interface ResourcesCardProps {
  resources: Resource[]
  spaceId: string
  totalPages: number
  currentPage: number
}

export function ResourcesCard({
  resources: initialResources,
  spaceId,
  totalPages,
  currentPage,
}: ResourcesCardProps) {
  const [resources, setResources] = useState(initialResources)
  const [page, setPage] = useState(currentPage)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAddLink = async (data: { name: string; url: string }) => {
    try {
      const result = await createLinkResource({
        ...data,
        spaceId: Number(spaceId),
      })
      if (result?.success && result.resources?.docs) {
        setResources(result.resources.docs)
        setPage(1)
      }
      toast({
        title: 'Link added successfully',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to add link',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleAddFile = async (data: { name: string; file: File }) => {
    try {
      const result = await createFileResource({
        ...data,
        spaceId: Number(spaceId),
      })
      if (result?.success && result.resources?.docs) {
        setResources(result.resources.docs)
        setPage(1)
      }
      toast({
        title: 'File uploaded successfully',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to upload file',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const fetchResources = async (pageNumber: number) => {
    setLoading(true)
    try {
      const response = await getResources(spaceId, pageNumber)
      if (response?.docs) {
        setResources(response.docs)
        setPage(pageNumber)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resource: Resource) => {
    try {
      const result = await deleteResource(resource.id, spaceId, page)
      if (result.success && result.resources?.docs) {
        setResources(result.resources.docs)
        if (result.resources.docs.length === 0 && page > 1) {
          fetchResources(page - 1)
        }
      }
      toast({
        title: 'Resource deleted successfully',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to delete resource',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">Resources</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            A centralized hub for all your project materials, files, and important links. Keep
            everything organized and easily accessible to your team.
          </CardDescription>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <AddFileDialog onSubmit={handleAddFile} />
          <AddLinkDialog onSubmit={handleAddLink} />
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
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50"
              >
                <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                  {resource.type === 'file' ? (
                    <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                  ) : (
                    <LinkIcon className="h-5 w-5 text-green-500 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate max-w-sm">{resource.name}</p>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center">
                        <span className="whitespace-nowrap">
                          Added{' '}
                          {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                        </span>
                      </span>
                      {isRel(resource.createdBy) && (
                        <div className="inline-flex items-center gap-1">
                          <span>•</span>
                          <div className="inline-flex items-center gap-1">
                            <Avatar className="h-4 w-4 shrink-0">
                              <AvatarImage
                                src={
                                  isMediaRel(resource.createdBy.avatar)
                                    ? resource.createdBy.avatar.url
                                    : undefined
                                }
                                alt={resource.createdBy.name}
                              />
                              <AvatarFallback className="text-[8px]">
                                {getInitials(resource.createdBy.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="whitespace-nowrap">
                              {resource.createdBy.name.length > 12
                                ? `${resource.createdBy.name.substring(0, 12)}...`
                                : resource.createdBy.name}
                            </span>
                          </div>
                        </div>
                      )}
                      {resource.type === 'file' && (
                        <span className="inline-flex items-center whitespace-nowrap">
                          <span>•</span>
                          <span className="ml-1">{getResourceSize(resource)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {resource.type === 'link' && (
                    <Link
                      href={resource.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none"
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        Open Link
                      </Button>
                    </Link>
                  )}
                  {resource.type === 'file' && (
                    <Link
                      href={isFileResource(resource) ? resource.attachment.url! : ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none"
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        View
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
                          onClick={() => handleDelete(resource)}
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
          {resources.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              loading={loading}
              onPageChange={fetchResources}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

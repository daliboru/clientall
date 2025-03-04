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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/ui/pagination'
import {
  createFileDeliverable,
  createLinkDeliverable,
  deleteDeliverable,
  getDeliverables,
  trackDeliverableView,
  updateDeliverableStatus,
} from '@/lib/actions/deliverables'
import { getResourceSize, isFileResource, isMediaRel, isRel } from '@/lib/payload-utils'
import { toast } from '@/lib/use-toast'
import { getInitials } from '@/lib/utils'
import { Deliverable } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import {
  CheckCircle,
  FileText,
  Link as LinkIcon,
  MoreVertical,
  Trash2,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AddFileDeliverableDialog } from './add-file-deliverable-dialog'
import { AddLinkDeliverableDialog } from './add-link-deliverable-dialog'

interface DeliverablesCardProps {
  deliverables: Deliverable[]
  spaceId: string
  totalPages: number
  currentPage: number
  isOwner: boolean
}

export function DeliverablesCard({
  deliverables: initialDeliverables,
  spaceId,
  totalPages,
  currentPage,
  isOwner,
}: DeliverablesCardProps) {
  const [deliverables, setDeliverables] = useState(initialDeliverables)
  const [page, setPage] = useState(currentPage)
  const [loading, setLoading] = useState(false)

  const fetchDeliverables = async (pageNumber: number) => {
    setLoading(true)
    try {
      const response = await getDeliverables(spaceId, pageNumber)
      if (response?.docs) {
        setDeliverables(response.docs)
        setPage(pageNumber)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (deliverable: Deliverable) => {
    try {
      const result = await deleteDeliverable(deliverable.id, spaceId, page)
      if (result.success && result.deliverables?.docs) {
        setDeliverables(result.deliverables.docs)
        if (result.deliverables.docs.length === 0 && page > 1) {
          fetchDeliverables(page - 1)
        }
      }
      toast({
        title: 'Deliverable deleted successfully',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to delete deliverable',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleStatusUpdate = async (
    deliverable: Deliverable,
    status: 'approved' | 'correction',
  ) => {
    try {
      const result = await updateDeliverableStatus(
        deliverable.id,
        status,
        status === 'correction' ? 'Please review and update the deliverable.' : undefined,
      )
      if (result.success) {
        fetchDeliverables(page)
        toast({
          title: 'Status updated successfully',
          variant: 'success',
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to update status',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>
      case 'correction':
        return <Badge variant="destructive">Needs Correction</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const handleView = async (deliverable: Deliverable) => {
    try {
      await trackDeliverableView(deliverable.id)
      fetchDeliverables(page)
    } catch (error) {
      console.error('Failed to track view:', error)
    }
  }

  const renderViews = (deliverable: Deliverable) => {
    if (!deliverable.views?.length) return null

    return (
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs text-muted-foreground">Viewed by:</span>
        <div className="flex -space-x-2">
          {deliverable.views.map((view, i) => (
            <Avatar key={i} className="h-5 w-5 border-2 border-background">
              <AvatarImage
                src={
                  isRel(view.user) && isMediaRel(view.user.avatar)
                    ? view.user.avatar.url
                    : undefined
                }
                alt={(isRel(view.user) && view.user.name) || ''}
              />
              <AvatarFallback className="text-[10px]">
                {isRel(view.user) && getInitials(view.user.name)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    )
  }

  const handleAddFile = async (data: { name: string; file: File }) => {
    try {
      const result = await createFileDeliverable({
        ...data,
        spaceId: Number(spaceId),
      })
      if (result?.success && result.deliverables?.docs) {
        setDeliverables(result.deliverables.docs)
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

  const handleAddLink = async (data: { name: string; url: string }) => {
    try {
      const result = await createLinkDeliverable({
        ...data,
        spaceId: Number(spaceId),
      })
      if (result?.success && result.deliverables?.docs) {
        setDeliverables(result.deliverables.docs)
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

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-purple-600">Deliverables</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Track and manage project deliverables, submissions, and their approval status.
          </CardDescription>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <AddFileDeliverableDialog onSubmit={handleAddFile} />
          <AddLinkDeliverableDialog onSubmit={handleAddLink} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {deliverables.length === 0 ? (
            <p className="text-sm text-muted-foreground">No deliverables yet</p>
          ) : (
            deliverables.map((deliverable) => (
              <div
                key={deliverable.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted/50"
              >
                <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                  {deliverable.type === 'file' ? (
                    <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                  ) : (
                    <LinkIcon className="h-5 w-5 text-green-500 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate max-w-sm">{deliverable.name}</p>
                      {getStatusBadge(deliverable.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Submitted{' '}
                      {formatDistanceToNow(new Date(deliverable.createdAt), { addSuffix: true })}
                      {deliverable.type === 'file' && ` • ${getResourceSize(deliverable)}`}
                    </p>
                    {deliverable.statusComment && (
                      <p className="text-sm text-destructive mt-1">{deliverable.statusComment}</p>
                    )}
                    {renderViews(deliverable)}
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {deliverable.type === 'link' && (
                    <Link
                      href={deliverable.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none"
                      onClick={() => handleView(deliverable)}
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        Open Link
                      </Button>
                    </Link>
                  )}
                  {deliverable.type === 'file' && (
                    <Link
                      href={isFileResource(deliverable) ? deliverable.attachment.url! : ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none"
                      onClick={() => handleView(deliverable)}
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
                        {isOwner && deliverable.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(deliverable, 'approved')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(deliverable, 'correction')}
                            >
                              <XCircle className="mr-2 h-4 w-4 text-destructive" />
                              Request Changes
                            </DropdownMenuItem>
                          </>
                        )}
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
                        <AlertDialogTitle>Delete deliverable?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this {deliverable.type}. This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(deliverable)}
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
          {deliverables.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              loading={loading}
              onPageChange={fetchDeliverables}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

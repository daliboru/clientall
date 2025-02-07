'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useSpace } from '@/hooks/useSpace'
import { useSpaceNotes } from '@/hooks/useSpaceNotes'
import { asManyRel, isMediaRel, isRel } from '@/lib/payload-utils'
import { Note, User } from '@/payload-types'
import { formatDistanceToNow } from 'date-fns'
import { useParams } from 'next/navigation'
import { AboutCard } from './_components/about-card'
import { NotesCard } from './_components/notes-card'

const getNoteAuthor = (note: Note) => {
  const author = isRel(note.createdBy) ? note.createdBy : null
  return {
    name: author?.name ?? 'Unknown User',
    avatar: author?.avatar ?? null,
  }
}

export default function SpacePage() {
  const params = useParams<{ spaceId: string }>()
  const { data: space, isLoading: isSpaceLoading } = useSpace(params.spaceId)
  const { data: notes, isLoading: isNotesLoading } = useSpaceNotes(params.spaceId)

  if (!space && !isSpaceLoading) {
    return null
  }

  return (
    <>
      <AboutCard space={space!} isLoading={isSpaceLoading} />
      <NotesCard notes={notes} isLoading={isNotesLoading} />
    </>
  )
}

'use client'

import { useSpace } from '@/hooks/useSpace'
import { useSpaceNotes } from '@/hooks/useSpaceNotes'
import { useParams } from 'next/navigation'
import { AboutCard } from './_components/about-card'
import { NotesCard } from './_components/notes-card'

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

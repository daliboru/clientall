import { Media } from '../payload-types'

export const isRel = <T>(objOrId?: T | number | null): objOrId is T => {
  if (!objOrId || typeof objOrId === 'number') return false
  return true
}

export const isMediaRel = (media?: Media | number | null): media is Media & { url: string } => {
  if (!isRel(media)) return false
  return typeof media === 'object' && 'url' in media && typeof media.url === 'string'
}

// Improved type safety for handling nested relations
export const asManyRel = <T>(
  rels?: (T | number)[] | { docs?: (T | number)[] | null } | null,
): T[] => {
  if (!rels) return []

  // Handle paginated relations (like relatedNotes)
  if (typeof rels === 'object' && 'docs' in rels) {
    return rels.docs ? rels.docs.filter((rel): rel is T => isRel(rel)) : []
  }

  // Handle direct arrays
  if (Array.isArray(rels)) {
    return rels.filter((rel): rel is T => isRel(rel))
  }

  return []
}

export const extractID = (objOrId: ({ id: number } & Record<string, unknown>) | number): number => {
  return typeof objOrId === 'number' ? objOrId : objOrId.id
}

import { Media } from '../payload-types'

export const isRel = <T>(objOrId?: T | number | null): objOrId is T => {
  if (!objOrId || typeof objOrId === 'number') return false
  return true
}

// Add a specific helper for Media type
export const isMediaRel = (media?: Media | number | null): media is Media & { url: string } => {
  if (!isRel(media)) return false
  return typeof media === 'object' && 'url' in media && typeof media.url === 'string'
}

export const asManyRel = <T>(rels?: (T | number)[] | null): T[] => {
  if (!rels) return []
  return rels.filter((rel): rel is T => isRel(rel))
}

export const extractID = (objOrId: ({ id: number } & Record<string, unknown>) | number): number => {
  return typeof objOrId === 'number' ? objOrId : objOrId.id
}

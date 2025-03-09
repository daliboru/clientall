import { getServerAuth } from '../getServerAuth'

export async function getUserById(id?: number) {
  if (!id) {
    return null
  }
  const { payload } = await getServerAuth()

  const user = await payload.findByID({
    collection: 'users',
    id,
    depth: 0,
  })
  return user
}

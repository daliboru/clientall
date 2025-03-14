import config from '@/payload.config'
import { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { HydrateClientUser } from '../_components/HydrateClientUser'
import Nav from '../_components/Nav/Nav'

export const metadata: Metadata = {
  title: {
    template: '%s | Tiny Portals',
    default: 'Tiny Portals',
  },
}

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { permissions, user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard`,
    )
  }

  return (
    <>
      <HydrateClientUser permissions={permissions} user={user} />
      <div className="flex flex-col items-center justify-start h-screen">
        <Nav />
        <div className="w-full max-w-7xl px-6 mt-4">{children}</div>
      </div>
    </>
  )
}

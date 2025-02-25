import Nav from '@/components/Nav/Nav'
import { Toaster } from '@/components/ui/toaster'
import { getCurrentUser } from '@/lib/actions/auth'
import { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  return (
    <>
      <div className="flex flex-col items-center justify-start h-screen">
        <Nav user={user} />
        <div className="w-full max-w-7xl px-6 mt-4">{children}</div>
      </div>
      <Toaster />
    </>
  )
}

export default Layout

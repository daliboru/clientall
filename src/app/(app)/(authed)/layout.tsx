'use client'

import Nav from '@/components/Nav'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter as FontSans } from 'next/font/google'
import { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
})

type LayoutProps = {
  children: ReactNode
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const Layout = ({ children }: LayoutProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <div className="flex flex-col items-center justify-start h-screen">
          <Nav />
          <div className="w-full max-w-7xl px-6 mt-4">{children}</div>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  )
}

export default Layout

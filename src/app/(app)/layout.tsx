import { Toaster } from '@/app/(app)/_components/ui/toaster'
import { cn } from '@/lib/utils'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter as FontSans } from 'next/font/google'
import { ReactNode } from 'react'
import { AuthProvider } from './_providers/Auth'
import './global.css'

type LayoutProps = {
  children: ReactNode
}
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const Layout = ({ children }: LayoutProps) => {
  return (
    <html>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}

export default Layout

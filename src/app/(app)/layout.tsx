import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'
import { ReactNode } from 'react'
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
    <div className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
      {children}
    </div>
  )
}

export default Layout

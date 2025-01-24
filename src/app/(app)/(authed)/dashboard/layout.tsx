import { Inter as FontSans } from 'next/font/google'
import { ReactNode } from 'react'
import Nav from '../../../../components/Nav'
import { cn } from '../../../../lib/utils'

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
      <div className="flex flex-col items-center justify-start h-screen">
        <Nav />
        <div className="flex-grow w-2/3 bg-gray-100 mt-4"> {children}</div>
      </div>
    </div>
  )
}

export default Layout

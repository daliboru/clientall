import { ReactNode } from 'react'
import './globals.css'

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

export default Layout

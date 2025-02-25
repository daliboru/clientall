import { NotFound } from '@/components/ui/not-found'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function NotFoundPage() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <NotFound />
        </div>
      </body>
    </html>
  )
}
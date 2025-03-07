import { NotFound } from '@/app/(app)/_components/ui/not-found'
import { cn } from '@/lib/utils'
import { Inter as FontSans } from 'next/font/google'

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

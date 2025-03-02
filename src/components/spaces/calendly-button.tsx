'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Calendar } from 'lucide-react'
import { PopupButton } from 'react-calendly'

interface CalendlyButtonProps {
  url?: string | null
  isOwner?: boolean
  name: string
  email: string
}

export function CalendlyButton({ url, isOwner, name, email }: CalendlyButtonProps) {
  if (!url) {
    if (isOwner) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant="outline" size="sm" disabled>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add your Calendly URL in settings to enable scheduling</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button variant="outline" size="sm" disabled>
                <Calendar className="h-4 w-4 mr-2" />
                Scheduling Unavailable
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{"The space owner hasn't enabled scheduling yet"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return (
    <PopupButton
      url={url}
      prefill={{ name, email }}
      rootElement={document.getElementById('root') || document.body}
      text={
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Call
        </div>
      }
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
    />
  )
}

{
  /* <Button onClick={handleOpenCalendly} variant="outline" size="sm">
      <Calendar className="h-4 w-4 mr-2" />
      Schedule a Meeting
    </Button> */
}

'use client'

import { Send, X } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Button } from './button'
import { Card } from './card'
import { Input } from './input'
import { ScrollArea } from './scroll-area'

interface Message {
  id: string
  content: string
  sender: {
    name: string
    avatar?: string
  }
  timestamp: Date
}

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  itemId: number
  itemType: 'deliverable' | 'note' | 'resource'
}

export function ChatSidebar({ isOpen, onClose, itemId, itemType }: ChatSidebarProps) {
  const [message, setMessage] = useState('')

  // Dummy data - replace with real data later
  const dummyMessages: Message[] = [
    {
      id: '1',
      content: 'This looks great! Just a few minor adjustments needed.',
      sender: { name: 'John Doe', avatar: '/avatars/john.jpg' },
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      content: "Thanks! I'll work on those changes right away.",
      sender: { name: 'Jane Smith' },
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
  ]

  const handleSend = () => {
    if (!message.trim()) return
    // Handle sending message
    setMessage('')
  }

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-[400px] bg-background border-l transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Comments</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {dummyMessages.map((msg) => (
              <Card key={msg.id} className="p-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.avatar} />
                    <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{msg.sender.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{msg.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="icon" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

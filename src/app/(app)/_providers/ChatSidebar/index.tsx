'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { ChatSidebar } from '../../_components/ui/chat-sidebar'

interface ChatSidebarContextType {
  openChat: (itemId: number, itemType: 'deliverable' | 'note' | 'resource') => void
  closeChat: () => void
}

const ChatSidebarContext = createContext<ChatSidebarContextType>({
  openChat: () => {},
  closeChat: () => {},
})

export function ChatSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<{
    id: number
    type: 'deliverable' | 'note' | 'resource'
  } | null>(null)

  const openChat = (itemId: number, itemType: 'deliverable' | 'note' | 'resource') => {
    setActiveItem({ id: itemId, type: itemType })
    setIsOpen(true)
  }

  const closeChat = () => {
    setTimeout(() => {
      setActiveItem(null)
    }, 300) // Match the transition duration
    setIsOpen(false)
  }

  return (
    <ChatSidebarContext.Provider value={{ openChat, closeChat }}>
      {children}
      <ChatSidebar
        isOpen={isOpen}
        onClose={closeChat}
        itemId={activeItem?.id ?? 0}
        itemType={activeItem?.type ?? 'note'}
      />
    </ChatSidebarContext.Provider>
  )
}

export const useChatSidebar = () => useContext(ChatSidebarContext)

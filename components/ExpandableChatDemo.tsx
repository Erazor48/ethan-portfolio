"use client"

import { useState, FormEvent } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat"
import { ChatMessageList } from "@/components/ui/chat-message-list"
import { useChat } from "@/components/hooks/useChat"

export function ExpandableChatDemo() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const [input, setInput] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    await sendMessage(message)
  }

  const handleAttachFile = () => {
    // File attachment functionality
    console.log("Attach file")
  }

  const handleMicrophoneClick = () => {
    // Voice recording functionality
    console.log("Voice recording")
  }

  const handleClearChat = () => {
    clearMessages()
  }

  return (
    <div className="h-[600px] relative">
      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
      >
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Chat with Ethan ✨</h1>
          <p className="text-sm text-muted-foreground">
            Ask me anything about Ethan's skills, projects, and experience
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              ⚠️ This chatbot is currently in early development and may not provide accurate information yet.
              <br/>
              It not work very well but it will be fix as soon as possible.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="mt-2 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear Chat
          </Button>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.role === 'user' ? 'sent' : 'received'}
              >
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src={
                    message.role === 'user'
                      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                      : "/Profile_Pickture_Men.png"
                  }
                  fallback={message.role === 'user' ? 'You' : 'EO'}
                />
                <ChatBubbleMessage
                  variant={message.role === 'user' ? 'sent' : 'received'}
                >
                  {message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="/Profile_Pickture_Men.png"
                  fallback="EO"
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}

            {error && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="/Profile_Pickture_Men.png"
                  fallback="EO"
                />
                <ChatBubbleMessage variant="received">
                  <div className="text-red-500 text-sm">
                    Error: {error}
                  </div>
                </ChatBubbleMessage>
              </ChatBubble>
            )}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          <form
            onSubmit={handleSubmit}
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          >
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Ethan's skills, projects, or experience..."
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              disabled={isLoading}
            />
            <div className="flex items-center p-3 pt-0 justify-between">
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleAttachFile}
                  disabled={isLoading}
                >
                  <Paperclip className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleMicrophoneClick}
                  disabled={isLoading}
                >
                  <Mic className="size-4" />
                </Button>
              </div>
              <Button 
                type="submit" 
                size="sm" 
                className="ml-auto gap-1.5"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? 'Sending...' : 'Send'}
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  )
} 
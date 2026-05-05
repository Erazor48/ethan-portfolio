"use client"

import { useRef, useState, FormEvent } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft, RotateCcw, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble"
import { ChatInput } from "@/components/ui/chat/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/chat/expandable-chat"
import { ChatMessageList } from "@/components/ui/chat/chat-message-list"
import { useChat } from "@/components/hooks/useChat"
import { TypewriterMessage } from "./AnimatedSection"

export function ExpandableChatDemo() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const [input, setInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    await sendMessage(message)
  }

  const openFilePicker = () => fileInputRef.current?.click()

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    console.log('Files selected:', Array.from(files).map(f => `${f.name} (${f.size} bytes, ${f.type})`))

    try {
      const form = new FormData()
      Array.from(files).forEach(f => {
        console.log('Adding file to form:', f.name)
        form.append('files', f)
      })

      console.log('Sending to /api/ingest/file...')
      const res = await fetch('/api/ingest/file', { method: 'POST', body: form })
      console.log('Response status:', res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Upload failed:', errorText)
        throw new Error(`Upload failed (${res.status}): ${errorText}`)
      }

      const data = await res.json()
      console.log('Upload success:', data)
      await sendMessage(`I've attached ${data.ingested} document(s). Please consider them in your next answer.`)
    } catch (err) {
      console.error('Upload error:', err)
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      e.target.value = ''
    }
  }

  const handleAttachFile = () => {
    if (isLoading) return
    openFilePicker()
  }

  const handleMicrophoneClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      audioChunksRef.current = []
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data)
      }
      mr.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('audio', blob, 'recording.webm')
        try {
          const res = await fetch('/api/transcribe', { method: 'POST', body: form })
          if (!res.ok) throw new Error('Transcription failed')
          const data = await res.json()
          const text: string = data.text || ''
          if (text.trim()) {
            await fetch('/api/ingest/text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: 'Voice note', content: text })
            })
            await sendMessage(`I have a new voice transcript. Please take it into account.`)
          } else {
            alert('No speech detected.')
          }
        } catch (e) {
          alert('Transcription failed. Check OPENAI_API_KEY and model availability.')
        } finally {
          stream.getTracks().forEach(t => t.stop())
        }
      }
      mediaRecorderRef.current = mr
      mr.start()
      setIsRecording(true)
    } catch (err) {
      alert('Microphone permission denied or not available.')
    }
  }

  const handleClearChat = () => {
    clearMessages()
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.pdf,.docx,.xlsx,.xls,.csv,.png,.jpg,.jpeg,text/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*"
        className="hidden"
        onChange={onFileSelected}
      />
      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
      >
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Chat with Ethan ✨</h1>
          <p className="text-sm text-muted-primary-fg">
            Ask me questions about my skills, projects, and experience
          </p>

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
          <ChatMessageList resetKey={messages.length} smooth followWhileGrowing>
            {messages.map((message, idx) => {
              const isLast = idx === messages.length - 1

              return (
                <ChatBubble
                  key={message.id}
                  variant={message.role === "user" ? "sent" : "received"}
                >
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={
                      message.role === "user"
                        ? "/img/profile/Women_Anime.png"
                        : "/img/profile/Men_Anime.png"
                    }
                    fallback={message.role === "user" ? "You" : "EO"}
                  />

                  <ChatBubbleMessage
                    variant={message.role === "user" ? "sent" : "received"}
                  >
                    {isLast && message.role !== "user" ? (
                      <TypewriterMessage content={message.content} />
                    ) : (
                      message.content
                    )}
                  </ChatBubbleMessage>
                </ChatBubble>
              )
            })}

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="/img/profile/Men_Anime.png"
                  fallback="EO"
                />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}

            {error && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar
                  className="h-8 w-8 shrink-0"
                  src="/img/profile/Men_Anime.png"
                  fallback="EO"
                />
                <ChatBubbleMessage variant="received">
                  <div className="text-destructive-fg text-sm">Error: {error}</div>
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
              placeholder="Ask a question about my skills, projects, or experience..."
              className="min-h-12 resize-none rounded-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // empêche le retour à la ligne
                  handleSubmit(e);    // appelle ton submit
                }
              }}
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
                  variant={isRecording ? 'destructive' : 'ghost'}
                  size="icon"
                  type="button"
                  onClick={handleMicrophoneClick}
                  disabled={isLoading}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? <Square className="size-4" /> : <Mic className="size-4" />}
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
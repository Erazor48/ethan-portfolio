"use client"

import { useRef, useState, FormEvent } from "react"
import { Bot, Paperclip, Mic, CornerDownLeft, RotateCcw, Square, Loader2 } from "lucide-react"
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
import { MarkdownRenderer } from "./MarkdownRender"

export function ExpandableChatDemo() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const [input, setInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // ── Text submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const message = input.trim()
    setInput("")
    sendMessage(message)
  }

  // ── File attachment ────────────────────────────────────────────────────────
  const handleAttachFile = () => {
    if (isLoading || isUploading) return
    fileInputRef.current?.click()
  }

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const form = new FormData()
      const fileNames = Array.from(files).map(f => f.name)
      Array.from(files).forEach(f => form.append('files', f))

      const res = await fetch('/api/ingest/file', { method: 'POST', body: form })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error ${res.status}`)
      }

      const data = await res.json()

      if (data.ingested === 0) {
        throw new Error('No content could be extracted from the file(s).')
      }

      // Include filenames so the bot knows what was shared
      const names = fileNames.join(', ')
      sendMessage(
        `I've shared ${data.ingested} file(s) with you: ${names}. Please consider their content in your next answer.`
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      sendMessage(`⚠️ File upload failed: ${msg}`)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  // ── Microphone ─────────────────────────────────────────────────────────────
  const handleMicrophoneClick = async () => {
    // Stop recording
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }

    // Start recording
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      alert('Microphone permission denied or not available.')
      return
    }

    const mr = new MediaRecorder(stream)
    audioChunksRef.current = []

    mr.ondataavailable = (ev) => {
      if (ev.data.size > 0) audioChunksRef.current.push(ev.data)
    }

    mr.onstop = async () => {
      stream.getTracks().forEach(t => t.stop())
      setIsTranscribing(true)

      try {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const form = new FormData()
        form.append('audio', blob, 'recording.webm')

        const res = await fetch('/api/transcribe', { method: 'POST', body: form })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `Transcription error ${res.status}`)
        }

        const { text } = await res.json()

        if (text?.trim()) {
          // Put transcript in the input field so the user can review and send
          setInput(text.trim())
        } else {
          alert('No speech detected. Please try again.')
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        alert(`Transcription failed: ${msg}`)
      } finally {
        setIsTranscribing(false)
      }
    }

    mediaRecorderRef.current = mr
    mr.start()
    setIsRecording(true)
  }

  const busy = isLoading || isUploading || isTranscribing

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.md,.pdf,.docx,.xlsx,.xls,.csv,.png,.jpg,.jpeg,text/*,application/pdf"
        className="hidden"
        onChange={onFileSelected}
      />

      <ExpandableChat size="lg" position="bottom-right" icon={<Bot className="h-6 w-6" />}>
        <ExpandableChatHeader className="flex-col text-center justify-center">
          <h1 className="text-xl font-semibold">Chat with Ethan ✨</h1>
          <p className="text-sm text-muted-primary-fg">
            Ask me anything about my skills, projects, and experience
          </p>
          <Button variant="ghost" size="sm" onClick={clearMessages} className="mt-2 text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear Chat
          </Button>
        </ExpandableChatHeader>

        <ExpandableChatBody>
          <ChatMessageList resetKey={messages.length} smooth followWhileGrowing>
            {messages.map((message, idx) => {
              const isLast = idx === messages.length - 1
              const isAssistant = message.role === "assistant"

              return (
                <ChatBubble
                  key={message.id}
                  variant={isAssistant ? "received" : "sent"}
                >
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={isAssistant ? "/img/profile/Men_Anime.png" : "/img/profile/Women_Anime.png"}
                    fallback={isAssistant ? "EO" : "You"}
                  />
                  <ChatBubbleMessage variant={isAssistant ? "received" : "sent"}>
                    {isAssistant ? (
                      isLast ? (
                        <TypewriterMessage content={message.content} />
                      ) : (
                        <MarkdownRenderer content={message.content} />
                      )
                    ) : (
                      message.content
                    )}
                  </ChatBubbleMessage>
                </ChatBubble>
              )
            })}

            {/* Loading indicator */}
            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar className="h-8 w-8 shrink-0" src="/img/profile/Men_Anime.png" fallback="EO" />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}

            {/* Upload indicator */}
            {isUploading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar className="h-8 w-8 shrink-0" src="/img/profile/Men_Anime.png" fallback="EO" />
                <ChatBubbleMessage variant="received">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Reading your file…
                  </span>
                </ChatBubbleMessage>
              </ChatBubble>
            )}

            {/* Transcription indicator */}
            {isTranscribing && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar className="h-8 w-8 shrink-0" src="/img/profile/Men_Anime.png" fallback="EO" />
                <ChatBubbleMessage variant="received">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Transcribing your voice…
                  </span>
                </ChatBubbleMessage>
              </ChatBubble>
            )}

            {/* Error display */}
            {error && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar className="h-8 w-8 shrink-0" src="/img/profile/Men_Anime.png" fallback="EO" />
                <ChatBubbleMessage variant="received">
                  <div className="text-destructive-fg text-sm">Error: {error}</div>
                </ChatBubbleMessage>
              </ChatBubble>
            )}
          </ChatMessageList>
        </ExpandableChatBody>

        <ExpandableChatFooter>
          {/* Recording indicator bar */}
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border-b">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Recording… tap the mic to stop
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          >
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isRecording ? 'Recording…' :
                isTranscribing ? 'Transcribing…' :
                isUploading ? 'Processing file…' :
                'Ask a question about my skills, projects, or experience…'
              }
              className="min-h-12 resize-none rounded-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              disabled={busy}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />

            <div className="flex items-center p-3 pt-0 justify-between">
              <div className="flex gap-1">
                {/* Attach file */}
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleAttachFile}
                  disabled={busy}
                  title="Attach a file (PDF, Word, Excel, image, text…)"
                >
                  {isUploading
                    ? <Loader2 className="size-4 animate-spin" />
                    : <Paperclip className="size-4" />
                  }
                </Button>

                {/* Microphone */}
                <Button
                  variant={isRecording ? 'destructive' : 'ghost'}
                  size="icon"
                  type="button"
                  onClick={handleMicrophoneClick}
                  disabled={isLoading || isUploading || isTranscribing}
                  title={isRecording ? 'Stop recording' : 'Record a voice note'}
                >
                  {isTranscribing
                    ? <Loader2 className="size-4 animate-spin" />
                    : isRecording
                      ? <Square className="size-4" />
                      : <Mic className="size-4" />
                  }
                </Button>
              </div>

              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
                disabled={busy || !input.trim()}
              >
                {isLoading ? <><Loader2 className="size-3 animate-spin" /> Sending…</> : <>Send <CornerDownLeft className="size-3.5" /></>}
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  )
}

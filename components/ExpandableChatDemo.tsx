"use client"

import { useRef, useState, FormEvent } from "react"
import {
  Bot, Paperclip, Mic, CornerDownLeft, RotateCcw,
  Square, Loader2, X, FileText, FileImage, File,
} from "lucide-react"
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
import { useChat, FileContext } from "@/components/hooks/useChat"
import { TypewriterMessage } from "./AnimatedSection"
import { MarkdownRenderer } from "./MarkdownRender"

interface AttachedFile {
  id: string
  name: string
  preview: string
}

const MAX_FILE_MB = 10

function FileIcon({ name }: { name: string }) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext))
    return <FileImage className="size-3 shrink-0 text-blue-400" />
  if (['pdf', 'doc', 'docx', 'txt', 'md', 'csv', 'xlsx', 'xls'].includes(ext))
    return <FileText className="size-3 shrink-0 text-orange-400" />
  return <File className="size-3 shrink-0 text-muted-foreground" />
}

export function ExpandableChatDemo() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()
  const [input, setInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const committedRef = useRef("") // finalized transcript segments

  // ── Text submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    const fileContexts: FileContext[] = attachedFiles.map(f => ({ name: f.name, preview: f.preview }))

    setInput("")
    setUploadError(null)
    setTranscriptionError(null)
    setAttachedFiles([])
    sendMessage(message, fileContexts)
  }

  // ── File attachment ────────────────────────────────────────────────────────
  const handleAttachFile = () => {
    if (isLoading || isUploading) return
    fileInputRef.current?.click()
  }

  const removeAttachedFile = (id: string) =>
    setAttachedFiles(prev => prev.filter(f => f.id !== id))

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadError(null)

    for (const file of Array.from(files)) {
      if (file.size / (1024 * 1024) > MAX_FILE_MB) {
        setUploadError(`"${file.name}" exceeds the ${MAX_FILE_MB} MB limit.`)
        e.target.value = ''
        return
      }
    }

    setIsUploading(true)
    try {
      const form = new FormData()
      Array.from(files).forEach(f => form.append('files', f))

      const res = await fetch('/api/ingest/file', { method: 'POST', body: form })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error ${res.status}`)
      }

      const data = await res.json()

      if (data.ingested === 0) {
        const firstError = data.results?.[0]?.status ?? 'No content could be extracted.'
        throw new Error(firstError)
      }

      const newFiles: AttachedFile[] = (data.results as { name: string; status: string; preview?: string }[])
        .filter(r => r.status === 'ok')
        .map(r => ({ id: `${Date.now()}-${r.name}`, name: r.name, preview: r.preview ?? '' }))

      setAttachedFiles(prev => [...prev, ...newFiles])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  // ── Microphone (Web Speech API) ────────────────────────────────────────────
  const handleMicrophoneClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setTranscriptionError('Voice input requires Chrome or Edge.')
      return
    }

    setTranscriptionError(null)
    committedRef.current = ""

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language // respects browser language setting

    recognition.onstart = () => setIsRecording(true)

    recognition.onresult = (event: any) => {
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const segment = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          committedRef.current += segment + " "
        } else {
          interim += segment
        }
      }
      setInput((committedRef.current + interim).trimStart())
    }

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setTranscriptionError(`Microphone error: ${event.error}`)
      }
      setIsRecording(false)
    }

    recognition.onend = () => setIsRecording(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  const busy = isLoading || isUploading

  const handleClearMessages = () => {
    clearMessages()
    setAttachedFiles([])
    setUploadError(null)
    setTranscriptionError(null)
  }

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
          <Button variant="ghost" size="sm" onClick={handleClearMessages} className="mt-2 text-xs">
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

            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar className="h-8 w-8 shrink-0" src="/img/profile/Men_Anime.png" fallback="EO" />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}

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
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border-b">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Listening… tap the mic to stop
            </div>
          )}

          {/* Attached file chips */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b bg-muted/30">
              {attachedFiles.map(f => (
                <div
                  key={f.id}
                  className="flex items-center gap-1.5 bg-background border rounded-full px-2.5 py-1 text-xs max-w-[200px]"
                >
                  <FileIcon name={f.name} />
                  <span className="truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(f.id)}
                    className="ml-0.5 text-muted-foreground hover:text-destructive shrink-0"
                    title="Remove file"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload error banner */}
          {uploadError && (
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-destructive bg-destructive/10 border-b">
              <span>⚠️ {uploadError}</span>
              <button type="button" onClick={() => setUploadError(null)}>
                <X className="size-3" />
              </button>
            </div>
          )}

          {/* Transcription error banner */}
          {transcriptionError && (
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-destructive bg-destructive/10 border-b">
              <span>🎙️ {transcriptionError}</span>
              <button type="button" onClick={() => setTranscriptionError(null)}>
                <X className="size-3" />
              </button>
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
                isRecording ? 'Listening… speak your message' :
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

                <Button
                  variant={isRecording ? 'destructive' : 'ghost'}
                  size="icon"
                  type="button"
                  onClick={handleMicrophoneClick}
                  disabled={busy}
                  title={isRecording ? 'Stop listening' : 'Dictate your message'}
                >
                  {isRecording
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
                {isLoading
                  ? <><Loader2 className="size-3 animate-spin" /> Sending…</>
                  : <>Send <CornerDownLeft className="size-3.5" /></>
                }
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  )
}

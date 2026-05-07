import { useState, useCallback, useEffect, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface FileContext {
  name: string;
  preview: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm Ethan's AI assistant. Ask me anything about his **skills**, **projects**, **experience**, or **background** — I'm here to help!",
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMounted = useRef(false);
  // File contexts to inject into the next API call (not stored in message history)
  const pendingFileContextsRef = useRef<FileContext[]>([]);

  const sendMessage = useCallback((content: string, fileContexts?: FileContext[]) => {
    if (!content.trim()) return;

    pendingFileContextsRef.current = fileContexts ?? [];

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (messages.length === 0) return;

    const last = messages[messages.length - 1];
    if (last.role !== "user") return;

    const sendToApi = async () => {
      try {
        const fileContexts = pendingFileContextsRef.current;

        const n = 12;
        const lastMessages = messages.slice(-n);

        // Build the API payload — inject file content directly into the last user message.
        // This is more reliable than relying on the RAG singleton being shared across routes.
        const apiMessages = lastMessages.map((m, i) => {
          const isLastMsg = i === lastMessages.length - 1;
          if (isLastMsg && fileContexts.length > 0) {
            const fileBlock = fileContexts
              .map(f => `\n\n[Content of uploaded file "${f.name}"]\n${f.preview}\n[End of "${f.name}"]`)
              .join('');
            return { role: m.role, content: m.content + fileBlock };
          }
          return { role: m.role, content: m.content };
        });

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          throw new Error("Erreur de communication avec le serveur");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    sendToApi();
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    pendingFileContextsRef.current = [];
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

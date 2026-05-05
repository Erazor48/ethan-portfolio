import { useState, useCallback, useEffect, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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

  // Ref pour éviter le premier appel automatique au montage
  const hasMounted = useRef(false);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]); // 🔹 Ajout du message user
    setIsLoading(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (messages.length === 0) return;

    // ⚡️ Ne déclencher l’API que si le dernier message est un "user"
    const last = messages[messages.length - 1];
    if (last.role !== "user") return;

    const sendToApi = async () => {
      try {
        const n = 12;
        const lastMessages = messages.slice(-n);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: lastMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
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

        setMessages((prev) => [...prev, assistantMessage]); // 🔹 Ajout du message assistant
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
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

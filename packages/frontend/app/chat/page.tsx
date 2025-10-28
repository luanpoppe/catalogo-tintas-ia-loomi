"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { streamChatMessage } from "@/lib/api"
import { ChatHeader } from "@/components/chat-header"
import { ChatContainer } from "@/components/chat-container"
import { ChatInput } from "@/components/chat-input"
import type { Message } from "@/components/chat-message"
import { useToast } from "@/hooks/use-toast"

export default function ChatPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  const getMockResponse = (userMessage: string): { message: string; imageUrl?: string } => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("azul") || lowerMessage.includes("blue")) {
      return {
        message:
          "Ótima escolha! Para tons de azul, recomendo nossa linha Premium Azul Serenidade. É perfeita para ambientes que buscam tranquilidade e sofisticação. Aqui está uma amostra da cor:",
        imageUrl: "/blue-paint-color-swatch-sample.jpg",
      }
    }

    if (lowerMessage.includes("vermelho") || lowerMessage.includes("red")) {
      return {
        message:
          "Vermelho é uma cor vibrante e energética! Nossa tinta Vermelho Paixão é ideal para criar ambientes acolhedores e estimulantes. Veja como fica:",
        imageUrl: "/red-paint-color-swatch-sample.jpg",
      }
    }

    if (lowerMessage.includes("verde") || lowerMessage.includes("green")) {
      return {
        message:
          "Verde traz a natureza para dentro de casa! Recomendo nosso Verde Floresta, que combina frescor e elegância. Confira a amostra:",
        imageUrl: "/green-paint-color-swatch-sample.jpg",
      }
    }

    if (lowerMessage.includes("sala") || lowerMessage.includes("living")) {
      return {
        message:
          "Para salas de estar, recomendo cores neutras e acolhedoras como bege, cinza claro ou tons pastéis. Essas cores criam um ambiente versátil e confortável. Aqui está uma paleta sugerida:",
        imageUrl: "/neutral-living-room-paint-colors-palette.jpg",
      }
    }

    return {
      message:
        "Olá! Sou o assistente do Catálogo Inteligente de Tintas. Posso ajudá-lo a encontrar a tinta perfeita para seu projeto. Me conte: qual ambiente você deseja pintar? Que cores você tem em mente?",
    }
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Create placeholder for assistant message
    const assistantMessageId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setStreamingMessageId(assistantMessageId)

    let backendAvailable = true

    streamChatMessage(
      content,
      // On text chunk
      (chunk) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg)),
        )
      },
      // On image
      (imageUrl) => {
        setMessages((prev) => prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, imageUrl } : msg)))
      },
      // On complete
      () => {
        setIsLoading(false)
        setStreamingMessageId(null)
      },
      // On error
      async (error) => {
        // If backend not available, use mock responses
        if (
          error.message.includes("404") ||
          error.message.includes("Not Found") ||
          error.message.includes("Failed to fetch")
        ) {
          backendAvailable = false

          try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const mockResponse = getMockResponse(content)

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      content: mockResponse.message,
                      imageUrl: mockResponse.imageUrl,
                    }
                  : msg,
              ),
            )

            toast({
              title: "Modo de Demonstração",
              description: "Backend não conectado. Usando respostas simuladas para teste.",
            })
          } catch (fallbackError: any) {
            toast({
              title: "Erro ao processar mensagem",
              description: "Não foi possível processar a mensagem. Tente novamente.",
              variant: "destructive",
            })

            // Remove failed message
            setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId))
          } finally {
            setIsLoading(false)
            setStreamingMessageId(null)
          }
        } else {
          toast({
            title: "Erro ao enviar mensagem",
            description: error.message || "Não foi possível enviar a mensagem. Tente novamente.",
            variant: "destructive",
          })

          // Remove failed message
          setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId))
          setIsLoading(false)
          setStreamingMessageId(null)
        }
      },
    )
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50/50 via-white to-purple-50/50 dark:from-purple-950/10 dark:via-background dark:to-purple-950/10">
      <ChatHeader />
      <ChatContainer messages={messages} />
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

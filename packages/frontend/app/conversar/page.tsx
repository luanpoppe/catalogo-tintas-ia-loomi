"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { sendChatMessage } from "@/lib/api"; // Importa sendChatMessage
import { ChatHeader } from "@/components/chat-header";
import { ChatContainer } from "@/components/chat-container";
import { ChatInput } from "@/components/chat-input";
import type { Message } from "@/components/chat-message";
import { useToast } from "@/hooks/use-toast";
import { APP_ROUTES } from "@/lib/routes";

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [shouldEraseMemoryForNextRequest, setShouldEraseMemoryForNextRequest] =
    useState(false); // Novo estado para controlar a limpeza de memória

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(APP_ROUTES.ENTRAR);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(APP_ROUTES.ENTRAR);
    }
  }, [router]);

  const handleNewChat = () => {
    setMessages([]); // Limpa todas as mensagens
    setShouldEraseMemoryForNextRequest(true); // Define para true para a próxima requisição
    toast({
      title: "Nova Conversa",
      description: "O histórico da conversa foi limpo.",
    });
  };

  const getMockResponse = (
    userMessage: string
  ): { message: string; imageUrl?: string } => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("azul") || lowerMessage.includes("blue")) {
      return {
        message:
          "Ótima escolha! Para tons de azul, recomendo nossa linha Premium Azul Serenidade. É perfeita para ambientes que buscam tranquilidade e sofisticação. Aqui está uma amostra da cor:",
        imageUrl: "/blue-paint-color-swatch-sample.jpg",
      };
    }

    if (lowerMessage.includes("vermelho") || lowerMessage.includes("red")) {
      return {
        message:
          "Vermelho é uma cor vibrante e energética! Nossa tinta Vermelho Paixão é ideal para criar ambientes acolhedores e estimulantes. Veja como fica:",
        imageUrl: "/red-paint-color-swatch-sample.jpg",
      };
    }

    if (lowerMessage.includes("verde") || lowerMessage.includes("green")) {
      return {
        message:
          "Verde traz a natureza para dentro de casa! Recomendo nosso Verde Floresta, que combina frescor e elegância. Confira a amostra:",
        imageUrl: "/green-paint-color-swatch-sample.jpg",
      };
    }

    if (lowerMessage.includes("sala") || lowerMessage.includes("living")) {
      return {
        message:
          "Para salas de estar, recomendo cores neutras e acolhedoras como bege, cinza claro ou tons pastéis. Essas cores criam um ambiente versátil e confortável. Aqui está uma paleta sugerida:",
        imageUrl: "/neutral-living-room-paint-colors-palette.jpg",
      };
    }

    return {
      message:
        "Olá! Sou o assistente do Catálogo Inteligente de Tintas. Posso ajudá-lo a encontrar a tinta perfeita para seu projeto. Me conte: qual ambiente você deseja pintar? Que cores você tem em mente?",
    };
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const typingMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: typingMessageId,
        role: "assistant",
        content: "Digitando...",
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      const response = await sendChatMessage(
        content,
        shouldEraseMemoryForNextRequest
      ); // Passa shouldEraseMemoryForNextRequest

      // Reseta o estado após o envio da requisição
      if (shouldEraseMemoryForNextRequest) {
        setShouldEraseMemoryForNextRequest(false);
      }

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== typingMessageId)
          .concat({
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: response.aiMessage,
            imageUrl: response.imageUrl,
            timestamp: new Date(),
          })
      );
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description:
          error.message ||
          "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
      setMessages((prev) =>
        prev.filter(
          (msg) => msg.id !== userMessage.id && msg.id !== typingMessageId
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50/50 via-white to-purple-50/50 dark:from-purple-950/10 dark:via-background dark:to-purple-950/10">
      <ChatHeader onNewChat={handleNewChat} /> {/* Passa a prop onNewChat */}
      <ChatContainer
        messages={messages}
        onSuggestionClick={handleSendMessage}
      />
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            onSetMessage={setInputMessage}
            value={inputMessage}
          />
        </div>
      </div>
    </div>
  );
}

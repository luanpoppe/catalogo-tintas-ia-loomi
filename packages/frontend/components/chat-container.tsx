"use client";
import { useEffect, useRef } from "react";
import { ChatMessage, type Message } from "@/components/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  messages: Message[];
}

export function ChatContainer({ messages }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 h-full" ref={scrollRef}>
      <div className="container mx-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Bem-vindo ao Assistente de Tintas!
              </h3>
              <p className="text-muted-foreground text-pretty max-w-md">
                Faça perguntas sobre tintas, cores, acabamentos e receba
                recomendações personalizadas com imagens.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              <div className="text-xs bg-muted px-3 py-2 rounded-full">
                Qual a melhor tinta para parede externa?
              </div>
              <div className="text-xs bg-muted px-3 py-2 rounded-full">
                Mostre cores de azul para quarto
              </div>
              <div className="text-xs bg-muted px-3 py-2 rounded-full">
                Diferença entre tinta fosca e acetinada
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </ScrollArea>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Sparkles } from "lucide-react";
import Image from "next/image";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp: Date;
  isTyping?: boolean; // Adiciona a propriedade isTyping
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-3 p-4", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <Avatar className={cn("h-8 w-8", isUser ? "bg-secondary" : "bg-primary")}>
        <AvatarFallback
          className={cn(
            isUser ? "text-secondary-foreground" : "text-primary-foreground"
          )}
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground border border-border"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.isTyping ? ( // Verifica se a mensagem é de digitação
              <span className="inline-flex gap-1">
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "0ms" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "150ms" }}
                >
                  .
                </span>
                <span
                  className="animate-bounce"
                  style={{ animationDelay: "300ms" }}
                >
                  .
                </span>
              </span>
            ) : (
              message.content
            )}
          </p>
        </div>

        {message.imageUrl && (
          <div className="rounded-lg overflow-hidden border border-border max-w-sm">
            <Image
              src={message.imageUrl || "/placeholder.svg"}
              alt="Imagem da resposta"
              width={400}
              height={300}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  onSetMessage: (message: string) => void;
  value: string; // Adiciona a prop value
}

export function ChatInput({
  onSend,
  isLoading,
  onSetMessage,
  value,
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      // Usa value em vez de message
      onSend(value.trim());
      onSetMessage(""); // Limpa o input através da prop
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        value={value} // Usa a prop value
        onChange={(e) => onSetMessage(e.target.value)} // Chama onSetMessage diretamente
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        className="min-h-[60px] max-h-[200px] resize-none"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        className="h-[60px] w-[60px] shrink-0"
        disabled={isLoading || !value.trim()} // Usa value em vez de message
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}

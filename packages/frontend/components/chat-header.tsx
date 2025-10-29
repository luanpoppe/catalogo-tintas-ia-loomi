"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, PlusCircle } from "lucide-react"; // Adicionado PlusCircle
import { clearTokens, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";

interface ChatHeaderProps {
  onNewChat: () => void; // Nova prop para iniciar nova conversa
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearTokens();
    router.push(APP_ROUTES.ENTRAR);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {user ? (
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation(); // Impede que o evento se propague para elementos pai
              e.preventDefault(); // Impede qualquer comportamento padrão (embora um div não tenha um)
              onNewChat(); // Limpa o histórico se o usuário estiver logado
            }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">
                Catálogo Inteligente de Tintas
              </h1>
              <p className="text-xs text-muted-foreground">Olá, {user.name}</p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onNewChat();
            }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">
                Catálogo Inteligente de Tintas
              </h1>
              {/* Não mostra o nome do usuário se não estiver logado */}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {" "}
          {/* Agrupando botões */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Nova Conversa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

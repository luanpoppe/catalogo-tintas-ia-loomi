"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";
import { clearTokens, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";

export function ChatHeader() {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearTokens();
    router.push(APP_ROUTES.ENTRAR);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={APP_ROUTES.HOME}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">
              Catálogo Inteligente de Tintas
            </h1>
            {user && (
              <p className="text-xs text-muted-foreground">Olá, {user.name}</p>
            )}
          </div>
        </Link>

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
    </header>
  );
}

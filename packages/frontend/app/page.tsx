"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, setDevModeAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Palette, Wrench } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(APP_ROUTES.CONVERSAR);
    }
  }, [router]);

  const handleDevLogin = () => {
    setDevModeAuth();
    router.push(APP_ROUTES.CONVERSAR);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950/20 dark:via-background dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-balance">
              Catálogo Inteligente de Tintas
            </h1>
          </div>

          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
            Descubra a tinta perfeita para seu projeto com a ajuda da
            inteligência artificial. Converse com nosso assistente e receba
            recomendações personalizadas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href={APP_ROUTES.CADASTRAR}>Começar Agora</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent"
            >
              <Link href={APP_ROUTES.ENTRAR}>Entrar</Link>
            </Button>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleDevLogin}
              variant="secondary"
              size="sm"
              className="gap-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
            >
              <Wrench className="h-4 w-4" />
              Modo Desenvolvimento (Testar Chat)
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Clique aqui para testar o chat sem precisar de login real
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="p-6 rounded-lg bg-card border border-border space-y-3">
              <MessageSquare className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-lg font-semibold">Chat Inteligente</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Converse naturalmente e receba recomendações personalizadas
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border space-y-3">
              <Palette className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-lg font-semibold">Visualização de Cores</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Veja imagens e amostras das tintas recomendadas
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border space-y-3">
              <Sparkles className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-lg font-semibold">IA Avançada</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Tecnologia de ponta para as melhores sugestões
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

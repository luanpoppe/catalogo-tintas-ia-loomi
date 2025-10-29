"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { isAuthenticated } from "@/lib/auth";
import { Sparkles } from "lucide-react";
import { APP_ROUTES } from "@/lib/routes";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(APP_ROUTES.CONVERSAR);
    }
  }, [router]);

  const handleSuccess = () => {
    router.push(APP_ROUTES.CONVERSAR);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-purple-950/20 dark:via-background dark:to-purple-950/20 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link
            href={APP_ROUTES.HOME}
            className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-balance">
              Catálogo Inteligente de Tintas
            </h1>
          </Link>
          <p className="text-muted-foreground text-pretty">
            Crie sua conta e comece a explorar o mundo das tintas com IA
          </p>
        </div>

        <AuthForm mode="cadastrar" onSuccess={handleSuccess} />

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href={APP_ROUTES.ENTRAR}
            className="text-primary hover:underline font-medium"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

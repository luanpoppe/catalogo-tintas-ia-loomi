"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { setTokens, setUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { API_ROUTES } from "@/lib/routes";

interface AuthFormProps {
  mode: "entrar" | "cadastrar";
  onSuccess?: () => void;
}

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nome, setNome] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "cadastrar" && senha !== confirmarSenha) {
        toast({
          title: "Erro de Cadastro",
          description: "As senhas não coincidem. Por favor, verifique.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const endpoint =
        mode === "entrar" ? API_ROUTES.AUTH.LOGIN : API_ROUTES.AUTH.CADASTRAR;
      const body =
        mode === "entrar"
          ? { email, senha }
          : { email, senha, nome, tipoUsuario: "COMUM" }; // Adicionado tipoUsuario

      const data = await apiRequest(endpoint, {
        method: "POST",
        data: body,
        requiresAuth: false,
      });

      setTokens({
        accessToken: data.accessToken,
      });

      setUser(data.user);

      toast({
        title: mode === "entrar" ? "Login realizado!" : "Conta criada!",
        description:
          mode === "entrar"
            ? "Bem-vindo de volta!"
            : "Sua conta foi criada com sucesso.",
        variant: "success",
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">
          {mode === "entrar" ? "Entrar" : "Criar Conta"}
        </CardTitle>
        <CardDescription>
          {mode === "entrar"
            ? "Entre com suas credenciais para acessar o chat"
            : "Crie sua conta para começar a usar o assistente de tintas"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "cadastrar" && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          {mode === "cadastrar" && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Repetir Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "entrar" ? "Entrar" : "Criar Conta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

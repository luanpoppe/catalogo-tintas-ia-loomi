import { PERMISSOES } from "@/generated/prisma/enums";
import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: number;
      tipoDeUsuario: PERMISSOES;
    };
  }
}

import { PERMISSOES } from "@/generated/prisma/enums";
import { FastifyReply, FastifyRequest } from "fastify";

export class VerificarPermissaoDoUsuarioMiddleware {
  static middleware(permissaoNecessaria: PERMISSOES) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const { tipoDeUsuario } = request.user;

      if (tipoDeUsuario !== permissaoNecessaria)
        return reply.status(403).send({ message: "Acesso não permitido." });
    };
  }
}

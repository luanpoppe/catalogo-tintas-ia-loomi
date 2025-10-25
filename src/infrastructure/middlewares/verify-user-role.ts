import { PERMISSOES } from "@/generated/prisma/enums";
import { FastifyReply, FastifyRequest } from "fastify";

export class VerifyUserRole {
  static async middleware(permissaoNecessaria: PERMISSOES) {
    return (request: FastifyRequest, reply: FastifyReply) => {
      const { tipoDeUsuario } = request.user;

      if (tipoDeUsuario !== permissaoNecessaria)
        return reply.status(403).send({ message: "Unauthorized." });
    };
  }
}

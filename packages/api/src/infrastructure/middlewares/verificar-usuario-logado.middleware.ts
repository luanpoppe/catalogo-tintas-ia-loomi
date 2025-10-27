import { FastifyReply, FastifyRequest } from "fastify";

export class VerificarUsuarioLogadoMiddleware {
  static async middleware(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.status(401).send({ error: "Acesso não autorizado." });
    }
  }
}

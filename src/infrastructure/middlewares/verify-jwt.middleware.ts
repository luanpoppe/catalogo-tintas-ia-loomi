import { FastifyReply, FastifyRequest } from "fastify";

export class VerifyJwtMiddleware {
  static async middleware(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
  }
}

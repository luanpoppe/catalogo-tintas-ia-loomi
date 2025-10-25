import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTintaUseCase } from "../../../application/use-cases/create-tinta.use-case";
import { RequestTintaDTO } from "../dto/tinta.dto";
import { TintaRepository } from "../../repositories/tinta.repository";

export class TintasController {
  static async create(
    request: FastifyRequest<{
      Body: RequestTintaDTO;
    }>,
    reply: FastifyReply
  ) {
    const tintaRepository = new TintaRepository();
    const useCase = new CreateTintaUseCase(tintaRepository);

    const { tinta } = await useCase.execute(request.body);

    return reply.status(201).send(tinta);
  }
}

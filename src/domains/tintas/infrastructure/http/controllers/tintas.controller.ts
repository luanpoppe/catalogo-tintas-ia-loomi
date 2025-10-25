import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTintaUseCase } from "../../../application/use-cases/create-tinta.use-case";
import { GetAllTintasUseCase } from "../../../application/use-cases/get-all-tintas.use-case";
import { GetTintaByIdUseCase } from "../../../application/use-cases/get-tinta-by-id.use-case";
import { UpdateTintaUseCase } from "../../../application/use-cases/update-tinta.use-case";
import { DeleteTintaUseCase } from "../../../application/use-cases/delete-tinta.use-case";
import { GetTintasByQueryUseCase } from "../../../application/use-cases/get-tintas-by-query.use-case";
import { RequestTintaDTO } from "../dto/tinta.dto";
import { TintaRepository } from "../../repositories/tinta.repository";
import { TintaQuery } from "../../../domain/repositories/tinta.repository";

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

  static async getAll(request: FastifyRequest, reply: FastifyReply) {
    const tintaRepository = new TintaRepository();
    const useCase = new GetAllTintasUseCase(tintaRepository);

    const { tintas } = await useCase.execute();

    return reply.status(200).send(tintas);
  }

  static async getById(
    request: FastifyRequest<{
      Params: { id: number };
    }>,
    reply: FastifyReply
  ) {
    const tintaRepository = new TintaRepository();
    const useCase = new GetTintaByIdUseCase(tintaRepository);

    const { id } = request.params;
    const { tinta } = await useCase.execute(id);

    if (!tinta) {
      return reply.status(404).send({ message: "Tinta não encontrada." });
    }

    return reply.status(200).send(tinta);
  }

  static async update(
    request: FastifyRequest<{
      Params: { id: number };
      Body: RequestTintaDTO;
    }>,
    reply: FastifyReply
  ) {
    const tintaRepository = new TintaRepository();
    const useCase = new UpdateTintaUseCase(tintaRepository);

    const { id } = request.params;
    const { tinta } = await useCase.execute(id, request.body);

    return reply.status(200).send(tinta);
  }

  static async delete(
    request: FastifyRequest<{
      Params: { id: number };
    }>,
    reply: FastifyReply
  ) {
    const tintaRepository = new TintaRepository();
    const useCase = new DeleteTintaUseCase(tintaRepository);

    const { id } = request.params;
    await useCase.execute(id);

    return reply.status(204).send();
  }

  static async getByQuery(
    request: FastifyRequest<{
      Querystring: TintaQuery;
    }>,
    reply: FastifyReply
  ) {
    const tintaRepository = new TintaRepository();
    const useCase = new GetTintasByQueryUseCase(tintaRepository);

    const { tintas } = await useCase.execute(request.query);

    return reply.status(200).send(tintas);
  }
}

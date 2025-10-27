import { CreateUsuarioUseCase } from "@/domains/usuarios/application/use-cases/create-usuario.use-case";
import { DeleteUsuarioUseCase } from "@/domains/usuarios/application/use-cases/delete-usuario.use-case";
import { GetUsuarioByIdUseCase } from "@/domains/usuarios/application/use-cases/get-usuario-by-id.use-case";
import { GetUsuarioByEmailUseCase } from "@/domains/usuarios/application/use-cases/get-usuario-by-email.use-case";
import { UpdateUsuarioUseCase } from "@/domains/usuarios/application/use-cases/update-usuario.use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { UsuarioRepository } from "../../repositories/usuario.repository";
import { BCryptJS } from "@/lib/encrypt/bcryptjs";
import { RequestUsuarioDTO, ResponseUsuarioDTO } from "../dto/usuario.dto";

export class UsuariosController {
  static async create(
    req: FastifyRequest<{
      Body: RequestUsuarioDTO;
    }>,
    reply: FastifyReply<{
      Body: ResponseUsuarioDTO;
    }>
  ) {
    const usuarioRepository = new UsuarioRepository();
    const encryptService = new BCryptJS();

    const useCase = new CreateUsuarioUseCase(usuarioRepository, encryptService);

    const tipoUsuario = req?.user?.tipoDeUsuario;

    const { usuario } = await useCase.execute(req.body, tipoUsuario);

    return reply.status(201).send(usuario);
  }

  static async delete(
    req: FastifyRequest<{
      Params: { id: number };
      Body: null;
    }>,
    reply: FastifyReply<{ Body: null }>
  ) {
    const usuarioRepository = new UsuarioRepository();
    const useCase = new DeleteUsuarioUseCase(usuarioRepository);

    await useCase.execute(req.params.id);

    return reply.status(204).send();
  }

  static async getById(
    req: FastifyRequest<{
      Params: { id: number };
    }>,
    reply: FastifyReply<{
      Body: ResponseUsuarioDTO;
    }>
  ) {
    const usuarioRepository = new UsuarioRepository();
    const useCase = new GetUsuarioByIdUseCase(usuarioRepository);

    const { usuario } = await useCase.execute(req.params.id);

    return reply.status(200).send(usuario);
  }

  static async getByEmail(
    req: FastifyRequest<{
      Params: { email: string };
      Body: null;
    }>,
    reply: FastifyReply<{
      Body: ResponseUsuarioDTO;
    }>
  ) {
    const usuarioRepository = new UsuarioRepository();
    const useCase = new GetUsuarioByEmailUseCase(usuarioRepository);

    const { usuario } = await useCase.execute(req.params.email);

    return reply.status(200).send(usuario);
  }

  static async update(
    req: FastifyRequest<{
      Params: { id: number };
      Body: RequestUsuarioDTO;
    }>,
    reply: FastifyReply<{
      Body: ResponseUsuarioDTO;
    }>
  ) {
    const usuarioRepository = new UsuarioRepository();
    const useCase = new UpdateUsuarioUseCase(usuarioRepository);

    const { usuario } = await useCase.execute(req.params.id, req.body);

    return reply.status(200).send(usuario);
  }
}

import { CreateUsuarioUseCase } from "@/domains/usuarios/application/use-cases/create-usuario.use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { UsuarioRepository } from "../../repositories/usuario.repository";
import { BCryptJS } from "@/lib/encrypt/bcryptjs";
import { RequestUsuarioDTO } from "../dto/usuario.dto";

export class UsuariosController {
  static async create(
    req: FastifyRequest<{
      Body: RequestUsuarioDTO;
    }>,
    reply: FastifyReply
  ) {
    const usuarioRepository = new UsuarioRepository();
    const encryptService = new BCryptJS();

    const useCase = new CreateUsuarioUseCase(usuarioRepository, encryptService);

    const usuario = await useCase.execute(req.body);

    return usuario;
  }
}

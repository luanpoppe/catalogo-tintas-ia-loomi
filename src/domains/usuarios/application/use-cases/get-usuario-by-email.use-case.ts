import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";
import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";

export class GetUsuarioByEmailUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(email: string) {
    const usuario = await this.usuarioRepository.findByEmail(email);

    if (!usuario) throw new RecursoNaoEncontradoException();

    return { usuario };
  }
}

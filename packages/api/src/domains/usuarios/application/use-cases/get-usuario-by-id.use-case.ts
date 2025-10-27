import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";
import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";

export class GetUsuarioByIdUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: number) {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) throw new RecursoNaoEncontradoException();

    return { usuario };
  }
}

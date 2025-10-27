import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";
import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";

export class DeleteUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: number) {
    const doesExist = await this.usuarioRepository.doesIdExist(id);
    if (!doesExist) throw new RecursoNaoEncontradoException();

    await this.usuarioRepository.delete(id);
  }
}

import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";

export class GetUsuarioByIdUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: number) {
    const usuario = await this.usuarioRepository.findById(id);

    return { usuario };
  }
}

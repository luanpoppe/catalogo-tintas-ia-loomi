import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";

export class GetUsuarioByEmailUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(email: string) {
    const usuario = await this.usuarioRepository.findByEmail(email);

    return { usuario };
  }
}

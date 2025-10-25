import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";

export class DeleteUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: number) {
    await this.usuarioRepository.delete(id);
  }
}

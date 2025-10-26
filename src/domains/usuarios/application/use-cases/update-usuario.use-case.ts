import { IUsuarioRepository } from "../../domain/repositories/usuario.repository";
import { RequestUpdateUsuarioDTO } from "../../infrastructure/http/dto/usuario.dto";

export class UpdateUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: number, body: RequestUpdateUsuarioDTO) {
    const usuario = await this.usuarioRepository.update(id, body);

    return { usuario };
  }
}

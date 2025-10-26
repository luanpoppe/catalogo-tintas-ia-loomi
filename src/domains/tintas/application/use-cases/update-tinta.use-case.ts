import { ITintaRepository } from "../../domain/repositories/tinta.repository";
import { RequestUpdateTintaDTO } from "../../infrastructure/http/dto/tinta.dto";

export class UpdateTintaUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number, body: RequestUpdateTintaDTO) {
    const tinta = await this.tintaRepository.update(id, body);

    return { tinta };
  }
}

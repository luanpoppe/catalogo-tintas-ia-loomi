import { ITintaRepository } from "../../domain/repositories/tinta.repository";
import { RequestTintaDTO } from "../../infrastructure/http/dto/tinta.dto";

export class UpdateTintaUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number, body: RequestTintaDTO) {
    const tinta = await this.tintaRepository.update(id, body);

    return { tinta };
  }
}

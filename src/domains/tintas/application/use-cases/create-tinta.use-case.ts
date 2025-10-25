import { ITintaRepository } from "../../domain/repositories/tinta.repository";
import { RequestTintaDTO } from "../../infrastructure/http/dto/tinta.dto";

export class CreateTintaUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(body: RequestTintaDTO) {
    const tinta = await this.tintaRepository.create(body);

    return { tinta };
  }
}

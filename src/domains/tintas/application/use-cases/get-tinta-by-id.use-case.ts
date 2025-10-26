import { ResourceNotFoundException } from "@/core/exceptions/resource-not-found.exception";
import { ITintaRepository } from "../../domain/repositories/tinta.repository";

export class GetTintaByIdUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number) {
    const tinta = await this.tintaRepository.findById(id);

    if (!tinta) throw new ResourceNotFoundException();

    return { tinta };
  }
}

import { ResourceNotFoundException } from "@/core/exceptions/resource-not-found.exception";
import { ITintaRepository } from "../../domain/repositories/tinta.repository";

export class DeleteTintaUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number) {
    const doesExist = await this.tintaRepository.doesIdExist(id);
    if (!doesExist) throw new ResourceNotFoundException();

    await this.tintaRepository.delete(id);
  }
}

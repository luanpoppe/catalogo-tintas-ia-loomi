import { ResourceNotFoundException } from "@/core/exceptions/resource-not-found.exception";
import { ITintaRepository } from "../../domain/repositories/tinta.repository";
import { RequestUpdateTintaDTO } from "../../infrastructure/http/dto/tinta.dto";

export class UpdateTintaUseCase {
  constructor(private tintaRepository: ITintaRepository) {}

  async execute(id: number, body: RequestUpdateTintaDTO) {
    const doesExist = await this.tintaRepository.doesIdExist(id);
    if (!doesExist) throw new ResourceNotFoundException();

    const tinta = await this.tintaRepository.update(id, body);

    return { tinta };
  }
}

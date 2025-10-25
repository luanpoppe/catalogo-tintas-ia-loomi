import { describe, it, expect, vi } from "vitest";
import { UpdateTintaUseCase } from "../update-tinta.use-case";
import { ITintaRepository } from "@/domains/tintas/domain/repositories/tinta.repository";
import { RequestTintaDTO } from "@/domains/tintas/infrastructure/http/dto/tinta.dto";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("UpdateTintaUseCase", () => {
  it("should update a tinta by id", async () => {
    const tintaId = 1;
    const updateData: RequestTintaDTO = {
      nome: "Tinta Atualizada",
      cor: "Azul",
      ambiente: "EXTERNO",
      acabamento: "FOSCO",
      features: ["Resistente à Água"],
      linhas: "STANDARD",
      tiposDeSuperfeicie: ["MADEIRA"],
    };

    const mockUpdatedTinta = {
      id: tintaId,
      ...updateData,
    };

    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.update.mockResolvedValue(mockUpdatedTinta);

    const updateTintaUseCase = new UpdateTintaUseCase(mockTintaRepository);

    const result = await updateTintaUseCase.execute(tintaId, updateData);

    expect(mockTintaRepository.update).toHaveBeenCalledWith(
      tintaId,
      updateData
    );
    expect(result).toEqual({ tinta: mockUpdatedTinta });
  });
});

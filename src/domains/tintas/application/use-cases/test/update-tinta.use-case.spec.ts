import { describe, it, expect } from "vitest";
import { UpdateTintaUseCase } from "../update-tinta.use-case";
import { RequestTintaDTO } from "@/domains/tintas/infrastructure/http/dto/tinta.dto";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";
import { ResourceNotFoundException } from "@/core/exceptions/resource-not-found.exception";

describe("UpdateTintaUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve atualizar uma tinta pelo id", async () => {
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
    mockTintaRepository.doesIdExist.mockResolvedValue(true);

    const updateTintaUseCase = new UpdateTintaUseCase(mockTintaRepository);

    const result = await updateTintaUseCase.execute(tintaId, updateData);

    expect(mockTintaRepository.update).toHaveBeenCalledWith(
      tintaId,
      updateData
    );
    expect(result).toEqual({ tinta: mockUpdatedTinta });
  });

  it("deve lançar exceção em caso de não existir tinta com o id passado", async () => {
    const updateData: RequestTintaDTO = {
      nome: "Tinta Atualizada",
      cor: "Azul",
      ambiente: "EXTERNO",
      acabamento: "FOSCO",
      features: ["Resistente à Água"],
      linhas: "STANDARD",
      tiposDeSuperfeicie: ["MADEIRA"],
    };

    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.doesIdExist.mockResolvedValue(false);

    const updateTintaUseCase = new UpdateTintaUseCase(mockTintaRepository);

    const tintaId = 999;
    const result = updateTintaUseCase.execute(tintaId, updateData);

    await expect(result).rejects.toBeInstanceOf(ResourceNotFoundException);

    expect(mockTintaRepository.doesIdExist).toHaveBeenCalledWith(tintaId);
    expect(mockTintaRepository.update).not.toHaveBeenCalled();
  });
});

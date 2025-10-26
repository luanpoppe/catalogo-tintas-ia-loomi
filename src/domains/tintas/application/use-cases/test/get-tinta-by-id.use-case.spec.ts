import { describe, it, expect } from "vitest";
import { GetTintaByIdUseCase } from "../get-tinta-by-id.use-case";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";
import { ResourceNotFoundException } from "@/core/exceptions/resource-not-found.exception";

describe("GetTintaByIdUseCase", () => {
  it("deve retornar tinta por id", async () => {
    const mockTinta = MockTintaBuilder.buildEntity();

    const mockTintaRepository = MockTintaBuilder.buildMockRepository();

    mockTintaRepository.findById.mockResolvedValue(mockTinta);

    const getTintaByIdUseCase = new GetTintaByIdUseCase(mockTintaRepository);

    const tintaId = mockTinta.id!;
    const result = await getTintaByIdUseCase.execute(tintaId);

    expect(mockTintaRepository.findById).toHaveBeenCalledWith(tintaId);
    expect(result).toEqual({ tinta: mockTinta });
  });

  it("deve lançar exceção em caso de não existir tinta com o id passado", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.findById.mockResolvedValue(null);

    const getTintaByIdUseCase = new GetTintaByIdUseCase(mockTintaRepository);

    const tintaId = 999;
    const result = getTintaByIdUseCase.execute(tintaId);

    await expect(result).rejects.toBeInstanceOf(ResourceNotFoundException);

    expect(mockTintaRepository.findById).toHaveBeenCalledWith(tintaId);
  });
});

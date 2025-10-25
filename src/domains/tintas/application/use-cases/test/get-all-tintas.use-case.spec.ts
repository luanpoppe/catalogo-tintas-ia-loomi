import { describe, it, expect } from "vitest";
import { GetAllTintasUseCase } from "../get-all-tintas.use-case";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("GetAllTintasUseCase", () => {
  it("should return all tintas", async () => {
    const mockTintas = MockTintaBuilder.buildEntities();

    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.findAll.mockResolvedValue(mockTintas);

    const getAllTintasUseCase = new GetAllTintasUseCase(mockTintaRepository);
    const result = await getAllTintasUseCase.execute();

    expect(mockTintaRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual({ tintas: mockTintas });
  });
});

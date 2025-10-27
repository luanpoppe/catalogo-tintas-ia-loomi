import { describe, it, expect } from "vitest";
import { CreateTintaUseCase } from "../create-tinta.use-case";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("CreateTintaUseCase", () => {
  it("deve criar uma nova tinta", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();

    const tintaEntity = MockTintaBuilder.buildEntity();
    mockTintaRepository.create.mockResolvedValue(tintaEntity);

    const createTintaUseCase = new CreateTintaUseCase(mockTintaRepository);

    const tintaData = MockTintaBuilder.buildRequestDTO();

    const result = await createTintaUseCase.execute(tintaData);

    expect(mockTintaRepository.create).toHaveBeenCalledWith(tintaData);
    expect(result.tinta).toEqual(tintaEntity);
  });
});

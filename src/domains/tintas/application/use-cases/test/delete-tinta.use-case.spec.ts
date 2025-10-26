import { describe, it, expect } from "vitest";
import { DeleteTintaUseCase } from "../delete-tinta.use-case";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";
import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";

describe("DeleteTintaUseCase", () => {
  it("deve deletar um tinta pelo id", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.delete.mockResolvedValue(undefined);
    mockTintaRepository.doesIdExist.mockResolvedValue(true);

    const deleteTintaUseCase = new DeleteTintaUseCase(mockTintaRepository);

    const tintaId = MockTintaBuilder.buildEntity().id!;
    await deleteTintaUseCase.execute(tintaId);

    expect(mockTintaRepository.delete).toHaveBeenCalledWith(tintaId);
  });

  it("deve lançar exceção em caso de não existir tinta com o id passado", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.doesIdExist.mockResolvedValue(false);

    const deleteTintaUseCase = new DeleteTintaUseCase(mockTintaRepository);

    const tintaId = 999;
    const result = deleteTintaUseCase.execute(tintaId);

    await expect(result).rejects.toBeInstanceOf(RecursoNaoEncontradoException);

    expect(mockTintaRepository.doesIdExist).toHaveBeenCalledWith(tintaId);
    expect(mockTintaRepository.delete).not.toHaveBeenCalled();
  });
});

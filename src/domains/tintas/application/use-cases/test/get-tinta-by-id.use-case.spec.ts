import { describe, it, expect, vi } from "vitest";
import { GetTintaByIdUseCase } from "../get-tinta-by-id.use-case";
import { ITintaRepository } from "@/domains/tintas/domain/repositories/tinta.repository";

describe("GetTintaByIdUseCase", () => {
  it("should return a tinta by id", async () => {
    const mockTinta = {
      id: 1,
      nome: "Tinta Teste 1",
      cor: "Vermelho",
      ambiente: "INTERNO",
      acabamento: "BRILHANTE",
      features: ["Secagem Rápida"],
      linhas: "PREMIUM",
      tiposDeSuperfeicie: ["ALVENARIA"],
    };

    const mockTintaRepository: ITintaRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn().mockResolvedValue(mockTinta),
      update: vi.fn(),
      delete: vi.fn(),
      getByQuery: vi.fn(),
    };

    const getTintaByIdUseCase = new GetTintaByIdUseCase(mockTintaRepository);

    const tintaId = 1;
    const result = await getTintaByIdUseCase.execute(tintaId);

    expect(mockTintaRepository.findById).toHaveBeenCalledWith(tintaId);
    expect(result).toEqual({ tinta: mockTinta });
  });
});

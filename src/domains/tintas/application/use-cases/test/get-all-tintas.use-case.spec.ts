import { describe, it, expect, vi } from "vitest";
import { GetAllTintasUseCase } from "../get-all-tintas.use-case";
import { ITintaRepository } from "@/domains/tintas/domain/repositories/tinta.repository";

describe("GetAllTintasUseCase", () => {
  it("should return all tintas", async () => {
    const mockTintas = [
      {
        id: 1,
        nome: "Tinta Teste 1",
        cor: "Vermelho",
        ambiente: "INTERNO",
        acabamento: "BRILHANTE",
        features: ["Secagem Rápida"],
        linhas: "PREMIUM",
        tiposDeSuperfeicie: ["ALVENARIA"],
      },
      {
        id: 2,
        nome: "Tinta Teste 2",
        cor: "Azul",
        ambiente: "EXTERNO",
        acabamento: "FOSCO",
        features: ["Resistente à Água"],
        linhas: "STANDARD",
        tiposDeSuperfeicie: ["MADEIRA"],
      },
    ];

    const mockTintaRepository: ITintaRepository = {
      create: vi.fn(),
      findAll: vi.fn().mockResolvedValue(mockTintas),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getByQuery: vi.fn(),
    };

    const getAllTintasUseCase = new GetAllTintasUseCase(mockTintaRepository);
    const result = await getAllTintasUseCase.execute();

    expect(mockTintaRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual({ tintas: mockTintas });
  });
});

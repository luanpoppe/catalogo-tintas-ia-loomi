import { GetTintasByQueryUseCase } from "../get-tintas-by-query.use-case";
import { TintaQuery } from "@/domains/tintas/domain/repositories/tinta.repository";
import { MockTintaBuilder } from "test/builders/mock-tinta.builder";

describe("GetTintasByQueryUseCase", () => {
  const allMockTintas = MockTintaBuilder.buildEntities();

  it("deve retornar tintas por query de cor", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    const expectedTintas = allMockTintas.filter((t) => t.cor === "Vermelho");
    mockTintaRepository.getByQuery.mockResolvedValue(expectedTintas);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = { cor: "Vermelho" };
    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: expectedTintas });
  });

  it("deve retornar tintas por query de ambiente", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    const expectedTintas = allMockTintas.filter(
      (t) => t.ambiente === "EXTERNO"
    );
    mockTintaRepository.getByQuery.mockResolvedValue(expectedTintas);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = { ambiente: "EXTERNO" };
    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: expectedTintas });
  });

  it("deve retornar tintas por query de acabamento", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    const expectedTintas = allMockTintas.filter(
      (t) => t.acabamento === "FOSCO"
    );
    mockTintaRepository.getByQuery.mockResolvedValue(expectedTintas);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = { acabamento: "FOSCO" };
    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: expectedTintas });
  });

  it("deve retornar tintas por query de linhas", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    const expectedTintas = allMockTintas.filter((t) => t.linhas === "STANDARD");
    mockTintaRepository.getByQuery.mockResolvedValue(expectedTintas);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = { linhas: "STANDARD" };
    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: expectedTintas });
  });

  it("deve retornar tintas por query de tiposDeSuperfeicie", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    const expectedTintas = allMockTintas.filter((t) =>
      t.tiposDeSuperfeicie.includes("MADEIRA")
    );
    mockTintaRepository.getByQuery.mockResolvedValue(expectedTintas);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = { tiposDeSuperfeicie: ["MADEIRA"] };
    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: expectedTintas });
  });

  it("deve retornar tintas por query combinada (cor e ambiente)", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    const expectedTintas = allMockTintas.filter(
      (t) => t.cor === "Vermelho" && t.ambiente === "INTERNO"
    );
    mockTintaRepository.getByQuery.mockResolvedValue(expectedTintas);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = { cor: "Vermelho", ambiente: "INTERNO" };
    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: expectedTintas });
  });

  it("deve retornar um array vazio se nenhuma tinta for encontrada", async () => {
    const mockTintaRepository = MockTintaBuilder.buildMockRepository();
    mockTintaRepository.getByQuery.mockResolvedValue([]);

    const getTintasByQueryUseCase = new GetTintasByQueryUseCase(
      mockTintaRepository
    );

    const query: TintaQuery = { cor: "Inexistente" };
    const result = await getTintasByQueryUseCase.execute(query);

    expect(mockTintaRepository.getByQuery).toHaveBeenCalledWith(query);
    expect(result).toEqual({ tintas: [] });
  });
});

import { Mocked } from "vitest";
import { GetUsuarioByIdUseCase } from "../get-usuario-by-id.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";
import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";

describe("GetUsuarioByIdUseCase", () => {
  let getUsuarioByIdUseCase: GetUsuarioByIdUseCase;
  let mockUsuarioRepository: Mocked<IUsuarioRepository>;

  beforeEach(() => {
    mockUsuarioRepository = MockUsuarioBuilder.buildMockRepository();
    getUsuarioByIdUseCase = new GetUsuarioByIdUseCase(mockUsuarioRepository);
  });

  it("deve retornar um usuário pelo ID", async () => {
    const usuarioEntity = MockUsuarioBuilder.buildEntity();
    const id = usuarioEntity.id!;
    const foundUsuario = usuarioEntity;

    mockUsuarioRepository.findById.mockResolvedValue(foundUsuario);

    const result = await getUsuarioByIdUseCase.execute(id);

    expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual({ usuario: foundUsuario });
  });

  it("deve lançar exceção se o usuário não for encontrado", async () => {
    const id = 999;
    mockUsuarioRepository.findById.mockResolvedValue(null);

    const result = getUsuarioByIdUseCase.execute(id);

    expect(mockUsuarioRepository.findById).toHaveBeenCalledWith(id);
    await expect(result).rejects.toBeInstanceOf(RecursoNaoEncontradoException);
  });
});

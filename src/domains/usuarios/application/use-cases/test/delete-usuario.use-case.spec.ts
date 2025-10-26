import { Mocked } from "vitest";
import { DeleteUsuarioUseCase } from "../delete-usuario.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";
import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";

describe("DeleteUsuarioUseCase", () => {
  let deleteUsuarioUseCase: DeleteUsuarioUseCase;
  let mockUsuarioRepository: Mocked<IUsuarioRepository>;

  beforeEach(() => {
    mockUsuarioRepository = MockUsuarioBuilder.buildMockRepository();
    deleteUsuarioUseCase = new DeleteUsuarioUseCase(mockUsuarioRepository);
  });

  it("deve deletar um usuário com sucesso", async () => {
    const usuarioId = MockUsuarioBuilder.buildEntity().id!;
    mockUsuarioRepository.delete.mockResolvedValue(undefined);
    mockUsuarioRepository.doesIdExist.mockResolvedValue(true);

    await deleteUsuarioUseCase.execute(usuarioId);

    expect(mockUsuarioRepository.delete).toHaveBeenCalledWith(usuarioId);
  });

  it("deve lançar exceção em caso de não existir usuário com o id passado", async () => {
    mockUsuarioRepository.doesIdExist.mockResolvedValue(false);

    deleteUsuarioUseCase = new DeleteUsuarioUseCase(mockUsuarioRepository);

    const usuarioId = 999;
    const result = deleteUsuarioUseCase.execute(usuarioId);

    await expect(result).rejects.toBeInstanceOf(RecursoNaoEncontradoException);

    expect(mockUsuarioRepository.doesIdExist).toHaveBeenCalledWith(usuarioId);
    expect(mockUsuarioRepository.delete).not.toHaveBeenCalled();
  });
});

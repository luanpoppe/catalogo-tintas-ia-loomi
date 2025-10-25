import { Mocked } from "vitest";
import { DeleteUsuarioUseCase } from "../delete-usuario.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";

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

    await deleteUsuarioUseCase.execute(usuarioId);

    expect(mockUsuarioRepository.delete).toHaveBeenCalledWith(usuarioId);
  });
});

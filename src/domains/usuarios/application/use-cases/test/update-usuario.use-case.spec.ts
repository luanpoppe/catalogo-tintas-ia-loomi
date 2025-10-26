import { Mocked } from "vitest";
import { UpdateUsuarioUseCase } from "../update-usuario.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { RequestUpdateUsuarioDTO } from "../../../infrastructure/http/dto/usuario.dto";
import { UsuarioEntity } from "../../../domain/entities/usuario.entity";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";

describe("UpdateUsuarioUseCase", () => {
  let updateUsuarioUseCase: UpdateUsuarioUseCase;
  let mockUsuarioRepository: Mocked<IUsuarioRepository>;

  beforeEach(() => {
    mockUsuarioRepository = MockUsuarioBuilder.buildMockRepository();
    updateUsuarioUseCase = new UpdateUsuarioUseCase(mockUsuarioRepository);
  });

  it("deve atualizar um usuário com sucesso", async () => {
    const usuarioEntity = MockUsuarioBuilder.buildEntity();
    const usuarioId = usuarioEntity.id!;

    const updateBody: RequestUpdateUsuarioDTO = {
      nome: "Updated Name",
      email: "updated@example.com",
      tipoUsuario: "ADMIN",
    };

    const updatedUsuario: UsuarioEntity = {
      id: usuarioId,
      ...updateBody,
    };

    mockUsuarioRepository.update.mockResolvedValue(updatedUsuario);

    const result = await updateUsuarioUseCase.execute(usuarioId, updateBody);

    expect(mockUsuarioRepository.update).toHaveBeenCalledWith(
      usuarioId,
      updateBody
    );
    expect(result).toEqual({ usuario: updatedUsuario });
  });
});

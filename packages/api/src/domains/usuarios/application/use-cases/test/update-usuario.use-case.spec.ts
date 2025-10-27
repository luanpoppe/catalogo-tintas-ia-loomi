import { Mocked } from "vitest";
import { UpdateUsuarioUseCase } from "../update-usuario.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { RequestUpdateUsuarioDTO } from "../../../infrastructure/http/dto/usuario.dto";
import { UsuarioEntity } from "../../../domain/entities/usuario.entity";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";
import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";

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
    mockUsuarioRepository.doesIdExist.mockResolvedValue(true);

    const result = await updateUsuarioUseCase.execute(usuarioId, updateBody);

    expect(mockUsuarioRepository.update).toHaveBeenCalledWith(
      usuarioId,
      updateBody
    );
    expect(result).toEqual({ usuario: updatedUsuario });
  });

  it("deve lançar exceção em caso de não existir usuário com o id passado", async () => {
    const updateBody: RequestUpdateUsuarioDTO = {
      nome: "Updated Name",
      email: "updated@example.com",
      tipoUsuario: "ADMIN",
    };

    const usuarioId = 999;
    const updatedUsuario: UsuarioEntity = {
      id: usuarioId,
      ...updateBody,
    };

    mockUsuarioRepository.doesIdExist.mockResolvedValue(false);

    const result = updateUsuarioUseCase.execute(usuarioId, updatedUsuario);

    await expect(result).rejects.toBeInstanceOf(RecursoNaoEncontradoException);

    expect(mockUsuarioRepository.doesIdExist).toHaveBeenCalledWith(usuarioId);
    expect(mockUsuarioRepository.update).not.toHaveBeenCalled();
  });
});

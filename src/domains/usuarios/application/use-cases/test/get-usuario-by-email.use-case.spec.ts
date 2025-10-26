import { Usuarios } from "@/generated/prisma/client";
import { Mocked } from "vitest";
import { GetUsuarioByEmailUseCase } from "../get-usuario-by-email.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";
import { RecursoNaoEncontradoException } from "@/core/exceptions/recurso-nao-encontrado.exception";

describe("GetUsuarioByEmailUseCase", () => {
  let getUsuarioByEmailUseCase: GetUsuarioByEmailUseCase;
  let mockUsuarioRepository: Mocked<IUsuarioRepository>;

  beforeEach(() => {
    mockUsuarioRepository = MockUsuarioBuilder.buildMockRepository();

    getUsuarioByEmailUseCase = new GetUsuarioByEmailUseCase(
      mockUsuarioRepository
    );
  });

  it("deve retornar um usuário pelo email", async () => {
    const usuarioEntity = MockUsuarioBuilder.buildEntity();
    const email = usuarioEntity.email;
    const usuarioEncontrado: Usuarios = {
      ...usuarioEntity,
      id: usuarioEntity.id!,
      passwordHash: "senhaHashed123",
    };

    mockUsuarioRepository.findByEmail.mockResolvedValue(usuarioEncontrado);

    const result = await getUsuarioByEmailUseCase.execute(email);

    expect(mockUsuarioRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual({ usuario: usuarioEncontrado });
  });

  it("deve lançar exceção se o usuário não for encontrado", async () => {
    const email = "emailNaoExistente@exemplo.com";
    mockUsuarioRepository.findByEmail.mockResolvedValue(null);

    const result = getUsuarioByEmailUseCase.execute(email);

    expect(mockUsuarioRepository.findByEmail).toHaveBeenCalledWith(email);
    await expect(result).rejects.toBeInstanceOf(RecursoNaoEncontradoException);
  });
});

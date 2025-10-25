import { Mocked } from "vitest";
import { GetUsuarioByEmailUseCase } from "../get-usuario-by-email.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";

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
    const foundUsuario = usuarioEntity;

    mockUsuarioRepository.findByEmail.mockResolvedValue(foundUsuario);

    const result = await getUsuarioByEmailUseCase.execute(email);

    expect(mockUsuarioRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual({ usuario: foundUsuario });
  });

  it("deve retornar null se o usuário não for encontrado", async () => {
    const email = "notfound@exemplo.com";
    mockUsuarioRepository.findByEmail.mockResolvedValue(null);

    const result = await getUsuarioByEmailUseCase.execute(email);

    expect(mockUsuarioRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual({ usuario: null });
  });
});

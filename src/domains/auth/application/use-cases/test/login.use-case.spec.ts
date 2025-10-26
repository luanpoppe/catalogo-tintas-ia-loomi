import { LoginUseCase } from "../login.use-case";
import { IUsuarioRepository } from "@/domains/usuarios/domain/repositories/usuario.repository";
import { IEncryptInterface } from "@/lib/encrypt/encrypt.interface";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";
import { Usuarios } from "@/generated/prisma/client"; // Importar Usuarios do Prisma Client

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let usuarioRepository: IUsuarioRepository;
  let encryptService: IEncryptInterface;
  let mockUsuarioBuilder: MockUsuarioBuilder;

  beforeEach(() => {
    usuarioRepository = MockUsuarioBuilder.buildMockRepository();
    encryptService = {
      hash: vi.fn(),
      verify: vi.fn(),
    };
    loginUseCase = new LoginUseCase(usuarioRepository, encryptService);
    mockUsuarioBuilder = new MockUsuarioBuilder();
  });

  it("deve conseguir loghar com credenciais corretas", async () => {
    const usuarioEntity = MockUsuarioBuilder.buildEntity();
    const user: Usuarios = {
      ...usuarioEntity,
      id: usuarioEntity.id!,
      passwordHash: "senhaHashed123",
    };
    vi.spyOn(usuarioRepository, "findByEmail").mockResolvedValue(user);
    vi.spyOn(encryptService, "verify").mockResolvedValue(true);

    const { usuario: loggedUser } = await loginUseCase.execute({
      email: user.email,
      senha: "senhaQualquer123",
    });

    expect(loggedUser).toEqual(user);
    expect(usuarioRepository.findByEmail).toHaveBeenCalledWith(user.email);
    expect(encryptService.verify).toHaveBeenCalledWith(
      "senhaQualquer123",
      user.passwordHash
    );
  });

  it("não deve ser capaz de realizar o login com um email não cadastrado", async () => {
    vi.spyOn(usuarioRepository, "findByEmail").mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: "email-nao-cadastrado@example.com",
        senha: "senhaQualquer123",
      })
    ).rejects.toThrow("Email e/ou senha incorretos.");
    expect(usuarioRepository.findByEmail).toHaveBeenCalledWith(
      "email-nao-cadastrado@example.com"
    );
    expect(encryptService.verify).not.toHaveBeenCalled();
  });

  it("não deve ser capaz de realizar o login com uma senha incorreta", async () => {
    const usuarioEntity = MockUsuarioBuilder.buildEntity();
    const user: Usuarios = {
      ...usuarioEntity,
      id: usuarioEntity.id!,
      passwordHash: "senhaHashed123",
    };
    vi.spyOn(usuarioRepository, "findByEmail").mockResolvedValue(user);
    vi.spyOn(encryptService, "verify").mockResolvedValue(false);

    await expect(
      loginUseCase.execute({
        email: user.email,
        senha: "senhaIncorreta",
      })
    ).rejects.toThrow("Email e/ou senha incorretos.");
    expect(usuarioRepository.findByEmail).toHaveBeenCalledWith(user.email);
    expect(encryptService.verify).toHaveBeenCalledWith(
      "senhaIncorreta",
      user.passwordHash
    );
  });
});

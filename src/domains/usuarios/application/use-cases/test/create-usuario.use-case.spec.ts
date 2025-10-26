import { Mocked } from "vitest";
import { CreateUsuarioUseCase } from "../create-usuario.use-case";
import { IUsuarioRepository } from "../../../domain/repositories/usuario.repository";
import { IEncryptInterface } from "@/lib/encrypt/encrypt.interface";
import { RequestUsuarioDTO } from "../../../infrastructure/http/dto/usuario.dto";
import { UsuarioEntity } from "../../../domain/entities/usuario.entity";
import { MockUsuarioBuilder } from "test/builders/mock-usuario.builder";

describe("CreateUsuarioUseCase", () => {
  let createUsuarioUseCase: CreateUsuarioUseCase;
  let mockUsuarioRepository: Mocked<IUsuarioRepository>;
  let mockEncrypt: Mocked<IEncryptInterface>;

  beforeEach(() => {
    mockUsuarioRepository = MockUsuarioBuilder.buildMockRepository();
    mockEncrypt = MockUsuarioBuilder.buildMockEncrypt();

    createUsuarioUseCase = new CreateUsuarioUseCase(
      mockUsuarioRepository,
      mockEncrypt
    );
  });

  it("deve criar um usuário com a senha hashed", async () => {
    const requestBody: RequestUsuarioDTO = MockUsuarioBuilder.buildRequestDTO();
    const hashedPassword = "SenhaHashed123";

    const createdUsuario: UsuarioEntity = MockUsuarioBuilder.buildEntity();

    mockEncrypt.hash.mockResolvedValue(hashedPassword);
    mockUsuarioRepository.create.mockResolvedValue(createdUsuario);

    const result = await createUsuarioUseCase.execute(requestBody);

    expect(mockEncrypt.hash).toHaveBeenCalledWith(requestBody.senha);
    expect(mockUsuarioRepository.create).toHaveBeenCalledWith({
      ...requestBody,
      senha: hashedPassword,
    });
    expect(result).toEqual({ usuario: createdUsuario });
  });
});

import { UsuarioEntity } from "@/domains/usuarios/domain/entities/usuario.entity";
import { IUsuarioRepository } from "@/domains/usuarios/domain/repositories/usuario.repository";
import { RequestUsuarioDTO } from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";
import { Mocked } from "vitest";

export class MockUsuarioBuilder {
  static buildEntity() {
    const usuarioEntity: UsuarioEntity = {
      id: 1,
      nome: "Usuário de teste",
      email: "teste@exemplo.com",
      tipoUsuario: "COMUM",
    };

    return usuarioEntity;
  }

  static buildRequestDTO(): Mocked<RequestUsuarioDTO> {
    return {
      nome: "Usuário de teste",
      email: "teste@exemplo.com",
      senha: "Senha123",
      tipoUsuario: "COMUM",
    };
  }

  static buildMockRepository(): Mocked<IUsuarioRepository> {
    return {
      create: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
      doesIdExist: vi.fn(),
    };
  }

  static buildMockEncrypt() {
    return {
      hash: vi.fn(),
      verify: vi.fn(),
    };
  }
}

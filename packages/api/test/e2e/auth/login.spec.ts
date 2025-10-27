import request from "supertest";
import { app } from "@/app";
import {
  RequestUsuarioDTO,
  ResponseUsuarioDTO,
} from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import {
  RequestLoginDTO,
  ResponseLoginDTO,
} from "@/domains/auth/infrastructure/http/dto/login.dto";

describe("Criar usuário", () => {
  let usuario: ResponseUsuarioDTO;
  let senha: string;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const res = await UsuariosBuilder.criarUsuarioComum();
    usuario = res.usuario;
    senha = res.senha;
  });

  it("deve ser possível fazer login com um usuário", async () => {
    const requestBody: RequestLoginDTO = {
      email: usuario.email,
      senha: senha,
    };

    const { body, statusCode } = await request(app.server)
      .post("/auth/login")
      .send(requestBody);

    const resposta: ResponseLoginDTO = body;

    expect(statusCode).toEqual(200);
    expect(resposta).toEqual({
      accessToken: expect.any(String),
    });
  });
});

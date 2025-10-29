import request from "supertest";
import { app } from "@/app";
import { RequestUsuarioDTO } from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";

describe("Criar usuário", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve ser possível criar um usuário comum", async () => {
    const email = "abc@gmail.com";
    const nome = "abc";
    const senha = "Senha123abc";
    const tipoUsuario = "COMUM";

    const body: RequestUsuarioDTO = {
      nome,
      email,
      senha,
      tipoUsuario,
    };

    const resposta = await request(app.server).post("/usuario").send(body);

    expect(resposta.statusCode).toEqual(201);
    expect(resposta.body).toEqual({
      usuario: expect.objectContaining({
        id: expect.any(Number),
        email,
        nome,
        tipoUsuario,
      }),
      accessToken: expect.any(String),
    });

    expect(resposta.body.passwordHash).toBeUndefined();
    expect(resposta.body.senha).toBeUndefined();
  });

  it("não deve ser possível criar um usuário administrador sem ser um usuário administrador", async () => {
    const email = "abcAdmin@gmail.com";
    const nome = "abc";
    const senha = "Senha123abc";
    const tipoUsuario = "ADMIN";

    const body: RequestUsuarioDTO = {
      nome,
      email,
      senha,
      tipoUsuario,
    };

    const resposta = await request(app.server).post("/usuario").send(body);

    expect(resposta.statusCode).toEqual(403);
    expect(resposta.body).toEqual({ error: expect.any(String) });
  });

  it("deve ser possível um usuário administrador criar outro usuário administrador", async () => {
    const email = "abcAdmin123@gmail.com";
    const nome = "abc";
    const senha = "Senha123abc";
    const tipoUsuario = "ADMIN";

    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const body: RequestUsuarioDTO = {
      nome,
      email,
      senha,
      tipoUsuario,
    };

    const resposta = await request(app.server)
      .post("/usuario")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);

    expect(resposta.statusCode).toEqual(403);
    expect(resposta.body).toEqual({ error: expect.any(String) });
  });
});

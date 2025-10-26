import request from "supertest";
import { app } from "@/app";
import { RequestUsuarioDTO } from "@/domains/usuarios/infrastructure/http/dto/usuario.dto";

describe("Criar usuário", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("deve ser possível criar um usuário", async () => {
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
    expect(resposta.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email,
        nome,
        tipoUsuario,
      })
    );

    expect(resposta.body.passwordHash).toBeUndefined();
    expect(resposta.body.senha).toBeUndefined();
  });
});

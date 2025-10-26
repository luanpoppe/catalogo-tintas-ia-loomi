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

    const body: RequestUsuarioDTO = {
      nome: "abc",
      email: email,
      senha: "Senha123abc",
      tipoUsuario: "COMUM",
    };

    const resposta = await request(app.server).post("/usuario").send(body);

    resposta.body;

    expect(resposta.statusCode).toEqual(201);
    expect(resposta.body).toEqual(
      expect.objectContaining({
        email,
      })
    );

    console.log({ resposta: resposta.body });

    expect(resposta.body.passwordHash).toBeUndefined();
  });
});

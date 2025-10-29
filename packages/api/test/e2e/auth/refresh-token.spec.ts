import request from "supertest";
import { app } from "@/app";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { ResponseLoginDTO } from "@/domains/auth/infrastructure/http/dto/login.dto";

describe("Criar usuário", () => {
  let usuarioPromise: ReturnType<typeof UsuariosBuilder.criarUsuarioComum>;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    usuarioPromise = UsuariosBuilder.criarUsuarioComum();
  });

  it("deve ser possível fazer login com um usuário", async () => {
    const { accessToken, cookies } = await usuarioPromise;

    const resposta = await request(app.server)
      .post("/auth/refresh")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Cookie", cookies)
      .send();

    const respostaTipada: ResponseLoginDTO = resposta.body;

    expect(resposta.statusCode).toEqual(200);
    expect(respostaTipada).toEqual({
      accessToken: expect.any(String),
    });
    expect(resposta.get("Set-Cookie")).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")])
    );
  });
});

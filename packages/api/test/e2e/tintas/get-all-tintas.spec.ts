import request from "supertest";
import { app } from "@/app";
import { TintasBuilder } from "../@e2e-builders/tintas.builder";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { prisma } from "@/lib/prisma";

describe("Listar todas as tintas", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usuário administrador deve poder listar todas as tintas", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const tinta1 = await TintasBuilder.criarTinta({ accessToken, cookies });
    const tinta2 = await TintasBuilder.criarTinta({ accessToken, cookies });

    const resposta = await request(app.server)
      .get("/tinta")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(resposta.statusCode).toEqual(200);
    expect(resposta.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tinta1.id,
          ...tinta1.tinta,
        }),
        expect.objectContaining({
          id: tinta2.id,
          ...tinta2.tinta,
        }),
      ])
    );
  });

  it("usuário comum deve poder listar todas as tintas", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioComum();

    const resposta = await request(app.server)
      .get("/tinta")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(resposta.statusCode).toEqual(200);
    expect(resposta.body).toEqual(expect.any(Array));
  });
});

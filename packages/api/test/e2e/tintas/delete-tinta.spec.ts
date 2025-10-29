import request from "supertest";
import { app } from "@/app";
import { TintasBuilder } from "../@e2e-builders/tintas.builder";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { prisma } from "@/lib/prisma";

describe("Deletar tinta", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it("usuário administrador deve poder deletar uma tinta", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const novaTinta = await TintasBuilder.criarTinta({ accessToken, cookies });
    const tintaId = novaTinta.id;

    const deletarResposta = await request(app.server)
      .delete(`/tinta/${tintaId}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deletarResposta.statusCode).toEqual(204); // No Content
  });

  it("usuário comum não deve poder deletar uma tinta", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const novaTinta = await TintasBuilder.criarTinta({ accessToken, cookies });
    const tintaId = novaTinta.id;

    const { accessToken: accessTokenComum, cookies: cookiesComum } =
      await UsuariosBuilder.criarUsuarioComum();

    const deletarResposta = await request(app.server)
      .delete(`/tinta/${tintaId}`)
      .set("Cookie", cookiesComum)
      .set("Authorization", `Bearer ${accessTokenComum}`);

    expect(deletarResposta.statusCode).toEqual(403);
    expect(deletarResposta.body).toEqual({ error: expect.any(String) });
  });

  it("deve retornar 404 se a tinta a ser deletada não for encontrada", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    await TintasBuilder.criarTinta({ accessToken, cookies });

    const tintaIdInexistente: number = 9999;

    const deletarResposta = await request(app.server)
      .delete(`/tinta/${tintaIdInexistente}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deletarResposta.statusCode).toEqual(404);
    expect(deletarResposta.body).toEqual({ error: expect.any(String) });
  });
}, 20000);

import request from "supertest";
import { app } from "@/app";
import { TintasBuilder } from "../@e2e-builders/tintas.builder";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { prisma } from "@/lib/prisma";

describe("Atualizar tinta", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  let tintaId: number;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { tintaRequestBody } = TintasBuilder.gerarTintaRequestBody();
    const novaTinta = await prisma.tintas.create({
      data: {
        nome: tintaRequestBody.nome,
        cor: tintaRequestBody.cor,
        ambiente: tintaRequestBody.ambiente,
        acabamento: tintaRequestBody.acabamento,
        features: tintaRequestBody.features,
        linhas: tintaRequestBody.linhas,
        tiposDeSuperfeicie: tintaRequestBody.tiposDeSuperfeicie,
      },
    });
    tintaId = novaTinta.id;
  });

  it("usuário administrador deve poder atualizar uma tinta", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const { tintaRequestBody: updatedTintaRequestBody } =
      TintasBuilder.gerarTintaRequestBody();

    const atualizarResposta = await request(app.server)
      .patch(`/tinta/${tintaId}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedTintaRequestBody);

    expect(atualizarResposta.statusCode).toEqual(200);
    expect(atualizarResposta.body).toEqual(
      expect.objectContaining({
        id: tintaId,
        ...updatedTintaRequestBody,
      })
    );
  });

  it("usuário comum não deve poder atualizar uma tinta", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin(); // Criar admin para criar a tinta
    const novaTinta = await TintasBuilder.criarTinta({ accessToken, cookies });
    const tintaIdParaAtualizar = novaTinta.id;

    const { accessToken: accessTokenComum, cookies: cookiesComum } =
      await UsuariosBuilder.criarELogarUsuarioComum();

    const { tintaRequestBody: updatedTintaRequestBody } =
      TintasBuilder.gerarTintaRequestBody();

    const atualizarResposta = await request(app.server)
      .patch(`/tinta/${tintaIdParaAtualizar}`)
      .set("Cookie", cookiesComum)
      .set("Authorization", `Bearer ${accessTokenComum}`)
      .send(updatedTintaRequestBody);

    expect(atualizarResposta.statusCode).toEqual(403);
    expect(atualizarResposta.body).toEqual({ error: expect.any(String) });
  });

  it("deve retornar 404 se a tinta a ser atualizada não for encontrada", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const tintaIdInexistente: number = 9999;

    const { tintaRequestBody: updatedTintaRequestBody } =
      TintasBuilder.gerarTintaRequestBody();

    const atualizarResposta = await request(app.server)
      .patch(`/tinta/${tintaIdInexistente}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedTintaRequestBody);

    expect(atualizarResposta.statusCode).toEqual(404);
    expect(atualizarResposta.body).toEqual({ error: expect.any(String) });
  });
});

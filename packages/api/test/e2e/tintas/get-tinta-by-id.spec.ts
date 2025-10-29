import request from "supertest";
import { app } from "@/app";
import { TintasBuilder } from "../@e2e-builders/tintas.builder";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { prisma } from "@/lib/prisma";

describe("Buscar tinta por ID", () => {
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

  it("usuário administrador deve poder buscar uma tinta por ID", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const buscarResposta = await request(app.server)
      .get(`/tinta/${tintaId}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(buscarResposta.statusCode).toEqual(200);
    expect(buscarResposta.body).toEqual(
      expect.objectContaining({
        id: tintaId,
        ...TintasBuilder.gerarTintaRequestBody().tintaRequestBody,
      })
    );
  });

  it("usuário comum deve poder buscar uma tinta por ID", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin(); // Criar admin para criar a tinta
    const novaTinta = await TintasBuilder.criarTinta({ accessToken, cookies });
    const tintaIdParaBuscar = novaTinta.id;

    const { accessToken: accessTokenComum, cookies: cookiesComum } =
      await UsuariosBuilder.criarELogarUsuarioComum();

    const buscarResposta = await request(app.server)
      .get(`/tinta/${tintaIdParaBuscar}`)
      .set("Cookie", cookiesComum)
      .set("Authorization", `Bearer ${accessTokenComum}`)
      .send();

    expect(buscarResposta.statusCode).toEqual(200);
    expect(buscarResposta.body).toEqual(expect.any(Object));
  });

  it("deve retornar 404 se a tinta não for encontrada", async () => {
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const tintaIdInexistente: number = 9999;

    const buscarResposta = await request(app.server)
      .get(`/tinta/${tintaIdInexistente}`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(buscarResposta.statusCode).toEqual(404);
    expect(buscarResposta.body).toEqual({ error: expect.any(String) });
  });
});

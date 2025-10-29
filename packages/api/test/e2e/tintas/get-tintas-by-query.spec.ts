import request from "supertest";
import { app } from "@/app";
import { TintasBuilder } from "../@e2e-builders/tintas.builder";
import { UsuariosBuilder } from "../@e2e-builders/usuarios.builder";
import { prisma } from "@/lib/prisma";

describe("Buscar tintas por query", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  let tinta1Id: number;
  let tinta2Id: number;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { accessToken, cookies } =
      await UsuariosBuilder.criarELogarUsuarioAdmin();

    const tinta1RequestBody = {
      acabamento: "FOSCO",
      ambiente: "INTERNO",
      cor: "Branco",
      features: ["lavável"], // Manter como array para criação, mas a query será string
      linhas: "STANDARD",
      nome: "Tinta Branca Fosca",
      tiposDeSuperfeicie: ["ALVENARIA"],
    };

    const tinta2RequestBody = {
      acabamento: "BRILHANTE",
      ambiente: "EXTERNO",
      cor: "Vermelho",
      features: ["impermeável"], // Manter como array para criação, mas a query será string
      linhas: "PREMIUM",
      nome: "Tinta Vermelha Brilhante",
      tiposDeSuperfeicie: ["FERRO"],
    };

    const novaTinta1 = await request(app.server)
      .post("/tinta")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(tinta1RequestBody);
    tinta1Id = novaTinta1.body.id;

    const novaTinta2 = await request(app.server)
      .post("/tinta")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(tinta2RequestBody);
    tinta2Id = novaTinta2.body.id;
  });

  it("usuário comum deve poder buscar tintas por cor", async () => {
    const { accessToken, cookies } = await UsuariosBuilder.criarUsuarioComum();

    const resposta = await request(app.server)
      .get("/tinta/search?cor=Branco")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(resposta.statusCode).toEqual(200);
    expect(resposta.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tinta1Id,
          cor: "Branco",
        }),
      ])
    );
    expect(resposta.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tinta2Id,
        }),
      ])
    );
  });

  it("usuário comum deve poder buscar tintas por feature", async () => {
    const { accessToken, cookies } = await UsuariosBuilder.criarUsuarioComum();

    const resposta = await request(app.server)
      .get("/tinta/search?features=lavável") // Envia como string
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(resposta.statusCode).toEqual(200);
    expect(resposta.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tinta1Id,
          features: expect.arrayContaining(["lavável"]),
        }),
      ])
    );
    expect(resposta.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tinta2Id,
        }),
      ])
    );
  });

  it("usuário comum deve poder buscar tintas por múltiplos critérios", async () => {
    const { accessToken, cookies } = await UsuariosBuilder.criarUsuarioComum();

    const resposta = await request(app.server)
      .get("/tinta/search?cor=Branco&ambiente=INTERNO&features=lavável")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(resposta.statusCode).toEqual(200);
    expect(resposta.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tinta1Id,
          cor: "Branco",
          ambiente: "INTERNO",
        }),
      ])
    );
    expect(resposta.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: tinta2Id,
        }),
      ])
    );
  });

  it("deve retornar um array vazio se nenhuma tinta for encontrada", async () => {
    const { accessToken, cookies } = await UsuariosBuilder.criarUsuarioComum();

    const resposta = await request(app.server)
      .get("/tinta/search?cor=Inexistente")
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(resposta.statusCode).toEqual(200);
    expect(resposta.body).toEqual([]);
  });
});

import { app } from "@/app";
import { RequestTintaDTO } from "@/domains/tintas/infrastructure/http/dto/tinta.dto";
import request from "supertest";

export class TintasBuilder {
  static gerarTintaRequestBody() {
    const tintaRequestBody: RequestTintaDTO = {
      acabamento: "ACETINADO",
      ambiente: "EXTERNO",
      cor: "Azul",
      features: ["feature 1", "feature 2"],
      linhas: "PREMIUM",
      nome: "Tinta abc",
      tiposDeSuperfeicie: ["ALVENARIA", "FERRO"],
    };

    return { tintaRequestBody };
  }

  static async criarTinta({
    accessToken,
    cookies,
  }: {
    accessToken: string;
    cookies: string[];
  }) {
    const { tintaRequestBody } = this.gerarTintaRequestBody();

    const resposta = await request(app.server)
      .post(`/tinta/`)
      .set("Cookie", cookies)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(tintaRequestBody);

    return {
      tinta: tintaRequestBody,
      id: resposta.body.id,
    };
  }
}

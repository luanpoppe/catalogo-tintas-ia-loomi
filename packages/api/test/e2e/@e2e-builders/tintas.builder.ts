import { RequestTintaDTO } from "@/domains/tintas/infrastructure/http/dto/tinta.dto";

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
}

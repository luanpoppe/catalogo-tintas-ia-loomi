import { hash, compare } from "bcryptjs";
import { IEncryptInterface } from "./encrypt.interface";

export class BCryptJS implements IEncryptInterface {
  async hash(senha: string) {
    const senhaHasehd = await hash(senha, 6);
    return senhaHasehd;
  }

  async verify(senha: string, hash: string) {
    const isSenhaCorreta = await compare(senha, hash);

    return isSenhaCorreta;
  }
}

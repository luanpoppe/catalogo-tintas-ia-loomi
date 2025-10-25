export interface IEncryptInterface {
  hash(senha: string): Promise<string>;

  verify(senha: string, hash: string): Promise<boolean>;
}

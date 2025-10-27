import { Mock } from "vitest";
import { BCryptJS } from "../bcryptjs";
import { hash, compare } from "bcryptjs";

vi.mock("bcryptjs", () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe("BCryptJS", () => {
  let bcryptService: BCryptJS;

  let hashMocked = hash as Mock;
  let compareMocked = compare as Mock;

  beforeEach(() => {
    bcryptService = new BCryptJS();
    vi.clearAllMocks();
  });

  it("deve hashear a senha corretamente", async () => {
    const senha = "minhaSenhaSecreta";
    const hashedPassword = "hashedPassword123";

    hashMocked.mockResolvedValue(hashedPassword);

    const result = await bcryptService.hash(senha);

    expect(hash).toHaveBeenCalledWith(senha, 6);
    expect(result).toBe(hashedPassword);
  });

  it("deve verificar a senha corretamente", async () => {
    const senha = "minhaSenhaSecreta";
    const hashedPassword = "hashedPassword123";

    compareMocked.mockResolvedValue(true);

    const result = await bcryptService.verify(senha, hashedPassword);

    expect(compare).toHaveBeenCalledWith(senha, hashedPassword);
    expect(result).toBe(true);
  });

  it("deve retornar false para senha incorreta", async () => {
    const senha = "senhaIncorreta";
    const hashedPassword = "hashedPassword123";

    compareMocked.mockResolvedValue(false);

    const result = await bcryptService.verify(senha, hashedPassword);

    expect(compare).toHaveBeenCalledWith(senha, hashedPassword);
    expect(result).toBe(false);
  });
});

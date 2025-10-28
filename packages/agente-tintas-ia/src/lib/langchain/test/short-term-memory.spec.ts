import { ShortTermMemory } from "../short-term-memory";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { env } from "../../../env";
import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";

const mockSetup = vi.fn();
const mockPostgresSaverInstance = {
  setup: mockSetup,
};

vi.mock("@langchain/langgraph-checkpoint-postgres", () => ({
  PostgresSaver: {
    fromConnString: vi.fn(() => mockPostgresSaverInstance),
  },
}));

vi.mock("../../../env", () => ({
  env: {
    DATABASE_URL: "mock-database-url",
  },
}));

describe("ShortTermMemory", () => {
  let mockPostgresSaver: Mocked<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    (PostgresSaver.fromConnString as Mocked<any>).mockClear();
    mockSetup.mockClear();
    (PostgresSaver.fromConnString as Mocked<any>).mockReturnValue(
      mockPostgresSaverInstance
    );
    mockPostgresSaver = mockPostgresSaverInstance as Mocked<any>;
  });

  it("deve inicializar o checkpointer com a URL do banco de dados e esquema corretos", async () => {
    await ShortTermMemory.checkpointer();

    expect(PostgresSaver.fromConnString).toHaveBeenCalledWith(
      env.DATABASE_URL,
      { schema: "langgrapgh" }
    );
  });

  it("deve chamar setup no checkpointer", async () => {
    await ShortTermMemory.checkpointer();

    expect(mockPostgresSaver.setup).toHaveBeenCalled();
  });

  it("deve retornar a instância do checkpointer", async () => {
    const checkpointer = await ShortTermMemory.checkpointer();

    expect(checkpointer).toBe(mockPostgresSaver);
  });
});

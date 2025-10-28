import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";
import { AgenteTintaIA } from "../main";
import { Langchain } from "../lib/langchain/langchain";
import { BuscarTintaTool } from "../lib/langchain/tools/buscar-tinta.tool";
import { ShortTermMemory } from "../lib/langchain/short-term-memory";
import { createAgent } from "langchain";

vi.mock("../lib/langchain/langchain", () => ({
  Langchain: {
    models: {
      openAI: vi.fn(),
    },
  },
}));

vi.mock("../lib/langchain/tools/buscar-tinta.tool", () => {
  const mockInstance = {
    name: "buscar_tinta",
    description: "Ferramenta para buscar tintas",
    schema: {},
    _call: vi.fn(),
  };
  return {
    BuscarTintaTool: vi.fn(() => mockInstance),
  };
});

vi.mock("../lib/langchain/short-term-memory", () => ({
  ShortTermMemory: {
    checkpointer: vi.fn(),
  },
}));

vi.mock("langchain", () => ({
  createAgent: vi.fn(() => ({
    invoke: vi.fn(),
  })),
}));

describe("AgenteTintaIA", () => {
  let agenteTintaIA: AgenteTintaIA;
  let mockOpenAIModel: Mocked<any>;
  let mockBuscarTintaTool: Mocked<BuscarTintaTool>;
  let mockCheckpointer: Mocked<any>;
  let mockCreateAgent: Mocked<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    agenteTintaIA = new AgenteTintaIA();

    mockCreateAgent = createAgent as Mocked<any>;

    mockOpenAIModel = { invoke: vi.fn() } as Mocked<any>;
    (Langchain.models.openAI as Mocked<any>).mockReturnValue(mockOpenAIModel);
    mockOpenAIModel.invoke.mockResolvedValue({
      messages: [{ content: "Resposta do modelo" }],
    });

    mockBuscarTintaTool = new BuscarTintaTool() as Mocked<BuscarTintaTool>;

    mockCheckpointer = {
      deleteThread: vi.fn(),
    };
    (ShortTermMemory.checkpointer as Mocked<any>).mockResolvedValue(
      mockCheckpointer
    );

    mockCreateAgent.mockReturnValue({
      invoke: vi.fn().mockResolvedValue({
        messages: [{ content: "Resposta do agente" }],
      }),
    });
  });

  it("deve retornar a resposta do agente de IA", async () => {
    const input = "Qual tinta devo usar?";
    const threadId = "user-123";
    const shouldEraseMemory = false;

    const result = await agenteTintaIA.handle(
      input,
      threadId,
      shouldEraseMemory
    );

    expect(Langchain.models.openAI).toHaveBeenCalled();
    expect(BuscarTintaTool).toHaveBeenCalled();
    expect(ShortTermMemory.checkpointer).toHaveBeenCalled();
    expect(createAgent).toHaveBeenCalledWith({
      model: mockOpenAIModel,
      tools: [mockBuscarTintaTool],
      checkpointer: mockCheckpointer,
    });
    expect(mockCheckpointer.deleteThread).not.toHaveBeenCalled();
    expect(mockCreateAgent().invoke).toHaveBeenCalledWith(
      { messages: [{ role: "user", content: input }] },
      { configurable: { thread_id: threadId } }
    );
    expect(result).toBe("Resposta do agente");
  });

  it("deve apagar a memória se shouldEraseMemory for verdadeiro", async () => {
    const input = "Qual tinta devo usar?";
    const threadId = "user-123";
    const shouldEraseMemory = true;

    await agenteTintaIA.handle(input, threadId, shouldEraseMemory);

    expect(mockCheckpointer.deleteThread).toHaveBeenCalledWith(threadId);
  });

  it("não deve apagar a memória se shouldEraseMemory for falso", async () => {
    const input = "Qual tinta devo usar?";
    const threadId = "user-123";
    const shouldEraseMemory = false;

    await agenteTintaIA.handle(input, threadId, shouldEraseMemory);

    expect(mockCheckpointer.deleteThread).not.toHaveBeenCalled();
  });

  it("deve lançar um erro se o agente de IA falhar", async () => {
    const input = "Mensagem que causa erro";
    const threadId = "user-123";
    const shouldEraseMemory = false;

    mockCreateAgent().invoke.mockRejectedValue(new Error("Erro interno da IA"));

    await expect(
      agenteTintaIA.handle(input, threadId, shouldEraseMemory)
    ).rejects.toThrow("Falha ao processar a requisição da IA.");
  });

  it("deve logar o erro se o agente de IA falhar", async () => {
    const input = "Mensagem que causa erro";
    const threadId = "user-123";
    const shouldEraseMemory = false;
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockCreateAgent().invoke.mockRejectedValue(new Error("Erro interno da IA"));

    await expect(
      agenteTintaIA.handle(input, threadId, shouldEraseMemory)
    ).rejects.toThrow();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Erro ao executar o agente de IA:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });
});

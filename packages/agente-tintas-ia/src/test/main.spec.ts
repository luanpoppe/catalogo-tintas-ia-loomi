import { vi, describe, it, expect, beforeEach, Mocked } from "vitest";
import { AgenteTintaIA } from "../main";
import { Langchain } from "../lib/langchain/langchain";
import { BuscarTintaTool } from "../lib/langchain/tools/buscar-tinta.tool";
import { ShortTermMemory } from "../lib/langchain/short-term-memory";
import { ListarTodasTintasTool } from "../lib/langchain/tools/listar-todas-tintas.tool";
import { BuscarTintasPorQueryTool } from "../lib/langchain/tools/buscar-tintas-por-query.tool";
import { BuscarInternetTool } from "../lib/langchain/tools/buscar-internet.tool";
import { GerarImagemTintaTool } from "../lib/langchain/tools/gerar-imagem-tinta.tool";

vi.mock("../lib/langchain/langchain", () => ({
  Langchain: {
    models: {
      gemini: vi.fn(),
    },
  },
}));

vi.mock("../lib/langchain/tools/buscar-tinta.tool", () => ({
  BuscarTintaTool: {
    tool: vi.fn(() => ({
      name: "buscar_tintas_suvinil",
      description: "Ferramenta para buscar tintas",
      schema: {},
      _call: vi.fn(),
    })),
  },
}));

vi.mock("../lib/langchain/tools/listar-todas-tintas.tool", () => ({
  ListarTodasTintasTool: {
    tool: vi.fn(() => ({
      name: "listar_todas_tintas",
      description: "Ferramenta para listar todas as tintas",
      schema: {},
      _call: vi.fn(),
    })),
  },
}));

vi.mock("../lib/langchain/tools/buscar-tintas-por-query.tool", () => ({
  BuscarTintasPorQueryTool: {
    tool: vi.fn(() => ({
      name: "buscar_tintas_por_query",
      description: "Ferramenta para buscar tintas por query",
      schema: {},
      _call: vi.fn(),
    })),
  },
}));

vi.mock("../lib/langchain/tools/buscar-internet.tool", () => ({
  BuscarInternetTool: {
    tool: vi.fn(() => ({
      name: "buscar_internet",
      description: "Ferramenta para buscar na internet",
      schema: {},
      _call: vi.fn(),
    })),
  },
}));

vi.mock("../lib/langchain/tools/gerar-imagem-tinta.tool", () => ({
  GerarImagemTintaTool: {
    tool: vi.fn(() => ({
      name: "gerar_imagem_tinta",
      description: "Ferramenta para gerar imagem de tinta",
      schema: {},
      _call: vi.fn(),
    })),
  },
}));

vi.mock("../lib/langchain/short-term-memory", () => ({
  ShortTermMemory: {
    checkpointer: vi.fn(),
  },
}));

const mockAgentInvoke = vi.fn();
vi.mock("langchain", () => ({
  createAgent: vi.fn(() => ({
    invoke: mockAgentInvoke,
  })),
}));

describe("AgenteTintaIA", () => {
  let agenteTintaIA: AgenteTintaIA;
  let mockGeminiModel: Mocked<any>;
  let mockBuscarTintaToolInstance: Mocked<any>;
  let mockListarTodasTintasToolInstance: Mocked<any>;
  let mockBuscarTintasPorQueryToolInstance: Mocked<any>;
  let mockBuscarInternetToolInstance: Mocked<any>;
  let mockGerarImagemTintaToolInstance: Mocked<any>;
  let mockCheckpointer: Mocked<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    agenteTintaIA = new AgenteTintaIA();

    mockGeminiModel = { invoke: vi.fn() } as Mocked<any>;
    (Langchain.models.gemini as Mocked<any>).mockReturnValue(mockGeminiModel);
    mockGeminiModel.invoke.mockResolvedValue({
      messages: [{ content: "Resposta do modelo" }],
    });

    mockBuscarTintaToolInstance = {
      name: "buscar_tintas_suvinil",
      description: "Ferramenta para buscar tintas",
      schema: {},
      _call: vi.fn(),
    };
    (BuscarTintaTool.tool as Mocked<any>).mockReturnValue(
      mockBuscarTintaToolInstance
    );

    mockListarTodasTintasToolInstance = {
      name: "listar_todas_tintas",
      description: "Ferramenta para listar todas as tintas",
      schema: {},
      _call: vi.fn(),
    };
    (ListarTodasTintasTool.tool as Mocked<any>).mockReturnValue(
      mockListarTodasTintasToolInstance
    );

    mockBuscarTintasPorQueryToolInstance = {
      name: "buscar_tintas_por_query",
      description: "Ferramenta para buscar tintas por query",
      schema: {},
      _call: vi.fn(),
    };
    (BuscarTintasPorQueryTool.tool as Mocked<any>).mockReturnValue(
      mockBuscarTintasPorQueryToolInstance
    );

    mockBuscarInternetToolInstance = {
      name: "buscar_internet",
      description: "Ferramenta para buscar na internet",
      schema: {},
      _call: vi.fn(),
    };
    (BuscarInternetTool.tool as Mocked<any>).mockReturnValue(
      mockBuscarInternetToolInstance
    );

    mockGerarImagemTintaToolInstance = {
      name: "gerar_imagem_tinta",
      description: "Ferramenta para gerar imagem de tinta",
      schema: {},
      _call: vi.fn(),
    };
    (GerarImagemTintaTool.tool as Mocked<any>).mockReturnValue(
      mockGerarImagemTintaToolInstance
    );

    mockCheckpointer = {
      deleteThread: vi.fn(),
    };
    (ShortTermMemory.checkpointer as Mocked<any>).mockResolvedValue(
      mockCheckpointer
    );

    mockAgentInvoke.mockResolvedValue({
      structuredResponse: "Resposta do agente",
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

    expect(Langchain.models.gemini).toHaveBeenCalled();
    expect(BuscarTintaTool.tool).toHaveBeenCalled();
    expect(ListarTodasTintasTool.tool).toHaveBeenCalled();
    expect(BuscarTintasPorQueryTool.tool).toHaveBeenCalled();
    expect(BuscarInternetTool.tool).toHaveBeenCalled();
    expect(GerarImagemTintaTool.tool).toHaveBeenCalled();
    expect(ShortTermMemory.checkpointer).toHaveBeenCalled();
    expect(mockCheckpointer.deleteThread).not.toHaveBeenCalled();
    expect(mockAgentInvoke).toHaveBeenCalledWith(
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

    mockAgentInvoke.mockRejectedValue(new Error("Erro interno da IA"));

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

    mockAgentInvoke.mockRejectedValue(new Error("Erro interno da IA"));

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

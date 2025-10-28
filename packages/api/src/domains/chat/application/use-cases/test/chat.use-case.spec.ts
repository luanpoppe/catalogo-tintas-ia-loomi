import { Mocked } from "vitest";
import { ChatUseCase } from "../chat.use-case";
import { AgenteTintaIA } from "@catalogo-tintas/agente-ia";

const AgenteTintaIAMock = {
  handle: vi.fn(),
};

vi.mock("@catalogo-tintas/agente-ia", () => {
  return {
    AgenteTintaIA: vi.fn(function () {
      return AgenteTintaIAMock;
    }),
  };
});

describe("ChatUseCase", () => {
  console.log({ AgenteTintaIA });

  let chatUseCase: ChatUseCase;
  let agenteTintaIAMock: Mocked<AgenteTintaIA>;

  beforeEach(() => {
    vi.clearAllMocks();
    chatUseCase = new ChatUseCase();
    agenteTintaIAMock = new AgenteTintaIA() as Mocked<AgenteTintaIA>;
  });

  it("deve retornar uma resposta do agente de IA", async () => {
    const userMessage = "Olá, qual tinta devo usar?";
    const expectedResponse = "Você deve usar tinta acrílica.";

    // Configura o mock para retornar um valor específico
    (agenteTintaIAMock.handle as ReturnType<typeof vi.fn>).mockResolvedValue(
      expectedResponse
    );

    const result = await chatUseCase.execute({ userMessage });

    expect(agenteTintaIAMock.handle).toHaveBeenCalledWith(userMessage, "2");
    expect(result).toEqual({ response: expectedResponse });
  });

  it("deve lidar com uma mensagem de usuário vazia", async () => {
    const userMessage = "";
    const expectedResponse = "Por favor, forneça uma mensagem.";

    (agenteTintaIAMock.handle as ReturnType<typeof vi.fn>).mockResolvedValue(
      expectedResponse
    );

    const result = await chatUseCase.execute({ userMessage });

    expect(agenteTintaIAMock.handle).toHaveBeenCalledWith(userMessage, "2");
    expect(result).toEqual({ response: expectedResponse });
  });

  it("deve lidar com erros do agente de IA", async () => {
    const userMessage = "Mensagem que causa erro";
    const errorMessage = "Erro ao processar a mensagem.";

    (agenteTintaIAMock.handle as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error(errorMessage)
    );

    await expect(chatUseCase.execute({ userMessage })).rejects.toThrow(
      errorMessage
    );
    expect(agenteTintaIAMock.handle).toHaveBeenCalledWith(userMessage, "2");
  });
});

import { Langchain } from "./lib/langchain/langchain";

export class AgenteTintaIA {
  async log() {
    console.log("Executou agenda de IA com sucesso");

    // const model = Langchain.models.gemini();

    // try {
    //   const agent = await Langchain.createAgent({ model });
    //   const res = await agent.invoke(
    //     {
    //       messages: [{ role: "user", content: (req.body as any).content }],
    //     },
    //     { configurable: { thread_id: "1" } }
    //   );

    // return reply.status(200).send({ msg: "Hello", res });
    // } catch (error: any) {
    //   console.error(error);
    //   throw new Error();
    // }
  }
}

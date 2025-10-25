import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { env } from "../../env";

export class ShortTermMemory {
  static async checkpointer() {
    const checkpointer = PostgresSaver.fromConnString(env.DATABASE_URL);
    await checkpointer.setup();

    return checkpointer;
  }
}

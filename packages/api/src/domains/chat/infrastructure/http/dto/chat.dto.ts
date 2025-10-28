import z from "zod";

export const RequestChatDTOSchema = z.object({
  userMessage: z.string().nonempty().nonoptional(),
});

export type RequestChatDTO = z.infer<typeof RequestChatDTOSchema>;

export const ResponseChatDTOSchema = z.object({
  aiMessage: z.string(),
});

export type ResponseChatDTO = z.infer<typeof ResponseChatDTOSchema>;

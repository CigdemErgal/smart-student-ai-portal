import { z } from "zod";

export const chatbotMessageSchema = z.object({
  message: z
    .string()
    .min(2, "Message must be at least 2 characters")
    .max(500, "Message must be at most 500 characters"),
});

export type ChatbotMessageInput = z.infer<typeof chatbotMessageSchema>;

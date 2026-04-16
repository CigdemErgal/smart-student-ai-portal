import { Request, Response } from "express";
import { sendMessageToChatbot } from "../services/chatbot.service";
import { chatbotMessageSchema } from "../validations/chatbot.validation";
import { ZodError } from "zod";
export const chatbotController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = chatbotMessageSchema.parse(req.body);

    const reply = await sendMessageToChatbot(validatedData);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Failed to process chatbot request.",
    });
  }
};

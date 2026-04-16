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
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 503
    ) {
      res.status(503).json({
        success: false,
        message:
          "AI service is temporarily unavailable. Please try again later.",
      });
      return;
    }

    console.error("Chatbot controller error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process chatbot request.",
    });
  }
};

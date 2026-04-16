import { ChatbotMessageInput } from "../validations/chatbot.validation";
import { GoogleGenAI } from "@google/genai";

export const sendMessageToChatbot = async (
  data: ChatbotMessageInput,
): Promise<string> => {
  const { message } = data;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  });

  return response.text ?? "No reply generated";
};

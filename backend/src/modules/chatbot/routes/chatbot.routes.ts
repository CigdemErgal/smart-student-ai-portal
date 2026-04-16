import { Router } from "express";
import rateLimit from "express-rate-limit";
import { chatbotController } from "../controllers/chatbot.controller";

const router = Router();

const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many chatbot requests. Please try again later.",
  },
});

router.post("/", chatbotLimiter, chatbotController);

export default router;

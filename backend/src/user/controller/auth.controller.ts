import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validation/auth.validation";
import { registerUser, loginUser } from "../service/auth.service";
import { generateToken } from "../../utils/generateToken";

export const registerController = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Register failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await loginUser(validatedData);

    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = generateToken(user._id.toString(), user.role);
    res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

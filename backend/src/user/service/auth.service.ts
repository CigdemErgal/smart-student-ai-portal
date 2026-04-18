//bu adımda amaç register iş mantığını service katmanına koymak

import User from "../model/user.model";
import { RegisterInput, LoginInput } from "../validation/auth.validation";
import bcrypt from "bcryptjs";

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await User.create({
    fullName: data.fullName,
    email: data.email,
    password: hashedPassword,
    role: data.role ?? "counselor",
  });
  return newUser;
};

export const loginUser = async (data: LoginInput) => {
  const existingUser = await User.findOne({ email: data.email });

  if (!existingUser) {
    throw new Error("User not found with this email");
  }

  const isPasswordMatch = await bcrypt.compare(
    data.password,
    existingUser.password,
  );

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  return existingUser;
};

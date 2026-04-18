//bu kısımda amaç kullanıcı verisi veritabanında nasıl tutulacak onu tanımlamak
import mongoose, { Schema, Document } from "mongoose";

//kullanıcı tipini tanımlıyoruz
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "homeroom_teacher" | "branch_teacher" | "counselor";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

//schema oluşturuyoruz
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "homeroom_teacher", "branch_teacher", "counselor"],
      default: "counselor",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

//modeli export ediyoruz
const User = mongoose.model<IUser>("User", userSchema);

export default User;

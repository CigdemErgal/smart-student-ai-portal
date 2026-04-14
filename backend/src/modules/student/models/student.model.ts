import { Schema, model, Types, Document } from "mongoose";

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  studentNumber: string;
  className: string;
  section: string;
  schoolName: string;
  userId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    studentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

export const Student = model<IStudent>("Student", studentSchema);

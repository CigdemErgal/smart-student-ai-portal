import { Schema, model, Types, Document } from "mongoose";

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  studentNumber: string;
  className: string;
  section: string;
  schoolName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  classroomId: Types.ObjectId;
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

    isActive: {
      type: Boolean,
      default: true,
    },
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Student = model<IStudent>("Student", studentSchema);

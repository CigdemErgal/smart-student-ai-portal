import mongoose, { Document } from "mongoose";

export interface IClassroom extends Document {
  schoolName: string;
  classLevel: string;
  section: string;
  homeroomTeacherId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const { Schema, model, Types } = mongoose;

const classroomSchema = new Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },
    classLevel: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    homeroomTeacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Classroom = mongoose.model<IClassroom>(
  "Classroom",
  classroomSchema,
);

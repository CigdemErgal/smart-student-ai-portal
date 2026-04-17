import mongoose, { Schema, Document } from "mongoose";
import {
  ObservationCategory,
  ObservationFlagStatus,
} from "../types/observation.types";

export interface IObservation extends Document {
  studentId: mongoose.Types.ObjectId;
  category: ObservationCategory;
  observedAt: Date;
  summary: string;
  details: string;
  recordedBy: mongoose.Types.ObjectId;
  recordedByRole: string;
  flagStatus: ObservationFlagStatus;
  createdAt: Date;
  updatedAt: Date;
}

const observationSchema: Schema = new Schema<IObservation>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(ObservationCategory),
      required: true,
    },
    observedAt: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recordedByRole: {
      type: String,
      required: true,
      trim: true,
    },
    flagStatus: {
      type: String,
      enum: Object.values(ObservationFlagStatus),
      default: ObservationFlagStatus.NORMAL,
    },
  },
  {
    timestamps: true,
  },
);

export const Observation = mongoose.model<IObservation>(
  "Observation",
  observationSchema,
);

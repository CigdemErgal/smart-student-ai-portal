import { z } from "zod";
import { ObservationCategory } from "../types/observation.types";

export const createObservationSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  category: z.nativeEnum(ObservationCategory),
  observedAt: z.coerce.date(),
  summary: z.string().min(5).max(120),
  details: z.string().min(10).max(1000),
});

export type CreateObservationBody = z.infer<typeof createObservationSchema>;

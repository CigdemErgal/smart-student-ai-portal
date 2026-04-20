import { z } from "zod";

export const createClassroomSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  classLevel: z.string().min(1, "Class level is required"),
  section: z.string().min(1, "Section is required"),
  homeroomTeacherId: z.string().min(1, "Homeroom teacher ID is required"),
  isActive: z.boolean().optional(),
});

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;

export const updateClassroomSchema = z.object({
  schoolName: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be at most 100 characters")
    .optional(),
  classLevel: z
    .string()
    .min(1, "Class level must be at least 1 characters")
    .max(20, "Class level must be at most 20 characters")
    .optional(),
  section: z
    .string()
    .min(1, "Section must be at least 1 characters")
    .max(10, "Section must be at most 10 characters")
    .optional(),
  homeroomTeacherId: z
    .string()
    .min(1, "Homeroom teacher ID must be at least 1 characters")
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;

import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  studentNumber: z
    .string()
    .min(1, "Student number is required")
    .max(30, "Student number must be at most 30 characters"),

  className: z
    .string()
    .min(1, "Class name is required")
    .max(30, "Class name must be at most 30 characters"),
  section: z
    .string()
    .min(1, "Section is required")
    .max(10, "Section must be at most 10 characters"),
  schoolName: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be at most 100 characters"),

  isActive: z.boolean().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .optional(),
  studentNumber: z
    .string()
    .min(1, "Student number is required")
    .max(30, "Student number must be at most 30 characters")
    .optional(),
  className: z
    .string()
    .min(1, "Class name is required")
    .max(30, "Class name must be at most 30 characters")
    .optional(),
  section: z
    .string()
    .min(1, "Section is required")
    .max(10, "Section must be at most 10 characters")
    .optional(),
  schoolName: z
    .string()
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be at most 100 characters")
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

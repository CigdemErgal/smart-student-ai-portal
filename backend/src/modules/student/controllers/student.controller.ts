import { Request, Response } from "express";
import {
  createStudentSchema,
  updateStudentSchema,
} from "../validations/student.validation";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../services/student.service";

const safeStudentResponse = (student: {
  _id: unknown;
  firstName: string;
  lastName: string;
  studentNumber: string;
  className: string;
  section: string;
  schoolName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  classroomId: unknown;
}) => {
  return {
    id: student._id,
    firstName: student.firstName,
    lastName: student.lastName,
    studentNumber: student.studentNumber,
    className: student.className,
    section: student.section,
    schoolName: student.schoolName,
    isActive: student.isActive,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
    classroomId: student.classroomId,
  };
};

export const createStudentController = async (req: Request, res: Response) => {
  try {
    const validatedData = createStudentSchema.parse(req.body);

    const student = await createStudent(validatedData);
    const safeStudent = safeStudentResponse(student);

    res.status(201).json({
      message: "Student created successfully",
      student: safeStudent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      message: "Create student failed",
      error: message,
    });
  }
};

export const getAllStudentsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const students = await getAllStudents();
    const safeStudents = students.map(
      (student: Parameters<typeof safeStudentResponse>[0]) =>
        safeStudentResponse(student),
    );

    res.status(200).json({
      message: "Students fetched successfully",
      students: safeStudents,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      message: "Get all students failed",
      error: message,
    });
  }
};

export const getStudentByIdController = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    if (!studentId || Array.isArray(studentId)) {
      return res.status(400).json({
        message: "Invalid student id",
      });
    }

    const student = await getStudentById(studentId);
    const safeStudent = safeStudentResponse(student);

    res.status(200).json({
      message: "Student fetched successfully",
      student: safeStudent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      message: "Get student by ID failed",
      error: message,
    });
  }
};

export const updateStudentController = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    if (!studentId || Array.isArray(studentId)) {
      return res.status(400).json({
        message: "Invalid student id",
      });
    }

    const validatedData = updateStudentSchema.parse(req.body);
    const updatedStudent = await updateStudent(studentId, validatedData);
    const safeStudent = safeStudentResponse(updatedStudent);

    res.status(200).json({
      message: "Student updated successfully",
      student: safeStudent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      message: "Update student failed",
      error: message,
    });
  }
};

export const deleteStudentController = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    if (!studentId || Array.isArray(studentId)) {
      return res.status(400).json({
        message: "Invalid student id",
      });
    }

    await deleteStudent(studentId);

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      message: "Delete student failed",
      error: message,
    });
  }
};

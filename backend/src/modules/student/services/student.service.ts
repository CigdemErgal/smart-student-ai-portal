import { Student } from "../models/student.model";
import {
  CreateStudentInput,
  UpdateStudentInput,
} from "../validations/student.validation";

export const createStudent = async (data: CreateStudentInput) => {
  const existingStudent = await Student.findOne({
    studentNumber: data.studentNumber,
  });

  if (existingStudent) {
    throw new Error("Student already exists with this student number");
  }

  const newStudent = await Student.create({
    firstName: data.firstName,
    lastName: data.lastName,

    studentNumber: data.studentNumber,
    className: data.className,
    section: data.section,
    schoolName: data.schoolName,
    userId: data.userId,
    isActive: data.isActive ?? true,
  });

  return newStudent;
};

export const getAllStudents = async () => {
  const students = await Student.find();
  return students;
};

export const getStudentById = async (id: string) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new Error("Student not found");
  }
  return student;
};

export const updateStudent = async (id: string, data: UpdateStudentInput) => {
  const updatedStudent = await Student.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedStudent) {
    throw new Error("Student not found");
  }

  return updatedStudent;
};

export const deleteStudent = async (id: string) => {
  const deletedStudent = await Student.findByIdAndDelete(id);
  if (!deletedStudent) {
    throw new Error("Student not found");
  }
  return deletedStudent;
};

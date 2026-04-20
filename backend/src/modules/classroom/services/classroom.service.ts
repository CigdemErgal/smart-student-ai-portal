import { Classroom } from "../models/classroom.model";
import { CreateClassroomInput } from "../validations/classroom.validation";
import User from "../../../user/model/user.model";

export const createClassroom = async (data: CreateClassroomInput) => {
  const homeroomTeacher = await User.findById(data.homeroomTeacherId);

  if (!homeroomTeacher) {
    throw new Error("User not found");
  }
  if (homeroomTeacher.role !== "homeroom_teacher") {
    throw new Error("Selected user is not a homeroom teacher");
  }

  const newClassroom = await Classroom.create({
    schoolName: data.schoolName,
    classLevel: data.classLevel,
    section: data.section,
    homeroomTeacherId: data.homeroomTeacherId,
    isActive: data.isActive ?? true,
  });

  return newClassroom;
};

export const getAllClassrooms = async () => {
  const classrooms = await Classroom.find();
  return classrooms;
};

export const getClassroomById = async (id: string) => {
  const classroom = await Classroom.findById(id);

  if (!classroom) {
    throw new Error("Classroom not found");
  }

  return classroom;
};

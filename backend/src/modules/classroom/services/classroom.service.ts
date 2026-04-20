import { Classroom } from "../models/classroom.model";
import { CreateClassroomInput } from "../validations/classroom.validation";

export const createClassroom = async (data: CreateClassroomInput) => {
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

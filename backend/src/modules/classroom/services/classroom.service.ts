import { Classroom } from "../models/classroom.model";
import { CreateClassroomInput } from "../validations/classroom.validation";
import User from "../../../user/model/user.model";

export const createClassroom = async (
  data: CreateClassroomInput,
  user: { userId: string; role: string },
) => {
  if (
    user.role === "homeroom_teacher" &&
    data.homeroomTeacherId !== user.userId
  ) {
    throw new Error("Homeroom teacher can only create their own classroom");
  }

  const homeroomTeacher = await User.findById(data.homeroomTeacherId);

  if (!homeroomTeacher) {
    throw new Error("User not found");
  }
  if (homeroomTeacher.role !== "homeroom_teacher") {
    throw new Error("Selected user is not a homeroom teacher");
  }
  const existingClassroom = await Classroom.findOne({
    schoolName: data.schoolName,
    classLevel: data.classLevel,
    section: data.section,
  });

  if (existingClassroom) {
    throw new Error("Classroom already exists");
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

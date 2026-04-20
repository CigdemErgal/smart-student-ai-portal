import { Request, Response } from "express";
import { createClassroomSchema } from "../validations/classroom.validation";
import {
  createClassroom,
  getAllClassrooms,
  getClassroomById,
} from "../services/classroom.service";

export const createClassroomController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = createClassroomSchema.parse(req.body);
    const classroom = await createClassroom(validatedData);

    res.status(201).json({
      message: "Classroom created successfully",
      classroom,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message === "User not found" ? 404 : 400;

    res.status(statusCode).json({
      message: "Create classroom failed",
      error: message,
    });
  }
};

export const getAllClassroomsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const classrooms = await getAllClassrooms();

    res.status(200).json({
      message: "Classrooms fetched successfully",
      classrooms,
    });
  } catch (error) {
    res.status(400).json({
      message: "Get all classrooms failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getClassroomByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const classroomId = req.params.id;

    if (!classroomId || Array.isArray(classroomId)) {
      return res.status(400).json({
        message: "Invalid classroom id",
      });
    }

    const classroom = await getClassroomById(classroomId);

    res.status(200).json({
      message: "Classroom fetched successfully",
      classroom,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode = message === "Classroom not found" ? 404 : 400;

    res.status(statusCode).json({
      message: "Get classroom by ID failed",
      error: message,
    });
  }
};

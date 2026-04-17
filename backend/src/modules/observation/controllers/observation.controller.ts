import { Request, Response } from "express";
import {
  createObservationService,
  getObservationByIdService,
  getStudentObservationsService,
} from "../services/observation.service";

import { createObservationSchema } from "../validations/observation.validation";

export const createObservationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validatedData = createObservationSchema.parse(req.body);
    const user = req.user as { userId: string; role: string };
    const observation = await createObservationService(validatedData, user);

    res.status(201).json({
      message: "Observation created successfully",
      observation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      message === "Student not found" ? 404 : 400;

    res.status(statusCode).json({
      message: "Create observation failed",
      error: message,
    });
  }
};

export const getStudentObservationsController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const observations = await getStudentObservationsService(id);

    res.status(200).json({
      observations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      message === "Student not found" ? 404 : 400;

    res.status(statusCode).json({
      message: "Get student observations failed",
      error: message,
    });
  }
};

export const getObservationByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Observation ID is required" });
    }
    const observation = await getObservationByIdService(id);

    res.status(200).json({
      observation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const statusCode =
      message === "Observation not found" ? 404 : 400;

    res.status(statusCode).json({
      message: "Get observation by ID failed",
      error: message,
    });
  }
};

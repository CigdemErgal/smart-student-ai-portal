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
  const validatedData = createObservationSchema.parse(req.body);
  const user = req.user as { id: string; role: string };
  const observation = await createObservationService(validatedData, user);

  res.status(201).json({
    message: "Observation created successfully",
    observation,
  });
};

export const getStudentObservationsController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Student ID is required" });
  }
  const observations = await getStudentObservationsService(id);

  res.status(200).json({
    observations,
  });
};

export const getObservationByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Observation ID is required" });
  }
  const observation = await getObservationByIdService(id);

  res.status(200).json({
    observation,
  });
};

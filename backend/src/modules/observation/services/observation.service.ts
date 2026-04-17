import {
  createObservation,
  getObservationById,
  getObservationsByStudentId,
} from "../repositories/observation.repository";
import { CreateObservationInput } from "../types/observation.types";

export const createObservationService = async (
  data: CreateObservationInput,
  user: { userId: string; role: string },
) => {
  return createObservation({
    ...data,
    recordedBy: user.userId,
    recordedByRole: user.role,
  });
};

export const getStudentObservationsService = async (studentId: string) => {
  return getObservationsByStudentId(studentId);
};

export const getObservationByIdService = async (id: string) => {
  return getObservationById(id);
};

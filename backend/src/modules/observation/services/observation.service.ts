import {
  createObservation,
  getObservationById,
  getObservationsByStudentId,
} from "../repositories/observation.repository";
import { CreateObservationInput } from "../types/observation.types";

export const createObservationService = async (
  data: CreateObservationInput,
  user: { id: string; role: string },
) => {
  return createObservation({
    ...data,
    recordedBy: user.id,
    recordedByRole: user.role,
  });
};

export const getStudentObservationsService = async (studentId: string) => {
  return getObservationsByStudentId(studentId);
};

export const getObservationByIdService = async (id: string) => {
  return getObservationById(id);
};

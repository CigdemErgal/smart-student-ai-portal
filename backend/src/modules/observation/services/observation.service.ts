import {
  createObservation,
  getObservationById,
  getObservationsByStudentId,
} from "../repositories/observation.repository";
import { getStudentById } from "../../student/services/student.service";
import { CreateObservationInput } from "../types/observation.types";

export const createObservationService = async (
  data: CreateObservationInput,
  user: { userId: string; role: string },
) => {
  await getStudentById(data.studentId);

  return createObservation({
    ...data,
    recordedBy: user.userId,
    recordedByRole: user.role,
  });
};

export const getStudentObservationsService = async (studentId: string) => {
  await getStudentById(studentId);

  return getObservationsByStudentId(studentId);
};

export const getObservationByIdService = async (id: string) => {
  const observation = await getObservationById(id);

  if (!observation) {
    throw new Error("Observation not found");
  }

  return observation;
};

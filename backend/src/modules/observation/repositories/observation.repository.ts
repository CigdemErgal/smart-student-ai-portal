import { Observation, IObservation } from "../models/observation.model";

export const createObservation = async (data: Record<string, unknown>) => {
  return Observation.create(data);
};

export const getObservationsByStudentId = async (studentId: string) => {
  return Observation.find({ studentId }).sort({ observedAt: -1 });
};

export const getObservationById = async (id: string) => {
  return Observation.findById(id);
};

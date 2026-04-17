import { Router } from "express";
import {
  createObservationController,
  getObservationByIdController,
  getStudentObservationsController,
} from "../controllers/observation.controller";
const router = Router();

router.post("/", createObservationController);
router.get("/student/:id", getStudentObservationsController);
router.get("/:id", getObservationByIdController);

export default router;

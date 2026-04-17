import { Router } from "express";
import {
  createObservationController,
  getObservationByIdController,
  getStudentObservationsController,
} from "../controllers/observation.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createObservationController);
router.get("/student/:id", authMiddleware, getStudentObservationsController);
router.get("/:id", authMiddleware, getObservationByIdController);

export default router;

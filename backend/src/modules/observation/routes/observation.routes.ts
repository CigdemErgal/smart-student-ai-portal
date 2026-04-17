import { Router } from "express";
import {
  createObservationController,
  getObservationByIdController,
  getStudentObservationsController,
} from "../controllers/observation.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  createObservationController,
);
router.get(
  "/student/:id",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  getStudentObservationsController,
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "teacher"),
  getObservationByIdController,
);

export default router;

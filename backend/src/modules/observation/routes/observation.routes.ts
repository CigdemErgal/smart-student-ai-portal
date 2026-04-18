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
  authorizeRoles("admin", "homeroom_teacher", "branch_teacher", "counselor"),
  createObservationController,
);
router.get(
  "/student/:id",
  authMiddleware,
  authorizeRoles("admin", "homeroom_teacher", "branch_teacher", "counselor"),
  getStudentObservationsController,
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "homeroom_teacher", "branch_teacher", "counselor"),
  getObservationByIdController,
);

export default router;

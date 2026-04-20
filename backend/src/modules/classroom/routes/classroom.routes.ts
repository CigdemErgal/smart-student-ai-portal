import { Router } from "express";
import {
  createClassroomController,
  getAllClassroomsController,
  getClassroomByIdController,
} from "../controllers/classroom.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createClassroomController,
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "homeroom_teacher", "branch_teacher", "counselor"),
  getAllClassroomsController,
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "homeroom_teacher", "branch_teacher", "counselor"),
  getClassroomByIdController,
);

export default router;

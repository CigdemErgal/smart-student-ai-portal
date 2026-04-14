import { Router } from "express";
import {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentController,
} from "../controllers/student.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/role.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createStudentController,
);
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  getAllStudentsController,
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  getStudentByIdController,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateStudentController,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteStudentController,
);
export default router;

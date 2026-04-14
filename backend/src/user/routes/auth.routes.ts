import { Router } from "express";
import {
  registerController,
  loginController,
} from "../controller/auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    message: "welcome admin",
    user: req.user,
  });
});
export default router;

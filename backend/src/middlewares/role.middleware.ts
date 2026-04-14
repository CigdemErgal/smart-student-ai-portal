import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;

    if (!user || !user.role) {
      return res.status(403).json({
        message: "Access denied. No role found",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have permission",
      });
    }

    next();
  };
};

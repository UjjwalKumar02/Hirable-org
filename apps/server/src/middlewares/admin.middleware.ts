import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRole = req.userRole;
    if (!userRole || userRole === null || userRole !== "ADMIN") {
      res.status(403).json({ error: "Unathorized" });
      return;
    }

    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

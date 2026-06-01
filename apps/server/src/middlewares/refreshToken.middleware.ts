import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import type { AuthRequest } from "./auth.middleware.js";

export const refreshTokenMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = await req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(404).json({ error: "Refresh token is empty." });
      return;
    }

    const decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET!,
    );
    if (typeof decoded === "string" || !decoded.id) {
      res.status(401).json({ error: "Invalid refresh token." });
      return;
    }

    req.userId = decoded.id;
    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

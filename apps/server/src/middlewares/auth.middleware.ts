import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: "USER" | "ADMIN";
  userEmail?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = await req.cookies.accessToken;
    if (!accessToken) {
      res.status(403).json({ error: "Access token is empty." });
      return;
    }

    const decoded = await jwt.verify(
      accessToken,
      process.env.ACCESS_JWT_SECRET!,
    );
    if (typeof decoded === "string" || !decoded.id) {
      res.status(401).json({ error: "Invalid access token." });
      return;
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

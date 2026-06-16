import { prisma } from "@repo/database/client";
import type { Request, Response } from "express";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";

export const onGetCreditPackages = async (req: Request, res: Response) => {
  try {
    const creditPackages = await prisma.creditPackage.findMany();

    res.status(200).json({ creditPackages });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const onGetUserCredits = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ credits: user.creditBalance });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const onGetLedger = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    const ledger = await prisma.creditLedger.findMany({
      where: { userId },
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ ledger });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

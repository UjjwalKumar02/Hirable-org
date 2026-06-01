import type { Response } from "express";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";
import { CreateCreditPackageDTO } from "../dto/admin.dto.js";
import { prisma } from "@repo/database/client";

export const onGetCreditPackages = async (req: AuthRequest, res: Response) => {
  try {
    const creditPackages = await prisma.creditPackage.findMany();

    res.status(200).json({ creditPackages });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const onCreateCreditPackage = async (
  req: AuthRequest,
  res: Response,
) => {
  const result = CreateCreditPackageDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const { name, credits, priceInPaise, isActive } = result.data;
  try {
    const creditPackage = await prisma.creditPackage.create({
      data: {
        name,
        credits,
        priceInPaise,
        isActive,
      },
    });

    res
      .status(201)
      .json({ creditPackage, message: "Credit package is created" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

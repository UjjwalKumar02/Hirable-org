import type { Request, Response } from "express";
import { LoginDTO, SignupDTO, verifyEmailDTO } from "../dto/auth.dto.js";
import { generateCode, generateJWT } from "../utils/auth.util.js";
import {
  ACCESS_JWT_LIMIT,
  REFRESH_JWT_LIMIT,
} from "../../../config/jwt.config.js";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";
import { OTP_TIME_LIMIT } from "../../../config/otp.config.js";
import { prisma } from "@repo/database/client";
import bcrypt from "bcrypt";
import { enqueue } from "../../../queues/enqueue.js";

// Signup handler
export const onSignup = async (req: Request, res: Response) => {
  // DTO validation
  const result = SignupDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const { username, email, password } = result.data;
  try {
    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        accountType: "DEFAULT",
        userRole: "ADMIN",
        isVerified: false,
      },
    });

    if (!newUser) {
      res.status(400).json({ error: "User creation failed" });
      return;
    }

    let verificationCode = generateCode();

    // save in db
    await prisma.user.update({
      where: { email: newUser.email },
      data: {
        otp: verificationCode,
        otpValidTime: new Date(Date.now() + OTP_TIME_LIMIT),
      },
    });

    // enqueue email
    await enqueue({
      queue: "email",
      type: "verify-email",
      payload: { to: newUser.email, OTP: verificationCode },
    });

    res.status(201).json({ message: "Signup success.", userId: newUser.id });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify email
export const onVerifyEmail = async (req: Request, res: Response) => {
  const result = verifyEmailDTO.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.message });
  }

  const { otp, userId } = result.data;
  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const verificationCode = user.otp;

    const isValid =
      verificationCode === otp && new Date(Date.now()) <= user.otpValidTime!;

    if (!isValid) {
      return res.status(400).json({ error: "OTP not valid!" });
    } else {
      await prisma.user.update({
        where: { email: user.email },
        data: {
          isVerified: true,
        },
      });
    }

    res.status(200).json({ message: "Email verification success." });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Resend otp
export const onResendOTP = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  if (!userId) {
    res.status(400).json({ error: "User id is empty!" });
    return;
  }

  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const verificationCode = generateCode();

    await prisma.user.update({
      where: { email: user.email },
      data: {
        otp: verificationCode,
        otpValidTime: new Date(Date.now() + OTP_TIME_LIMIT),
      },
    });

    await enqueue({
      queue: "email",
      type: "verify-email",
      payload: { to: user.email, OTP: verificationCode },
    });

    res.status(200).json({ message: "OTP regeneration success" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user details
export const onGetMe = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "UserId is empty in jwt." });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        avatar: user.avatar,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        userRole: user.userRole,
        creditBalance: user.creditBalance,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login handler
export const onLogin = async (req: Request, res: Response) => {
  const result = LoginDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const { email, password } = result.data;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !user.password) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Allow only verified users
    if (user.isVerified === false) {
      res.status(401).json({ error: "User not verified!" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const accessToken = await generateJWT({
      userId: user.id,
      userRole: user.userRole,
      userEmail: user.email,
      secret: process.env.ACCESS_JWT_SECRET!,
      limit: ACCESS_JWT_LIMIT,
    });
    const refreshToken = await generateJWT({
      userId: user.id,
      userRole: user.userRole,
      userEmail: user.email,
      secret: process.env.REFRESH_JWT_SECRET!,
      limit: REFRESH_JWT_LIMIT,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: ACCESS_JWT_LIMIT,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: REFRESH_JWT_LIMIT,
      path: "/",
    });

    res.status(200).json({ message: "Login success." });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout handler
export const onLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    res.status(200).json({ message: "Logout success." });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Refresh the tokens
export const onRefreshToken = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "UserId is empty in jwt." });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const accessToken = await generateJWT({
      userId: user.id,
      userRole: user.userRole,
      userEmail: user.email,
      secret: process.env.ACCESS_JWT_SECRET!,
      limit: ACCESS_JWT_LIMIT,
    });
    const refreshToken = await generateJWT({
      userId: user.id,
      userRole: user.userRole,
      userEmail: user.email,
      secret: process.env.REFRESH_JWT_SECRET!,
      limit: REFRESH_JWT_LIMIT,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: ACCESS_JWT_LIMIT,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: REFRESH_JWT_LIMIT,
      path: "/",
    });

    res.status(200).json({ message: "Token refresh success." });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List all users
export const onGetUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        forms: { include: { formFields: true } },
        paymentOrders: true,
        creditLedger: true,
      },
    });

    const submissions = await prisma.submission.findMany({
      include: { fieldAnswers: true, responseEmbedding: true },
    });

    res.status(200).json({ users, submissions });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

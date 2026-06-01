import { Router } from "express";
import {
  onGetMe,
  onGetUsers,
  onLogin,
  onLogout,
  onRefreshToken,
  onResendOTP,
  onSignup,
  onVerifyEmail,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { refreshTokenMiddleware } from "../../../middlewares/refreshToken.middleware.js";

const authRouter: Router = Router();

authRouter.post("/signup", onSignup);
authRouter.post("/verify-email", onVerifyEmail);
authRouter.post("/resend-otp", onResendOTP);
authRouter.post("/login", onLogin);
authRouter.post("/logout", onLogout);
authRouter.get("/me", authMiddleware, onGetMe);
authRouter.post("/refresh-token", refreshTokenMiddleware, onRefreshToken);

// Remove later
authRouter.get("/get-users", onGetUsers);

export default authRouter;

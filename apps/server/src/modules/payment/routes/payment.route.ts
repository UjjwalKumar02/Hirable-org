import { Router } from "express";
import {
  onCreateOrder,
  onVerifyPayment,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const paymentRouter: Router = Router();

paymentRouter.post("/create-order", authMiddleware, onCreateOrder);
paymentRouter.post("/verify-payment", authMiddleware, onVerifyPayment);

export default paymentRouter;

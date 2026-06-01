import { Router } from "express";
import {
  onGetCreditPackages,
  onGetUserCredits,
} from "../controllers/credit.controller.js";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";

const creditRouter: Router = Router();

creditRouter.get("/credit-package/bulk", authMiddleware, onGetCreditPackages);
creditRouter.get("/user-credits", authMiddleware, onGetUserCredits);

export default creditRouter;

import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../../middlewares/admin.middleware.js";
import {
  onCreateCreditPackage,
  onGetCreditPackages,
} from "../controllers/admin.controller.js";

const adminRouter: Router = Router();

adminRouter.get(
  "/credit-package/bulk",
  authMiddleware,
  adminMiddleware,
  onGetCreditPackages,
);
adminRouter.post(
  "/credit-package/create",
  authMiddleware,
  adminMiddleware,
  onCreateCreditPackage,
);

export default adminRouter;

import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware.js";
import {
  onCreateForm,
  onDeleteForm,
  onGetForm,
  onGetFormSubmissions,
  onGetUserForms,
  onLLMQuery,
  onSubmitForm,
  onTogglePublishForm,
  onUpdateForm,
} from "../controllers/form.controller.js";

const formRouter: Router = Router();

formRouter.get("/bulk", authMiddleware, onGetUserForms);
formRouter.post("/create", authMiddleware, onCreateForm);
formRouter.put("/:slug/update", authMiddleware, onUpdateForm);
formRouter.patch("/:slug/toggle-publish", authMiddleware, onTogglePublishForm);
formRouter.delete("/:slug/delete", authMiddleware, onDeleteForm);
formRouter.get("/:slug/submissions", authMiddleware, onGetFormSubmissions);

// public routes
formRouter.get("/:slug/details", onGetForm);
formRouter.post("/:slug/submit", onSubmitForm);

// query using llm
formRouter.post("/:slug/llm-query", authMiddleware, onLLMQuery);

export default formRouter;

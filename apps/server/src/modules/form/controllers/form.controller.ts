import type { Request, Response } from "express";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";
import { prisma } from "@repo/database/client";
import {
  CreateFormDTO,
  SubmitFormDTO,
  UpdateFormDTO,
} from "../dto/form.dto.js";
import { generateSlug } from "../utils/form.util.js";

// Get user forms handler
export const onGetUserForms = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    const forms = await prisma.form.findMany({ where: { authorId: userId } });

    res.status(200).json({ forms });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create form handler
export const onCreateForm = async (req: AuthRequest, res: Response) => {
  // DTO validation
  const result = CreateFormDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const { title, description } = result.data;

  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    const slug = generateSlug(title);

    const form = await prisma.form.create({
      data: { title, description, authorId: userId, isPublished: false, slug },
    });

    res.status(201).json({ form });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get form details
export const onGetForm = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  if (!slug) {
    res.status(404).json({ error: "Form id is empty" });
    return;
  }

  try {
    const formDetails = await prisma.form.findUnique({
      where: { slug: slug },
      include: { formFields: true },
    });
    if (!formDetails) {
      res.status(404).json({ error: "Form not found" });
      return;
    }

    res.status(200).json({ formDetails });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update form handler
export const onUpdateForm = async (req: AuthRequest, res: Response) => {
  // DTO validation
  const result = UpdateFormDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const { title, description, fieldList } = result.data;

  const slug = req.params.slug as string;
  if (!slug) {
    res.status(404).json({ error: "Form id is empty" });
    return;
  }
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    // Transaction to update form and form fields
    await prisma.$transaction(
      async (tx) => {
        // 1. Find form
        const form = await tx.form.findUnique({
          where: { slug: slug, authorId: userId },
        });
        if (!form) {
          throw new Error("Form not found");
        }

        // 2. Delete all fields of form with formId
        await tx.formField.deleteMany({ where: { formId: form.id } });

        // 3. Create the fields
        await tx.formField.createMany({
          data: fieldList.map((f, index) => ({
            label: f.label,
            type: f.type,
            required: f.required,
            wordLimit: f.wordLimit,
            options: f.options,
            formId: form.id,
            order: index + 1,
          })),
        });

        // 4. Update form
        await tx.form.update({
          where: { id: form.id, authorId: userId },
          data: {
            title,
            description,
          },
        });
      },
      {
        maxWait: 15000, // 15 sec required to make transaction request to start
        timeout: 10000, // 10 sec max waits to complete the transaction
      },
    );

    res.status(200).json({ message: "Form has updated" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle publish form handler
export const onTogglePublishForm = async (req: AuthRequest, res: Response) => {
  const slug = req.params.slug as string;
  if (!slug) {
    res.status(404).json({ error: "Form id is empty" });
    return;
  }
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    const form = await prisma.form.findUnique({
      where: { slug, authorId: userId },
    });
    if (!form) {
      res.status(404).json({ error: "Form not found" });
      return;
    }

    // If form is already published or not
    if (form.isPublished === true) {
      const updatedForm = await prisma.form.update({
        where: { id: form.id, authorId: userId },
        data: { isPublished: false },
      });

      res.status(200).json({ isPublished: updatedForm.isPublished });
    } else {
      const updatedForm = await prisma.form.update({
        where: { id: form.id, authorId: userId },
        data: { isPublished: true },
      });

      res.status(200).json({ isPublished: updatedForm.isPublished });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Submit form handler
export const onSubmitForm = async (req: Request, res: Response) => {
  // DTO validation
  const result = SubmitFormDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const responseData = result.data.responseData;
  const slug = req.params.slug as string;

  try {
    // Transaction for submit the response
    await prisma.$transaction(
      async (tx) => {
        // 1. Find form
        const form = await tx.form.findUnique({
          where: { slug: slug },
        });
        if (!form) {
          throw new Error("Form not found");
        }

        // 2. Create submission
        const submission = await tx.submission.create({
          data: {
            formId: form.id,
          },
        });

        // 3. Create field answers
        await tx.fieldAnswer.createMany({
          data: responseData.map((r) => ({
            value: r.value,
            formFieldId: r.formFieldId,
            submissionId: submission.id,
          })),
        });
      },
      {
        maxWait: 15000,
        timeout: 10000,
      },
    );

    res.status(200).json({ message: "Response is recorded" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete form handler
export const onDeleteForm = async (req: AuthRequest, res: Response) => {
  const slug = req.params.slug as string;
  if (!slug) {
    res.status(404).json({ error: "Form id is empty" });
    return;
  }
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    await prisma.form.delete({
      where: { slug, authorId: userId },
    });

    res.status(200).json({ message: "Form has deleted" });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get form submissions
export const onGetFormSubmissions = async (req: AuthRequest, res: Response) => {
  const slug = req.params.slug as string;
  if (!slug) {
    res.status(404).json({ error: "Form id is empty" });
    return;
  }
  const userId = req.userId;
  if (!userId) {
    res.status(404).json({ error: "User id is empty" });
    return;
  }

  try {
    // Form details with fields
    const form = await prisma.form.findUnique({
      where: { slug, authorId: userId },
    });
    if (!form) {
      res.status(404).json({ error: "Form not found" });
      return;
    }

    // Submissions with answers
    const submissions = await prisma.submission.findMany({
      where: { formId: form.id },
      include: { fieldAnswers: true },
    });

    res.status(200).json({ submissions });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

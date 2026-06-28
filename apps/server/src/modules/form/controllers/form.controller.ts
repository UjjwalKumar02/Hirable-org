import type { Request, Response } from "express";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";
import { prisma } from "@repo/database/client";
import {
  CreateFormDTO,
  LLMQueryDTO,
  SubmitFormDTO,
  UpdateFormDTO,
} from "../dto/form.dto.js";
import { generateDocument, generateSlug } from "../utils/form.util.js";
import {
  generateEmbedding,
  generateLLMQueryResponse,
} from "../../../lib/gemini.js";
import {
  CREDIT_PER_LLM_CALL,
  SIMILAR_RESONSE_LIMIT,
} from "../../../config/llm.config.js";
import type { SimilarResponse } from "../types/form.type.js";
import { generateCode } from "../../auth/utils/auth.util.js";
import { enqueue } from "../../../queues/enqueue.js";

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
          include: { formFields: true },
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

        // 4. Generate document and create response embedding with PENDING
        let document = generateDocument({
          formFields: form.formFields,
          fieldAnswers: responseData,
        });

        const responseEmbedding = await tx.responseEmbedding.create({
          data: {
            formId: form.id,
            submissionId: submission.id,
            document,
            status: "PENDING",
          },
        });

        // 5. Enqueue for embedding generation
        await enqueue({
          queue: "embedding",
          type: "generate-embedding",
          payload: {
            responseEmbeddingId: responseEmbedding.id,
            document: responseEmbedding.document ?? document,
          },
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

// LLM query handler
export const onLLMQuery = async (req: AuthRequest, res: Response) => {
  // DTO validation
  const result = LLMQueryDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ error: "User id is empty." });
    return;
  }

  const query = result.data.query;
  const slug = req.params.slug as string;

  try {
    let form: any = null;
    let updatedUser: any = null;

    // Assuming llm call will work
    await prisma.$transaction(
      async (tx) => {
        // 1. User credits validation
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new Error("User not found");
        }

        const hasValidBalance = user.creditBalance - CREDIT_PER_LLM_CALL;
        if (hasValidBalance < 0) {
          throw new Error("Credit balance is insufficient");
        }

        // 2. Form admin validation
        form = await tx.form.findUnique({
          where: { slug, authorId: userId },
        });
        if (!form) {
          throw new Error("Form not found");
        }

        // 3. Update user's credit balance
        updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            creditBalance: { decrement: CREDIT_PER_LLM_CALL },
          },
        });

        // 4. Create credit ledger
        await tx.creditLedger.create({
          data: {
            userId,
            type: "RESERVE",
            amount: CREDIT_PER_LLM_CALL,
            previousBalance: updatedUser.creditBalance + CREDIT_PER_LLM_CALL,
            currentBalance: updatedUser.creditBalance,
            referenceId: generateCode(),
          },
        });
      },
      {
        maxWait: 15000,
        timeout: 10000,
      },
    );

    // Trying Embedding, Similarity search and LLM call
    try {
      // Get embedding of the query
      const queryEmbedding = await generateEmbedding(query);
      if (!queryEmbedding || queryEmbedding.length === 0) {
        throw new Error("Embedding failed");
      }

      // Similarity search
      const vector = `[${queryEmbedding.join(",")}]`;
      const similarDBResponses = await prisma.$queryRaw<SimilarResponse[]>`
        SELECT
          id,
          "submissionId",
          document,
          embedding <=> ${vector}::vector AS distance
        FROM "ResponseEmbedding"
        WHERE "formId" = ${form.id}
          AND status = 'COMPLETED'
        ORDER BY embedding <=> ${vector}::vector
        LIMIT ${SIMILAR_RESONSE_LIMIT}
      `;

      const compactContext = similarDBResponses.map((r: any) => ({
        submissionId: r.submissionId,
        document: r.document,
        distance: r.distance,
      }));

      // Generate LLM response
      const llmResponse = await generateLLMQueryResponse({
        question: query,
        context: JSON.stringify({ type: "json", compactContext }, null, 2),
      });

      // Create credit ledger
      await prisma.creditLedger.create({
        data: {
          userId,
          type: "USAGE",
          amount: CREDIT_PER_LLM_CALL,
          previousBalance: updatedUser.creditBalance + CREDIT_PER_LLM_CALL,
          currentBalance: updatedUser.creditBalance,
          referenceId: generateCode(),
        },
      });

      res.status(200).json({
        llmResponse,
        sources: compactContext,
        creditBalance: updatedUser.creditBalance,
      });
    } catch (error) {
      try {
        // Refund on LLM call failure
        await prisma.$transaction(
          async (tx) => {
            // 1. Update user's credit balance
            const currentUser = await tx.user.update({
              where: { id: userId },
              data: {
                creditBalance: { increment: CREDIT_PER_LLM_CALL },
              },
            });

            // 2. Create credit ledger
            await tx.creditLedger.create({
              data: {
                userId,
                type: "REFUND",
                amount: CREDIT_PER_LLM_CALL,
                previousBalance:
                  currentUser.creditBalance - CREDIT_PER_LLM_CALL,
                currentBalance: currentUser.creditBalance,
                referenceId: generateCode(),
              },
            });
          },
          {
            maxWait: 15000,
            timeout: 10000,
          },
        );

        res.status(400).json({ error: "LLM call failed, refund success!" });
        return;
      } catch (error) {
        console.log("Refund failed");
        res.status(400).json({ error: "LLM call failed, refund failed!" });
      }
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

import type { Response } from "express";
import { CreateOrderDTO, VerifyPaymentDTO } from "../dto/payment.dto.js";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";
import { razorpay } from "../../../lib/razorpay.js";
import { prisma } from "@repo/database/client";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import { enqueue } from "../../../queues/enqueue.js";

// Create order handler
export const onCreateOrder = async (req: AuthRequest, res: Response) => {
  // DTO validation
  const result = CreateOrderDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ error: "User id is missing" });
    return;
  }

  try {
    // Validate credit package
    const creditPackage = await prisma.creditPackage.findUnique({
      where: { id: result.data.creditPackageId },
    });
    if (!creditPackage || creditPackage.isActive === false) {
      res.status(400).json({ error: "CreditPackage is not valid" });
      return;
    }

    // Create payment order in DB
    const paymentOrder = await prisma.paymentOrder.create({
      data: {
        userId: userId,
        creditPackageId: creditPackage.id,
        amountInPaise: creditPackage.priceInPaise,
        creditsToGrant: creditPackage.credits,
        status: "CREATED",
      },
    });

    // Create razorpay order
    const options = {
      amount: creditPackage.priceInPaise,
      currency: "INR",
      receipt: paymentOrder.id,
    };
    const order = await razorpay.orders.create(options);

    // Update payment order
    await prisma.paymentOrder.update({
      where: { id: paymentOrder.id },
      data: {
        razorpayOrderId: order.id,
      },
    });

    res.status(200).json({
      order: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentOrderId: paymentOrder.id,
        orderedCredits: creditPackage.credits,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Verify payment and credits update handler
export const onVerifyPayment = async (req: AuthRequest, res: Response) => {
  // DTO validation
  const result = VerifyPaymentDTO.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  const userId = req.userId;
  const userEmail = req.userEmail;
  if (!userId || !userEmail) {
    res.status(400).json({ error: "User details are missing" });
    return;
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderedCredits,
  } = result.data;
  try {
    // Validate razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const isSignatureValid = await validateWebhookSignature(
      body,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET!,
    );

    if (!isSignatureValid) {
      res.status(400).json({ error: "Signature is not valid" });
      return;
    }

    // DB transaction
    await prisma.$transaction(
      async (tx) => {
        // 1. Validate payment order
        const paymentOrder = await tx.paymentOrder.findUnique({
          where: {
            razorpayOrderId: razorpay_order_id,
          },
        });

        if (!paymentOrder) {
          throw new Error("Payment order not found");
        }
        if (paymentOrder.userId !== userId) {
          throw new Error("Unauthorized");
        }
        if (paymentOrder.status === "PAID") {
          throw new Error("Already processed");
        }

        // 2. Update user credits
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: { creditBalance: { increment: paymentOrder.creditsToGrant } },
        });

        // 3. Create new credit ledger
        await tx.creditLedger.create({
          data: {
            userId: userId,
            type: "PURCHASE",
            amount: paymentOrder.creditsToGrant,
            previousBalance:
              updatedUser.creditBalance - paymentOrder.creditsToGrant,
            currentBalance: updatedUser.creditBalance,
            referenceId: razorpay_payment_id,
          },
        });

        // 4. Update payment order
        await tx.paymentOrder.update({
          where: {
            razorpayOrderId: razorpay_order_id,
          },
          data: {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: "PAID",
          },
        });
      },
      {
        maxWait: 15000, // 15 sec required to make transaction request to start
        timeout: 10000, // 10 sec max waits to complete the transaction
      },
    );

    // enqueue email
    await enqueue({
      queue: "email",
      type: "credit-purchase",
      payload: { to: userEmail, credits: orderedCredits },
    });

    res
      .status(200)
      .json({ message: "Payment successful and credits are granted" });
    return;
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

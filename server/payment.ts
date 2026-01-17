import type { Express, Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export function registerPaymentRoutes(app: Express) {
  // Create Order
  app.post("/api/payment/create-order", async (req: Request, res: Response) => {
    try {
      const { amount, currency = "INR", receipt, notes = {} } = req.body;

      // Validation
      if (!amount || amount < 100) {
        return res.status(400).json({
          success: false,
          error: "Amount must be at least 100 paise (₹1)",
        });
      }

      const options = {
        amount: Math.round(amount),
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes,
      };

      const order = await razorpayInstance.orders.create(options);

      res.status(201).json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        },
        key_id: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error: any) {
      console.error("Order creation failed:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create order",
        details: error.message,
      });
    }
  });

  // Verify Payment
  app.post("/api/payment/verify", async (req: Request, res: Response) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;

      // Validation
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          error: "Missing required payment verification parameters",
        });
      }

      // Generate signature for verification
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(body)
        .digest("hex");

      // Compare signatures
      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
        });
      } else {
        console.error("Signature verification failed:", {
          expected: expectedSignature,
          received: razorpay_signature,
        });

        res.status(400).json({
          success: false,
          error: "Payment verification failed - signature mismatch",
        });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      res.status(500).json({
        success: false,
        error: "Payment verification failed",
        details: error.message,
      });
    }
  });
}

import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export function registerFeedbackRoutes(app: Express) {
  app.post(api.feedback.create.path, async (req: Request, res: Response) => {
    try {
      const input = api.feedback.create.input.parse(req.body);
      
      const feedbackData = {
        feedbackReason: input.feedbackReason,
        userAgent: input.userAgent || req.headers["user-agent"] || null,
        ipAddress: req.ip || req.socket.remoteAddress || null,
        referrer: input.referrer || req.headers.referer || null,
        pageUrl: input.pageUrl || null,
      };

      await storage.createPaymentFeedback(feedbackData);

      res.status(201).json({
        success: true,
        message: "Feedback submitted successfully",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Feedback error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

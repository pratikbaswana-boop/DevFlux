import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export function registerAnalyticsRoutes(app: Express) {
  // Create/Start Session
  app.post(api.analytics.createSession.path, async (req: Request, res: Response) => {
    try {
      const input = api.analytics.createSession.input.parse(req.body);
      
      const sessionData = {
        ...input,
        ipAddress: req.ip || req.socket.remoteAddress || null,
        userAgent: input.userAgent || req.headers["user-agent"] || null,
      };

      const session = await storage.createVisitorSession(sessionData);

      res.status(201).json({
        success: true,
        sessionId: session.sessionId,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Analytics session error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // End Session
  app.post(api.analytics.endSession.path, async (req: Request, res: Response) => {
    try {
      const input = api.analytics.endSession.input.parse(req.body);
      
      await storage.updateSessionEnd(input.sessionId, input.sessionDuration);

      res.status(200).json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Analytics session end error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Track Event
  app.post(api.analytics.trackEvent.path, async (req: Request, res: Response) => {
    try {
      const input = api.analytics.trackEvent.input.parse(req.body);
      
      await storage.createAnalyticsEvent(input);

      res.status(201).json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      console.error("Analytics event error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

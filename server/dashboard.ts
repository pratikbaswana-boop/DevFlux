import type { Express, Request, Response, NextFunction } from "express";
import { db } from "./db";
import { visitorSessions, analyticsEvents, paymentFeedback, auditRequests } from "@shared/schema";
import { desc, gte, sql, count } from "drizzle-orm";

// Middleware to validate dashboard secret
function validateSecret(req: Request, res: Response, next: NextFunction) {
  const secret = req.query.secret as string;
  const dashboardSecret = process.env.DASHBOARD_SECRET;

  if (!dashboardSecret) {
    console.error("DASHBOARD_SECRET environment variable not set");
    return res.status(500).json({ message: "Dashboard not configured" });
  }

  if (!secret || secret !== dashboardSecret) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

// Helper to get date filter based on timeFilter query param
function getDateFilter(timeFilter: string): Date | null {
  const now = new Date();
  switch (timeFilter) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "all":
    default:
      return null;
  }
}

export function registerDashboardRoutes(app: Express) {
  // Get aggregated stats
  app.get("/api/dashboard/stats", validateSecret, async (req: Request, res: Response) => {
    try {
      const timeFilter = (req.query.timeFilter as string) || "all";
      const dateFilter = getDateFilter(timeFilter);

      // Sessions stats
      const sessionsQuery = dateFilter
        ? db.select().from(visitorSessions).where(gte(visitorSessions.createdAt, dateFilter))
        : db.select().from(visitorSessions);
      const allSessions = await sessionsQuery;

      // Deduplicate by IP address - keep only first session per unique IP
      const seenIPs = new Set<string>();
      const sessions = allSessions.filter(s => {
        const ip = s.ipAddress || s.visitorId; // fallback to visitorId if no IP
        if (seenIPs.has(ip)) return false;
        seenIPs.add(ip);
        return true;
      });

      const uniqueVisitors = sessions.length; // Now this is unique IPs
      const returningVisitors = sessions.filter(s => s.isReturning).length;
      const avgDuration = sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.sessionDuration || 0), 0) / sessions.length
        : 0;

      // Device breakdown (unique IPs only)
      const devices = { mobile: 0, desktop: 0, tablet: 0 };
      sessions.forEach(s => {
        const type = s.deviceType?.toLowerCase() || "desktop";
        if (type.includes("mobile")) devices.mobile++;
        else if (type.includes("tablet")) devices.tablet++;
        else devices.desktop++;
      });

      // Browser breakdown (unique IPs only)
      const browsers: Record<string, number> = {};
      sessions.forEach(s => {
        const browser = s.browser || "Unknown";
        browsers[browser] = (browsers[browser] || 0) + 1;
      });

      // UTM sources (unique IPs only)
      const utmSources: Record<string, number> = {};
      sessions.forEach(s => {
        const source = s.utmSource || "Direct";
        utmSources[source] = (utmSources[source] || 0) + 1;
      });

      // Top referrers (unique IPs only)
      const referrerCounts: Record<string, number> = {};
      sessions.forEach(s => {
        const referrer = s.referrer || "Direct";
        referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
      });
      const topReferrers = Object.entries(referrerCounts)
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Events stats
      const eventsQuery = dateFilter
        ? db.select().from(analyticsEvents).where(gte(analyticsEvents.createdAt, dateFilter))
        : db.select().from(analyticsEvents);
      const events = await eventsQuery;

      const eventsByType: Record<string, number> = {};
      events.forEach(e => {
        const type = e.eventType || "Unknown";
        eventsByType[type] = (eventsByType[type] || 0) + 1;
      });

      // Feedback stats
      const feedbackQuery = dateFilter
        ? db.select().from(paymentFeedback).where(gte(paymentFeedback.createdAt, dateFilter))
        : db.select().from(paymentFeedback);
      const feedback = await feedbackQuery;

      const feedbackByReason: Record<string, number> = {};
      feedback.forEach(f => {
        const reason = f.feedbackReason || "Unknown";
        feedbackByReason[reason] = (feedbackByReason[reason] || 0) + 1;
      });

      // Audits stats
      const auditsQuery = dateFilter
        ? db.select().from(auditRequests).where(gte(auditRequests.createdAt, dateFilter))
        : db.select().from(auditRequests);
      const audits = await auditsQuery;

      res.json({
        sessions: {
          total: allSessions.length,
          uniqueIPs: sessions.length,
          returningVisitors,
          avgDuration: Math.round(avgDuration),
        },
        events: {
          total: events.length,
          byType: eventsByType,
        },
        feedback: {
          total: feedback.length,
          byReason: feedbackByReason,
        },
        audits: {
          total: audits.length,
        },
        devices,
        browsers,
        utmSources,
        topReferrers,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get raw sessions data
  app.get("/api/dashboard/sessions", validateSecret, async (req: Request, res: Response) => {
    try {
      const timeFilter = (req.query.timeFilter as string) || "all";
      const dateFilter = getDateFilter(timeFilter);

      const query = dateFilter
        ? db.select().from(visitorSessions).where(gte(visitorSessions.createdAt, dateFilter)).orderBy(desc(visitorSessions.createdAt))
        : db.select().from(visitorSessions).orderBy(desc(visitorSessions.createdAt));

      const sessions = await query;
      res.json(sessions);
    } catch (err) {
      console.error("Dashboard sessions error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get raw events data
  app.get("/api/dashboard/events", validateSecret, async (req: Request, res: Response) => {
    try {
      const timeFilter = (req.query.timeFilter as string) || "all";
      const dateFilter = getDateFilter(timeFilter);

      const query = dateFilter
        ? db.select().from(analyticsEvents).where(gte(analyticsEvents.createdAt, dateFilter)).orderBy(desc(analyticsEvents.createdAt))
        : db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.createdAt));

      const events = await query;
      res.json(events);
    } catch (err) {
      console.error("Dashboard events error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get raw feedback data
  app.get("/api/dashboard/feedback", validateSecret, async (req: Request, res: Response) => {
    try {
      const timeFilter = (req.query.timeFilter as string) || "all";
      const dateFilter = getDateFilter(timeFilter);

      const query = dateFilter
        ? db.select().from(paymentFeedback).where(gte(paymentFeedback.createdAt, dateFilter)).orderBy(desc(paymentFeedback.createdAt))
        : db.select().from(paymentFeedback).orderBy(desc(paymentFeedback.createdAt));

      const feedback = await query;
      res.json(feedback);
    } catch (err) {
      console.error("Dashboard feedback error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get raw audit requests
  app.get("/api/dashboard/audits", validateSecret, async (req: Request, res: Response) => {
    try {
      const timeFilter = (req.query.timeFilter as string) || "all";
      const dateFilter = getDateFilter(timeFilter);

      const query = dateFilter
        ? db.select().from(auditRequests).where(gte(auditRequests.createdAt, dateFilter)).orderBy(desc(auditRequests.createdAt))
        : db.select().from(auditRequests).orderBy(desc(auditRequests.createdAt));

      const audits = await query;
      res.json(audits);
    } catch (err) {
      console.error("Dashboard audits error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export CSV
  app.get("/api/dashboard/export/:type", validateSecret, async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const timeFilter = (req.query.timeFilter as string) || "all";
      const dateFilter = getDateFilter(timeFilter);

      let data: any[] = [];
      let filename = "";

      switch (type) {
        case "sessions":
          const sessionsQuery = dateFilter
            ? db.select().from(visitorSessions).where(gte(visitorSessions.createdAt, dateFilter)).orderBy(desc(visitorSessions.createdAt))
            : db.select().from(visitorSessions).orderBy(desc(visitorSessions.createdAt));
          data = await sessionsQuery;
          filename = "sessions.csv";
          break;
        case "events":
          const eventsQuery = dateFilter
            ? db.select().from(analyticsEvents).where(gte(analyticsEvents.createdAt, dateFilter)).orderBy(desc(analyticsEvents.createdAt))
            : db.select().from(analyticsEvents).orderBy(desc(analyticsEvents.createdAt));
          data = await eventsQuery;
          filename = "events.csv";
          break;
        case "feedback":
          const feedbackQuery = dateFilter
            ? db.select().from(paymentFeedback).where(gte(paymentFeedback.createdAt, dateFilter)).orderBy(desc(paymentFeedback.createdAt))
            : db.select().from(paymentFeedback).orderBy(desc(paymentFeedback.createdAt));
          data = await feedbackQuery;
          filename = "feedback.csv";
          break;
        case "audits":
          const auditsQuery = dateFilter
            ? db.select().from(auditRequests).where(gte(auditRequests.createdAt, dateFilter)).orderBy(desc(auditRequests.createdAt))
            : db.select().from(auditRequests).orderBy(desc(auditRequests.createdAt));
          data = await auditsQuery;
          filename = "audits.csv";
          break;
        default:
          return res.status(400).json({ message: "Invalid export type" });
      }

      if (data.length === 0) {
        return res.status(404).json({ message: "No data to export" });
      }

      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(","),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            const stringValue = String(value);
            // Escape quotes and wrap in quotes if contains comma or quote
            if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(",")
        ),
      ];
      const csv = csvRows.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (err) {
      console.error("Dashboard export error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const auditRequests = pgTable("audit_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  teamSize: integer("team_size").notNull(),
  currentSpend: text("current_spend"), // Storing as text to allow flexible input or formatted strings
  challenges: text("challenges"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditRequestSchema = createInsertSchema(auditRequests).omit({
  id: true,
  createdAt: true
});

export type AuditRequest = typeof auditRequests.$inferSelect;
export type InsertAuditRequest = z.infer<typeof insertAuditRequestSchema>;

// Payment schemas
export const createOrderSchema = z.object({
  amount: z.number().min(100, "Amount must be at least 100 paise (₹1)"),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
  notes: z.record(z.string()).optional(),
});

export const verifyPaymentSchema = z.object({
  razorpay_payment_id: z.string(),
  razorpay_order_id: z.string(),
  razorpay_signature: z.string(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

// Payment Feedback schema
export const paymentFeedback = pgTable("payment_feedback", {
  id: serial("id").primaryKey(),
  feedbackReason: text("feedback_reason").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  pageUrl: text("page_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentFeedbackSchema = createInsertSchema(paymentFeedback).omit({
  id: true,
  createdAt: true,
});

export type PaymentFeedback = typeof paymentFeedback.$inferSelect;
export type InsertPaymentFeedback = z.infer<typeof insertPaymentFeedbackSchema>;

// ============================================
// ANALYTICS TRACKING SCHEMAS
// ============================================

// Visitor Sessions - stores session-level data
export const visitorSessions = pgTable("visitor_sessions", {
  id: serial("id").primaryKey(),
  visitorId: text("visitor_id").notNull(),
  sessionId: text("session_id").notNull(),
  
  // UTM Parameters
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  
  // Referrer & Landing
  referrer: text("referrer"),
  landingPage: text("landing_page"),
  
  // Device Info
  deviceType: text("device_type"),
  browser: text("browser"),
  browserVersion: text("browser_version"),
  os: text("os"),
  screenWidth: integer("screen_width"),
  screenHeight: integer("screen_height"),
  
  // Locale
  timezone: text("timezone"),
  language: text("language"),
  
  // Session Data
  isReturning: boolean("is_returning").default(false),
  visitCount: integer("visit_count").default(1),
  sessionStart: timestamp("session_start").defaultNow(),
  sessionEnd: timestamp("session_end"),
  sessionDuration: integer("session_duration"),
  
  // Metadata
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVisitorSessionSchema = createInsertSchema(visitorSessions).omit({
  id: true,
  createdAt: true,
});

export type VisitorSession = typeof visitorSessions.$inferSelect;
export type InsertVisitorSession = z.infer<typeof insertVisitorSessionSchema>;

// Analytics Events - stores all tracked events
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  visitorId: text("visitor_id").notNull(),
  sessionId: text("session_id").notNull(),
  
  // Event Data
  eventType: text("event_type").notNull(),
  eventCategory: text("event_category"),
  eventAction: text("event_action"),
  eventLabel: text("event_label"),
  eventValue: integer("event_value"),
  
  // Context
  pageUrl: text("page_url"),
  elementId: text("element_id"),
  elementText: text("element_text"),
  scrollDepth: integer("scroll_depth"),
  timeOnPage: integer("time_on_page"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

// Session end update schema
export const updateSessionEndSchema = z.object({
  sessionId: z.string(),
  sessionDuration: z.number(),
});

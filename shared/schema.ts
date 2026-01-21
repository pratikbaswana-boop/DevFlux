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

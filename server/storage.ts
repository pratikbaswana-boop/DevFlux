import { auditRequests, type InsertAuditRequest, type AuditRequest, paymentFeedback, type InsertPaymentFeedback, type PaymentFeedback } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAuditRequest(request: InsertAuditRequest): Promise<AuditRequest>;
  createPaymentFeedback(feedback: InsertPaymentFeedback): Promise<PaymentFeedback>;
}

export class DatabaseStorage implements IStorage {
  async createAuditRequest(request: InsertAuditRequest): Promise<AuditRequest> {
    const [auditRequest] = await db.insert(auditRequests).values(request).returning();
    return auditRequest;
  }

  async createPaymentFeedback(feedback: InsertPaymentFeedback): Promise<PaymentFeedback> {
    const [result] = await db.insert(paymentFeedback).values(feedback).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();

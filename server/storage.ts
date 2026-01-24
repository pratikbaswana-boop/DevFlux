import { 
  auditRequests, type InsertAuditRequest, type AuditRequest, 
  paymentFeedback, type InsertPaymentFeedback, type PaymentFeedback,
  visitorSessions, type InsertVisitorSession, type VisitorSession,
  analyticsEvents, type InsertAnalyticsEvent, type AnalyticsEvent
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAuditRequest(request: InsertAuditRequest): Promise<AuditRequest>;
  createPaymentFeedback(feedback: InsertPaymentFeedback): Promise<PaymentFeedback>;
  createVisitorSession(session: InsertVisitorSession): Promise<VisitorSession>;
  updateSessionEnd(sessionId: string, sessionDuration: number): Promise<void>;
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
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

  async createVisitorSession(session: InsertVisitorSession): Promise<VisitorSession> {
    const [result] = await db.insert(visitorSessions).values(session).returning();
    return result;
  }

  async updateSessionEnd(sessionId: string, sessionDuration: number): Promise<void> {
    await db.update(visitorSessions)
      .set({ 
        sessionEnd: new Date(), 
        sessionDuration 
      })
      .where(eq(visitorSessions.sessionId, sessionId));
  }

  async createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [result] = await db.insert(analyticsEvents).values(event).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();

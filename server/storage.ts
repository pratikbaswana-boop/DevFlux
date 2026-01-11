import { auditRequests, type InsertAuditRequest, type AuditRequest } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAuditRequest(request: InsertAuditRequest): Promise<AuditRequest>;
}

export class DatabaseStorage implements IStorage {
  async createAuditRequest(request: InsertAuditRequest): Promise<AuditRequest> {
    const [auditRequest] = await db.insert(auditRequests).values(request).returning();
    return auditRequest;
  }
}

export const storage = new DatabaseStorage();

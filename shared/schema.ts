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

import { z } from 'zod';
import { 
  insertAuditRequestSchema, auditRequests, 
  insertPaymentFeedbackSchema, paymentFeedback,
  insertVisitorSessionSchema, visitorSessions,
  insertAnalyticsEventSchema, analyticsEvents,
  updateSessionEndSchema
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  audit: {
    create: {
      method: 'POST' as const,
      path: '/api/audit-requests',
      input: insertAuditRequestSchema,
      responses: {
        201: z.custom<typeof auditRequests.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  feedback: {
    create: {
      method: 'POST' as const,
      path: '/api/feedback',
      input: insertPaymentFeedbackSchema,
      responses: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  analytics: {
    createSession: {
      method: 'POST' as const,
      path: '/api/analytics/session',
      input: insertVisitorSessionSchema,
      responses: {
        201: z.object({ success: z.boolean(), sessionId: z.string() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    endSession: {
      method: 'POST' as const,
      path: '/api/analytics/session/end',
      input: updateSessionEndSchema,
      responses: {
        200: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    trackEvent: {
      method: 'POST' as const,
      path: '/api/analytics/event',
      input: insertAnalyticsEventSchema,
      responses: {
        201: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type InsertAuditRequest = z.infer<typeof api.audit.create.input>;
export type AuditRequestResponse = z.infer<typeof api.audit.create.responses[201]>;

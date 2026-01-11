import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertAuditRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCreateAuditRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertAuditRequest) => {
      const res = await fetch(api.audit.create.path, {
        method: api.audit.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit audit request");
      }

      return api.audit.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Audit Request Sent",
        description: "We'll be in touch with your customized report shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

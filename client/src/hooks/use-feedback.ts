import { useMutation } from "@tanstack/react-query";

interface FeedbackResponse {
  success: boolean;
  message: string;
}

interface FeedbackData {
  feedbackReason: string;
  userAgent?: string;
  referrer?: string;
  pageUrl?: string;
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: async (data: FeedbackData): Promise<FeedbackResponse> => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          pageUrl: window.location.href,
        }),
      });
      return response.json();
    },
  });
}

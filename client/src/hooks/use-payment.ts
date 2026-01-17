import { useMutation } from "@tanstack/react-query";

interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  key_id: string;
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  payment_id: string;
  order_id: string;
  download_token?: string;
  download_expires?: number;
  error?: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data: {
      amount: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
    }): Promise<CreateOrderResponse> => {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (data: RazorpayResponse): Promise<VerifyPaymentResponse> => {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  });
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateOrder, useVerifyPayment } from "@/hooks/use-payment";
import { Loader2 } from "lucide-react";
import { PaymentStatusModal } from "@/components/PaymentStatusModal";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BuyNowButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  amount?: number;
  productName?: string;
}

export function BuyNowButton({
  children,
  className,
  size = "default",
  variant = "default",
  amount = 100,
  productName = "DevFlux Subscription",
}: BuyNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure" | "cancelled">("success");
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const handlePayment = async () => {
    setLoading(true);

    try {
      const orderData = await createOrder.mutateAsync({
        amount: amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          product: productName,
        },
      });

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "DevFlux",
        description: productName,
        order_id: orderData.order.id,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyData = await verifyPayment.mutateAsync(response);

            if (verifyData.success) {
              setPaymentId(response.razorpay_payment_id);
              setPaymentStatus("success");
              setModalOpen(true);
            } else {
              setErrorMessage("Payment verification failed. Please contact support.");
              setPaymentStatus("failure");
              setModalOpen(true);
            }
          } catch (error) {
            console.error("Verification error:", error);
            setErrorMessage("Payment verification failed. Please contact support.");
            setPaymentStatus("failure");
            setModalOpen(true);
          }
          setLoading(false);
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("cancelled");
            setModalOpen(true);
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setErrorMessage(response.error.description || "Payment failed. Please try again.");
        setPaymentStatus("failure");
        setModalOpen(true);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("Could not initiate payment. Please try again.");
      setPaymentStatus("failure");
      setModalOpen(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handlePayment}
        disabled={loading}
        className={className}
        size={size}
        variant={variant}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          children
        )}
      </Button>

      <PaymentStatusModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        status={paymentStatus}
        paymentId={paymentId}
        errorMessage={errorMessage}
      />
    </>
  );
}

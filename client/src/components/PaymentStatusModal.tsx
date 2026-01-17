import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PaymentStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: "success" | "failure" | "cancelled";
  paymentId?: string;
  orderId?: string;
  errorMessage?: string;
  downloadToken?: string;
}

const modalVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const contentStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const contentItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const shakeAnimation = {
  x: [-8, 8, -6, 6, 0],
  transition: { duration: 0.4 },
};

function SuccessIcon() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      {/* Ring burst */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-green-500"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
      
      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            marginLeft: -4,
            marginTop: -4,
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * Math.PI * 2) / 8) * 60,
            y: Math.sin((i * Math.PI * 2) / 8) * 60,
          }}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
        />
      ))}
      
      {/* Checkmark circle */}
      <motion.div
        className="absolute inset-0 bg-green-500/20 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      >
        <svg
          className="w-12 h-12 text-green-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

function FailureIcon() {
  return (
    <motion.div
      className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, ...shakeAnimation }}
    >
      <X className="w-12 h-12 text-red-500" />
    </motion.div>
  );
}

function CancelledIcon() {
  return (
    <motion.div
      className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AlertTriangle className="w-12 h-12 text-yellow-500" />
    </motion.div>
  );
}

export function PaymentStatusModal({
  open,
  onOpenChange,
  status,
  paymentId,
  orderId,
  errorMessage,
  downloadToken,
}: PaymentStatusModalProps) {
  const handleDownload = () => {
    if (downloadToken) {
      const downloadUrl = `/api/download/${downloadToken}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "devflux-package.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const statusConfig = {
    success: {
      icon: <SuccessIcon />,
      title: "Payment Successful!",
      description: "Thank you for your purchase. Your subscription is now active.",
      buttonText: "Continue",
      buttonClass: "bg-green-600 hover:bg-green-700",
    },
    failure: {
      icon: <FailureIcon />,
      title: "Payment Failed",
      description: errorMessage || "Something went wrong with your payment. Please try again.",
      buttonText: "Try Again",
      buttonClass: "bg-red-600 hover:bg-red-700",
    },
    cancelled: {
      icon: <CancelledIcon />,
      title: "Payment Cancelled",
      description: "Your payment was cancelled. No charges were made.",
      buttonText: "Try Again",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700",
    },
  };

  const config = statusConfig[status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[420px] bg-black/95 border-white/10 backdrop-blur-xl text-white overflow-hidden">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                variants={contentStagger}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center text-center py-6"
              >
                <motion.div variants={contentItem}>
                  {config.icon}
                </motion.div>

                <DialogHeader className="mt-6">
                  <motion.div variants={contentItem}>
                    <DialogTitle className="text-2xl font-display font-bold text-center">
                      {config.title}
                    </DialogTitle>
                  </motion.div>
                  <motion.div variants={contentItem}>
                    <DialogDescription className="text-gray-400 text-center mt-2">
                      {config.description}
                    </DialogDescription>
                  </motion.div>
                </DialogHeader>

                {status === "success" && paymentId && (
                  <motion.div
                    variants={contentItem}
                    className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10 w-full"
                  >
                    <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                    <p className="text-sm font-mono text-gray-300 break-all">{paymentId}</p>
                  </motion.div>
                )}

                {status === "success" && downloadToken && (
                  <motion.div variants={contentItem} className="mt-4 w-full">
                    <Button
                      onClick={handleDownload}
                      className="w-full py-4 text-base font-semibold bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Your Package
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Your download should start automatically. Click above if it doesn't.
                    </p>
                  </motion.div>
                )}

                <motion.div variants={contentItem} className="mt-6 w-full">
                  <Button
                    onClick={() => onOpenChange(false)}
                    className={`w-full py-6 text-lg font-semibold ${config.buttonClass}`}
                  >
                    {config.buttonText}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Download, DollarSign, Eye, Sparkles, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSubmitFeedback } from "@/hooks/use-feedback";

interface PaymentStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: "success" | "failure" | "cancelled";
  paymentId?: string;
  orderId?: string;
  errorMessage?: string;
  downloadToken?: string;
}

const feedbackOptions = [
  { id: "too_expensive", label: "Too expensive", icon: DollarSign },
  { id: "just_browsing", label: "Just browsing", icon: Eye },
  { id: "need_more_features", label: "Need more features", icon: Sparkles },
  { id: "will_buy_later", label: "Will buy later", icon: Clock },
];

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

const flipTransition = {
  duration: 0.8,
  ease: [0.4, 0, 0.2, 1],
};

const frontVariants = {
  initial: { 
    rotateY: 0,
    opacity: 1,
  },
  flipped: { 
    rotateY: 180,
    opacity: 0,
    transition: flipTransition,
  }
};

const backVariants = {
  initial: { 
    rotateY: -180,
    opacity: 0,
  },
  flipped: { 
    rotateY: 0,
    opacity: 1,
    transition: flipTransition,
  }
};

const feedbackContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const feedbackCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const thankYouVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.1, 1], 
    opacity: 1,
    transition: { type: "spring", stiffness: 200 }
  }
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const submitFeedback = useSubmitFeedback();

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

  const handleCancel = () => {
    setIsFlipped(true);
  };

  const handleFeedbackSelect = async (feedbackId: string) => {
    try {
      await submitFeedback.mutateAsync({ feedbackReason: feedbackId });
      setShowThankYou(true);
      setTimeout(() => {
        onOpenChange(false);
        setIsFlipped(false);
        setShowThankYou(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      onOpenChange(false);
      setIsFlipped(false);
    }
  };

  const handleSkipFeedback = () => {
    onOpenChange(false);
    setIsFlipped(false);
    setShowThankYou(false);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setIsFlipped(false);
      setShowThankYou(false);
    }
    onOpenChange(open);
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
    <Dialog open={open} onOpenChange={handleModalClose}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-[420px] bg-transparent border-none shadow-none text-white overflow-visible p-0">
            <div 
              className="relative w-full"
              style={{ 
                perspective: "1200px",
                perspectiveOrigin: "center",
              }}
            >
              {/* Flip Container */}
              <motion.div
                className="relative w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ 
                  rotateY: isFlipped ? 180 : 0,
                }}
                transition={flipTransition}
              >
                {/* Front Side - Payment Status */}
                <div
                  className={`w-full rounded-2xl bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl p-6 ${isFlipped ? "pointer-events-none" : ""}`}
                  style={{ 
                    backfaceVisibility: "hidden",
                  }}
                >
                  <motion.div
                    variants={contentStagger}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center"
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

                    <motion.div variants={contentItem} className="mt-6 w-full space-y-3">
                      <Button
                        onClick={() => onOpenChange(false)}
                        className={`w-full py-6 text-lg font-semibold ${config.buttonClass}`}
                      >
                        {config.buttonText}
                      </Button>
                      
                      {status === "cancelled" && (
                        <Button
                          onClick={handleCancel}
                          variant="ghost"
                          className="w-full py-4 text-base text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                        >
                          Cancel
                        </Button>
                      )}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Back Side - Feedback Cards */}
                <div
                  className={`absolute inset-0 w-full rounded-2xl bg-slate-900/95 border border-slate-700/50 backdrop-blur-xl p-6 ${!isFlipped ? "pointer-events-none" : ""}`}
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {showThankYou ? (
                    <motion.div
                      variants={thankYouVariants}
                      initial="initial"
                      animate="animate"
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <div className="relative">
                        <motion.div
                          className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.5, repeat: 2 }}
                        >
                          <Heart className="w-10 h-10 text-indigo-400" />
                        </motion.div>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-indigo-400 rounded-full"
                            style={{
                              left: "50%",
                              top: "50%",
                              marginLeft: -4,
                              marginTop: -4,
                            }}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: Math.cos((i * Math.PI * 2) / 6) * 50,
                              y: Math.sin((i * Math.PI * 2) / 6) * 50,
                            }}
                            transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
                          />
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold text-white mt-4">Thank you!</h3>
                      <p className="text-gray-400 text-sm mt-1">Your feedback helps us improve</p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-white">
                          Why did you decide not to purchase today?
                        </h3>
                        <p className="text-gray-400 text-sm mt-2">
                          Your feedback helps us improve
                        </p>
                      </div>

                      <motion.div
                        variants={feedbackContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 gap-3 px-2"
                      >
                        {feedbackOptions.map((option) => {
                          const Icon = option.icon;
                          const isHovered = hoveredCard === option.id;
                          return (
                            <motion.button
                              key={option.id}
                              variants={feedbackCardVariants}
                              onClick={() => handleFeedbackSelect(option.id)}
                              onMouseEnter={() => setHoveredCard(option.id)}
                              onMouseLeave={() => setHoveredCard(null)}
                              whileHover={{ 
                                scale: 1.05, 
                                y: -8,
                              }}
                              whileTap={{ scale: 0.98 }}
                              className="relative p-4 rounded-xl border border-white/10 flex flex-col items-center gap-3 transition-all duration-150"
                              style={{
                                background: isHovered 
                                  ? "linear-gradient(135deg, #0f3460, #1a1a2e)" 
                                  : "linear-gradient(135deg, #1a1a2e, #16213e)",
                                boxShadow: isHovered 
                                  ? "0 0 20px rgba(99, 102, 241, 0.3), 0 10px 40px rgba(0,0,0,0.4)"
                                  : "0 4px 20px rgba(0,0,0,0.2)"
                              }}
                            >
                              <motion.div
                                animate={isHovered ? { 
                                  rotate: [0, -10, 10, 0], 
                                  scale: 1.2 
                                } : { rotate: 0, scale: 1 }}
                                transition={{ duration: 0.4 }}
                              >
                                <Icon className="w-8 h-8 text-indigo-400" />
                              </motion.div>
                              <span className="text-sm font-medium text-white text-center">
                                {option.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>

                      <div className="mt-6 text-center">
                        <button
                          onClick={handleSkipFeedback}
                          className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-150"
                        >
                          Skip feedback
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

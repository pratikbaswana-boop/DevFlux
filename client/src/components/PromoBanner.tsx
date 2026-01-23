import { Zap, X } from "lucide-react";
import { useState } from "react";

interface PromoBannerProps {
  onScrollToPricing?: () => void;
}

export function PromoBanner({ onScrollToPricing }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClick = () => {
    if (onScrollToPricing) {
      onScrollToPricing();
    } else {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary/90 via-secondary/90 to-primary/90 text-white py-2 px-4 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
        <Zap className="w-4 h-4 animate-pulse" />
        <span className="font-medium">
          🚀 <strong>Launch Week Special:</strong> Get 40% off — Limited time only!
        </span>
        <button
          onClick={handleClick}
          className="bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded-full text-xs font-bold border border-white/30"
        >
          Claim Offer
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

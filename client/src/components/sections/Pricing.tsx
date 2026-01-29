import { Check, Users, ShoppingCart, Zap } from "lucide-react";
import { BuyNowButton } from "@/components/BuyNowButton";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

// Set offer end date to 7 days from now (you can adjust this)
const OFFER_END_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const features = [
  "6 battle-tested workflow files",
  "Works with Cursor, Windsurf, Claude & more",
  "Instant download after purchase",
  "Lifetime access to all workflows",
  "Future updates included",
  "Setup guide & documentation"
];

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTracked = useRef(false);
  const { trackPricingView } = useAnalytics();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            trackPricingView();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [trackPricingView]);

  return (
    <section ref={sectionRef} className="py-24 bg-black relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400">
            No hidden fees. ROI guaranteed in the first month.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative flex flex-col p-10 rounded-2xl border bg-primary/5 border-primary shadow-2xl shadow-primary/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/30">
              <Zap className="w-3 h-3" />
              LAUNCH SPECIAL
            </div>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-gray-400">One-Time Payment / Lifetime Access</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl text-gray-500 line-through">$19</span>
                <div className="text-6xl font-bold text-white">$9</div>
                <span className="bg-green-500/20 text-green-400 text-sm font-bold px-2 py-1 rounded-full">53% OFF</span>
              </div>
              <p className="text-gray-400 mb-4">Scale your team without scaling costs</p>
              <CountdownTimer targetDate={OFFER_END_DATE} />
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <BuyNowButton className="w-full bg-primary hover:bg-primary/90 text-lg py-6">
              Buy Now <ShoppingCart className="ml-2 h-5 w-5" />
            </BuyNowButton>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Check, Users, ShoppingCart } from "lucide-react";
import { BuyNowButton } from "@/components/BuyNowButton";

const features = [
  "Full workflow automation",
  "14-day implementation",
  "Dedicated training sessions",
  "Slack/Teams support channel",
  "Custom workflow creation",
  "Quarterly updates included",
  "Real-time analytics dashboard",
  "Priority support"
];

export function Pricing() {
  return (
    <section className="py-24 bg-black relative">
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">
              PER DEVELOPER
            </div>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-gray-400">Per Developer / Month</span>
              </div>
              <div className="text-6xl font-bold mb-2">₹899</div>
              <p className="text-gray-400">Scale your team without scaling costs</p>
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

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditModal } from "@/components/AuditModal";

const plans = [
  {
    name: "Quick Start",
    price: "$999",
    desc: "Perfect for small teams dipping their toes.",
    features: ["Audit of current tools", "3 Custom Workflows", "1 Training Session", "Slack Support"],
  },
  {
    name: "Growth",
    price: "$2,499",
    desc: "For companies ready to scale adoption.",
    popular: true,
    features: ["Full Tech Stack Audit", "10 Custom Workflows", "3 Department Trainings", "Dedicated Success Manager", "Monthly Optimization"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Full transformation for large orgs.",
    features: ["Unlimited Workflows", "Custom LLM Fine-tuning", "Security & Compliance", "24/7 Priority Support", "On-premise Deployment"],
  },
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                plan.popular 
                  ? "bg-primary/5 border-primary shadow-2xl shadow-primary/10 scale-105 z-10" 
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-300 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">{plan.price}</div>
                <p className="text-sm text-gray-500">{plan.desc}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <AuditModal>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90" 
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Get Started
                </Button>
              </AuditModal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

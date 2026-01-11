import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Workflows } from "@/components/sections/Workflows";
import { ROICalculator } from "@/components/sections/ROICalculator";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { AuditModal } from "@/components/AuditModal";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-display font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              F
            </div>
            Fyndfox
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#problems" className="hover:text-white transition-colors">Problems</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <AuditModal>
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
              Book Audit
            </Button>
          </AuditModal>
        </div>
      </nav>

      <main>
        <Hero />
        
        <div id="problems">
          <Problem />
        </div>

        {/* Comparison Section (Inline for simplicity) */}
        <section className="py-24 bg-zinc-950/50">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-16">
              The Difference Is <span className="text-primary">Day & Night</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-0 max-w-5xl mx-auto border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-12 bg-red-500/5 border-b md:border-b-0 md:border-r border-white/10">
                <h3 className="text-2xl font-bold text-red-400 mb-8">Before Fyndfox</h3>
                <ul className="space-y-4">
                  {[
                    "Tools gathering dust",
                    "Security leaks via ChatGPT",
                    "Zero process documentation",
                    "Manual data re-entry"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400">
                      <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-sm">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-12 bg-green-500/5">
                <h3 className="text-2xl font-bold text-green-400 mb-8">After Fyndfox</h3>
                <ul className="space-y-4">
                  {[
                    "90% Adoption Rate",
                    "Enterprise-grade Security",
                    "Automated Workflow Playbooks",
                    "Real-time Data Sync"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <span className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-sm">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div id="solutions">
          <Workflows />
        </div>

        <ROICalculator />
        
        <div id="pricing">
          <Pricing />
        </div>

        {/* Guarantee Section */}
        <section className="py-24 bg-black">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Award, title: "100% Satisfaction", desc: "Love our audit or get a full refund." },
                { icon: Clock, title: "14-Day Sprint", desc: "Results delivered in two weeks, flat." },
                { icon: ShieldCheck, title: "Zero Risk", desc: "No long-term lock-in contracts." },
              ].map((item, i) => (
                <div key={i} className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-primary mb-6">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQ />

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-primary/20 -z-10" />
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
              Stop Losing Money.<br />Start Here.
            </h2>
            <AuditModal>
              <Button size="lg" className="h-16 px-10 text-xl bg-white text-black hover:bg-gray-200 rounded-full font-bold shadow-2xl shadow-white/10">
                Book Your Audit Now <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </AuditModal>
            <p className="mt-6 text-sm text-gray-400">
              Only 2 implementation slots left for this month.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black text-center text-gray-500 text-sm">
        <p>© 2024 Fyndfox. All rights reserved.</p>
      </footer>
    </div>
  );
}

import { Hero } from "@/components/sections/Hero";
import { CommandsSection } from "@/components/sections/CommandsSection";
import { SetupSection } from "@/components/sections/SetupSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { BuyNowButton } from "@/components/BuyNowButton";
import { PromoBanner } from "@/components/PromoBanner";
import { ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* Navigation - adjusted top position to account for banner */}
      <nav className="fixed top-10 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-display font-bold flex items-center gap-2">
            <img src="/logo.svg" alt="DevFlux" className="h-10 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#commands" className="hover:text-white transition-colors">Commands</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <BuyNowButton size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
              Buy Now
            </BuyNowButton>
        </div>
      </nav>

      <main>
        {/* Section 1: Hero (Above fold) */}
        <Hero />
        
        {/* Section 2: 6 Commands */}
        <div id="commands">
          <CommandsSection />
        </div>

        {/* Section 3: How It Works (3 steps) */}
        <div id="how-it-works">
          <SetupSection />
        </div>

        {/* Section 4: Proof */}
        <ProofSection />
        
        {/* Section 5: Pricing */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* Section 6: FAQ */}
        <FAQ />

        {/* Final CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-primary/20 -z-10" />
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
              Stop Prompting.<br />Start Commanding.
            </h2>
            <BuyNowButton size="lg" className="h-16 px-10 text-xl bg-white text-black hover:bg-gray-200 rounded-full font-bold shadow-2xl shadow-white/10">
              Get 6 Workflows - $11 <ShoppingCart className="ml-2 h-6 w-6" />
            </BuyNowButton>
            <p className="mt-6 text-sm text-gray-400">
              One-time payment • Lifetime access • Works with Cursor, Windsurf & Claude
            </p>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-black text-center text-gray-500 text-sm">
        <p>© 2026 DevFlux. All rights reserved.</p>
      </footer>
    </div>
  );
}

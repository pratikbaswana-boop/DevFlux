import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ShoppingCart, X, Check, ArrowDown } from "lucide-react";
import { BuyNowButton } from "@/components/BuyNowButton";
import { TerminalDemo } from "@/components/TerminalDemo";

const messageBubbleVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

function WithoutDevFluxCard() {
  return (
    <div 
      className="p-4 md:p-6 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)",
        border: "1px solid rgba(239, 68, 68, 0.2)"
      }}
    >
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <X className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
        <h3 className="text-base md:text-lg font-bold text-red-400">Without DevFlux</h3>
      </div>
      <div className="space-y-2 md:space-y-3 font-mono text-xs md:text-sm">
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="bg-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-gray-400">Dev:</span> <span className="text-white">"Fix this payment bug"</span>
        </motion.div>
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="bg-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-gray-500">AI:</span> <span className="text-gray-400">"Maybe check the database?"</span>
        </motion.div>
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.2 }} className="bg-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-gray-400">Dev:</span> <span className="text-white">"That's not it..."</span>
        </motion.div>
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.6 }} className="bg-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-gray-500">AI:</span> <span className="text-gray-400">"Caching issue?"</span>
        </motion.div>
      </div>
      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-red-500/20">
        <p className="text-red-400 font-bold text-sm md:text-base">⏱️ 3 hours of guessing</p>
        <p className="text-gray-500 text-xs md:text-sm">❌ Still no root cause</p>
      </div>
    </div>
  );
}

function WithDevFluxCard() {
  return (
    <div 
      className="p-4 md:p-6 rounded-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.02) 100%)",
        border: "1px solid rgba(34, 197, 94, 0.3)",
        boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)"
      }}
    >
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Check className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
        <h3 className="text-base md:text-lg font-bold text-green-400">With DevFlux</h3>
      </div>
      <div className="space-y-2 md:space-y-3 font-mono text-xs md:text-sm">
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="bg-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-gray-400">Dev:</span> <span className="text-primary font-bold">/complex-issue</span> <span className="text-white">+ desc</span>
        </motion.div>
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.9 }} className="bg-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-primary font-bold">AI:</span> <span className="text-gray-300">[5-step analysis]</span>
        </motion.div>
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.3 }} className="bg-white/5 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-white">"Root cause: Race condition"</span>
        </motion.div>
        <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.7 }} className="bg-green-500/10 rounded-lg px-2 md:px-3 py-1.5 md:py-2">
          <span className="text-green-400">"Here's the fix + tests"</span>
        </motion.div>
      </div>
      <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-green-500/20">
        <p className="text-green-400 font-bold text-sm md:text-base">⏱️ 15 minutes</p>
        <p className="text-white text-xs md:text-sm font-medium">✅ Done. Verified. Tested.</p>
      </div>
    </div>
  );
}

export function Hero() {
  const [activeTab, setActiveTab] = useState<'without' | 'with'>('without');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 md:pt-32 pb-12 md:pb-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

      <div className="container px-4 mx-auto relative z-10">
        {/* Social Proof Badge - FIRST ELEMENT, fully visible */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 
                          bg-white/5 border border-white/10 rounded-full
                          text-xs md:text-sm text-gray-300">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            <span className="whitespace-nowrap">Used by 90 developers shipping 10x faster</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          {/* Headlines */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-400">
            Stop Babysitting Your AI. <br className="hidden sm:block" />
            <span className="text-primary text-glow">Start Shipping.</span>
          </h1>
          
          <p className="text-base md:text-xl lg:text-2xl text-gray-400 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            <span className="text-white font-medium">6 workflow commands</span> that turn Cursor & Windsurf into senior developers
          </p>
        </motion.div>

        {/* Before/After Comparison - Issue 1: Tabs on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-8 md:mb-12"
        >
          {/* Mobile: Tab switcher */}
          <div className="md:hidden flex gap-2 mb-4">
            <button 
              onClick={() => setActiveTab('without')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'without' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'bg-white/5 text-gray-400 border border-transparent'
              }`}
            >
              ✕ Without DevFlux
            </button>
            <button 
              onClick={() => setActiveTab('with')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'with' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-white/5 text-gray-400 border border-transparent'
              }`}
            >
              ✓ With DevFlux
            </button>
          </div>

          {/* Mobile: Show only active tab */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'without' ? (
                <motion.div
                  key="without"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <WithoutDevFluxCard />
                </motion.div>
              ) : (
                <motion.div
                  key="with"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <WithDevFluxCard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop: Side-by-side */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <WithoutDevFluxCard />
            <WithDevFluxCard />
          </div>
        </motion.div>

        {/* Terminal Demo - Issue 3: Smaller on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 md:mb-12"
        >
          <TerminalDemo />
        </motion.div>

        {/* CTA - Issue 9: Full width on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center px-2 md:px-0"
        >
          <div className="max-w-[320px] md:max-w-none mx-auto">
            <BuyNowButton size="lg" className="w-full md:w-auto h-14 md:h-16 px-6 md:px-10 text-lg md:text-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl border-t border-white/20">
              <ShoppingCart className="mr-2 h-5 w-5 md:h-6 md:w-6" /> Get 6 Workflows - $9
            </BuyNowButton>
          </div>
          <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">One-time payment • Lifetime access • Works with Cursor, Windsurf & Claude</p>
        </motion.div>
      </div>
    </section>
  );
}

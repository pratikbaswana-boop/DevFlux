import { motion } from "framer-motion";
import { ShoppingCart, X, Check } from "lucide-react";
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

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">Used by 90 developers shipping 10x faster</span>
          </div>

          {/* Headlines */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-400">
            Stop Babysitting Your AI. <br className="hidden md:block" />
            <span className="text-primary text-glow">Start Shipping.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="text-white font-medium">6 workflow commands</span> that turn Cursor & Windsurf into senior developers
          </p>
        </motion.div>

        {/* Before/After Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto mb-12"
        >
          {/* WITHOUT DevFlux - Left Panel */}
          <div 
            className="p-6 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.02) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <X className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">Without DevFlux</h3>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="bg-white/5 rounded-lg px-3 py-2">
                <span className="text-gray-400">Dev:</span> <span className="text-white">"Fix this payment bug"</span>
              </motion.div>
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.8 }} className="bg-white/5 rounded-lg px-3 py-2">
                <span className="text-gray-500">AI:</span> <span className="text-gray-400">"Maybe check the database connection?"</span>
              </motion.div>
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.2 }} className="bg-white/5 rounded-lg px-3 py-2">
                <span className="text-gray-400">Dev:</span> <span className="text-white">"That's not it..."</span>
              </motion.div>
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.6 }} className="bg-white/5 rounded-lg px-3 py-2">
                <span className="text-gray-500">AI:</span> <span className="text-gray-400">"Could be a caching issue?"</span>
              </motion.div>
            </div>
            <div className="mt-4 pt-4 border-t border-red-500/20">
              <p className="text-red-400 font-bold">⏱️ 3 hours of guessing</p>
              <p className="text-gray-500 text-sm">❌ Still no root cause</p>
            </div>
          </div>

          {/* WITH DevFlux - Right Panel */}
          <div 
            className="p-6 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.02) 100%)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)"
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-green-400">With DevFlux</h3>
            </div>
            <div className="space-y-3 font-mono text-sm">
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="bg-white/5 rounded-lg px-3 py-2">
                <span className="text-gray-400">Dev:</span> <span className="text-primary font-bold">/complex-issue</span> <span className="text-white">+ description</span>
              </motion.div>
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 0.9 }} className="bg-white/5 rounded-lg px-3 py-2">
                <span className="text-primary font-bold">AI:</span> <span className="text-gray-300">[Systematic 5-step analysis]</span>
              </motion.div>
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.3 }} className="bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white">"Root cause: Race condition at line 247"</span>
              </motion.div>
              <motion.div variants={messageBubbleVariants} initial="hidden" animate="visible" transition={{ delay: 1.7 }} className="bg-green-500/10 rounded-lg px-3 py-2">
                <span className="text-green-400">"Here's the fix + tests"</span>
              </motion.div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-500/20">
              <p className="text-green-400 font-bold">⏱️ 15 minutes</p>
              <p className="text-white text-sm font-medium">✅ Done. Verified. Tested.</p>
            </div>
          </div>
        </motion.div>

        {/* Terminal Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <TerminalDemo />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <BuyNowButton size="lg" className="h-16 px-10 text-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl border-t border-white/20">
            <ShoppingCart className="mr-2 h-6 w-6" /> Get 6 Workflows - ₹899
          </BuyNowButton>
          <p className="mt-4 text-sm text-gray-500">One-time payment • Lifetime access • Works with Cursor, Windsurf & Claude</p>
        </motion.div>
      </div>
    </section>
  );
}

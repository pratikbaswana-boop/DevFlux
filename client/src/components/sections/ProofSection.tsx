import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";

const beforeItems = [
  "AI outputs need constant fixing",
  "More time debugging than coding",
  "\"Works in tutorials, breaks on my codebase\"",
  "10% of prompts actually usable",
  "Developers avoiding AI tools",
  "Shipping slower than before AI"
];

const afterItems = [
  "AI outputs ship-ready code",
  "Devs code, AI assists (not reverse)",
  "Works on YOUR codebase, day 1",
  "90% success rate on prompts",
  "Daily active usage across team",
  "10x faster feature delivery"
];

const scrollRevealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.04, 0.62, 0.23, 0.98]
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

function BeforeList() {
  return (
    <div 
      className="p-6 md:p-12 rounded-2xl md:rounded-none"
      style={{
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)",
      }}
    >
      <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-6 md:mb-8 flex items-center gap-2">
        <X className="w-5 h-5 md:w-6 md:h-6" />
        BEFORE DevFlux
      </h3>
      <ul className="space-y-3 md:space-y-4">
        {beforeItems.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-3 text-gray-400 text-sm md:text-base"
          >
            <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-xs md:text-sm shrink-0">
              ✕
            </span>
            {item}
          </motion.li>
        ))}
      </ul>
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
        <p className="text-red-400 font-bold text-base md:text-lg">⏱️ 3+ hours per bug</p>
        <p className="text-gray-500 text-xs md:text-sm mt-1">Constant back-and-forth with AI</p>
      </div>
    </div>
  );
}

function AfterList() {
  return (
    <div 
      className="p-6 md:p-12 rounded-2xl md:rounded-none"
      style={{
        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%)",
        boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)"
      }}
    >
      <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-6 md:mb-8 flex items-center gap-2">
        <Check className="w-5 h-5 md:w-6 md:h-6" />
        AFTER DevFlux
      </h3>
      <ul className="space-y-3 md:space-y-4">
        {afterItems.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-3 text-white font-medium text-sm md:text-base"
          >
            <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-xs md:text-sm shrink-0">
              ✓
            </span>
            {item}
          </motion.li>
        ))}
      </ul>
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
        <p className="text-green-400 font-bold text-base md:text-lg">⏱️ 15 minutes average</p>
        <p className="text-gray-400 text-xs md:text-sm mt-1">Done. Verified. Tested.</p>
      </div>
    </div>
  );
}

export function ProofSection() {
  const [proofTab, setProofTab] = useState<'before' | 'after'>('before');

  return (
    <section className="py-16 md:py-24 bg-zinc-950/50 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl md:text-5xl font-display font-bold mb-3 md:mb-4">
            Real Numbers. <span className="text-primary">90-Person Team.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            These results are from a real engineering team using DevFlux workflows daily.
          </p>
        </motion.div>

        {/* Mobile: Tabs */}
        <div className="md:hidden mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setProofTab('before')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                proofTab === 'before' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50' 
                  : 'bg-white/5 text-gray-400 border border-transparent'
              }`}
            >
              ✕ BEFORE
            </button>
            <button 
              onClick={() => setProofTab('after')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                proofTab === 'after' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-white/5 text-gray-400 border border-transparent'
              }`}
            >
              ✓ AFTER
            </button>
          </div>
        </div>

        {/* Mobile: Tab content */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={proofTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {proofTab === 'before' ? <BeforeList /> : <AfterList />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: Side-by-side */}
        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="hidden md:grid md:grid-cols-2 gap-0 max-w-5xl mx-auto rounded-3xl overflow-hidden"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div style={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <BeforeList />
          </div>
          <AfterList />
        </motion.div>

        {/* FyndFox Card - Issue 10: Better mobile styling */}
        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-10 md:mt-16"
        >
          <a 
            href="https://fyndfox.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 md:gap-4 p-4 md:p-5 mx-auto max-w-md
                       bg-gradient-to-r from-purple-500/10 to-transparent
                       border border-purple-500/30 rounded-xl
                       hover:border-purple-500/50 transition-all group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/20 
                            flex items-center justify-center flex-shrink-0 text-2xl">
              🚀
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs md:text-sm">Proof: We built</p>
              <p className="text-white font-semibold text-sm md:text-base truncate">
                fyndfox.com <span className="text-purple-400">in 2 weeks</span>
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Using these exact workflows</p>
            </div>
            <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-purple-400 
                                     group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

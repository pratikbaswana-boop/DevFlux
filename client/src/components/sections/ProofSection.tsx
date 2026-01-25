import { motion } from "framer-motion";
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

export function ProofSection() {
  return (
    <section className="py-24 bg-zinc-950/50 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Real Numbers. <span className="text-primary">90-Person Team.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            These results are from a real engineering team using DevFlux workflows daily.
          </p>
        </motion.div>

        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-0 max-w-5xl mx-auto rounded-3xl overflow-hidden"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div 
            className="p-8 md:p-12"
            style={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center gap-2">
              <X className="w-6 h-6" />
              BEFORE DevFlux
            </h3>
            <ul className="space-y-4">
              {beforeItems.map((item, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-gray-400"
                >
                  <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-sm shrink-0">
                    ✕
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-red-400 font-bold text-lg">⏱️ 3+ hours per bug</p>
              <p className="text-gray-500 text-sm mt-1">Constant back-and-forth with AI</p>
            </div>
          </div>

          <div 
            className="p-8 md:p-12"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%)",
              boxShadow: "0 0 30px rgba(34, 197, 94, 0.1)"
            }}
          >
            <h3 className="text-2xl font-bold text-green-400 mb-8 flex items-center gap-2">
              <Check className="w-6 h-6" />
              AFTER DevFlux
            </h3>
            <ul className="space-y-4">
              {afterItems.map((item, i) => (
                <motion.li
                  key={i}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-white font-medium"
                >
                  <span className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-sm shrink-0">
                    ✓
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-green-400 font-bold text-lg">⏱️ 15 minutes average</p>
              <p className="text-gray-400 text-sm mt-1">Done. Verified. Tested.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={scrollRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 text-center"
        >
          <div 
            className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.2)"
            }}
          >
            <span className="text-3xl">🚀</span>
            <div className="text-left">
              <p className="text-white font-medium">
                Proof: We built <strong className="text-primary">fyndfox.com</strong> in 2 weeks
              </p>
              <p className="text-gray-400 text-sm">Using these exact workflows</p>
            </div>
            <a 
              href="https://fyndfox.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-primary" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

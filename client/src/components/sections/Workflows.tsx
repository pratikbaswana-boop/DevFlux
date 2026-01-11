import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const workflows = [
  {
    title: "Quick Fix",
    description: "Senior dev debugs null pointer: 2 hours. With workflow: 15 minutes. Saved: 1.75 hours per bug.",
    color: "from-yellow-500 to-orange-400",
  },
  {
    title: "Complex Issues",
    description: "Race condition investigation: 1 week. With workflow: 1 day with full trace. Saved: 4 senior dev days.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Story Implementation",
    description: "Feature with best practices: 3 days. With workflow: 1 day, edge cases covered. Saved: 2 days, better quality.",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Big Refactors",
    description: "10+ file migration: 5 days, risky. With workflow: 2 days, zero breaks. Saved: 3 days, less risk.",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Test Coverage",
    description: "Write comprehensive tests: 4 hours. With workflow: 45 mins, better coverage. Saved: 3.25 hours.",
    color: "from-green-500 to-emerald-400",
  },
  {
    title: "Version Upgrades",
    description: "Dependency conflicts: 2 days debugging. With workflow: 3 hours, systematic fix. Saved: 1.5 days.",
    color: "from-red-500 to-rose-400",
  },
];

export function Workflows() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            6 Battle-Tested Playbooks
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We don't just give you logins. We install proven workflows that work from Day 1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-2xl relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`} />
              
              <div className="mb-4">
                <CheckCircle2 className="w-8 h-8 text-white/20 group-hover:text-white transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

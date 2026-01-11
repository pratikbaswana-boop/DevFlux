import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const workflows = [
  {
    title: "Quick Fix",
    description: "Instant template deployment for common tasks like meeting summaries and email drafting.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Complex Ops",
    description: "Multi-step AI agents that handle data entry, reconciliation, and reporting autonomously.",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Creative Studio",
    description: "Standardized prompting workflows for marketing assets to ensure brand consistency.",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Support Bot",
    description: "Custom knowledge base trained on your internal wiki to answer employee questions.",
    color: "from-green-500 to-emerald-400",
  },
  {
    title: "Sales Intel",
    description: "Automated prospect research and personalized outreach generation at scale.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    title: "Legal Check",
    description: "First-pass contract review and clause extraction to save legal team hours.",
    color: "from-pink-500 to-rose-400",
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

import { motion } from "framer-motion";
import { AlertCircle, Ban, DollarSign, Users } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    title: "Bleeding Budget",
    desc: "Paying for Enterprise seats that 80% of your team hasn't opened in weeks.",
  },
  {
    icon: Users,
    title: "Zero Adoption",
    desc: "Teams stick to old workflows because the 'AI Revolution' felt too complex.",
  },
  {
    icon: Ban,
    title: "Shadow IT Risks",
    desc: "Employees pasting sensitive client data into public ChatGPT windows.",
  },
  {
    icon: AlertCircle,
    title: "Fragmented Data",
    desc: "Insights trapped in siloed tools that don't talk to each other.",
  },
];

export function Problem() {
  return (
    <section className="py-24 bg-black relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Why Your <span className="text-red-500">AI Strategy</span> Is Failing
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Buying tools is easy. Building workflows is hard. Most companies are stuck in the "Toy Phase".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-500/30 hover:bg-red-500/[0.02] transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

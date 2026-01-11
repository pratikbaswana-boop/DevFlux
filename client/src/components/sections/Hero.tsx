import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Bot, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditModal } from "@/components/AuditModal";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

      <div className="container px-4 mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">🔥 Proven with 90+ developers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-400">
            Your AI Tools Are Burning <br className="hidden md:block" />
            <span className="text-primary text-glow">₹5L/Year</span> Doing Nothing
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            We turn <span className="text-white font-bold">10% success rates</span> into <span className="text-primary font-bold">90% ROI</span> in just 14 days.<br />
            <span className="text-white font-medium">Same tools. Same developers. 10x productivity.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <AuditModal>
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl border-t border-white/20">
                Book Free Audit <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </AuditModal>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl backdrop-blur-sm">
              See How It Works
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Zap, label: "Efficiency Boost", value: "300%", color: "text-yellow-400" },
            { icon: Bot, label: "Tool Adoption", value: "92%", color: "text-primary" },
            { icon: BarChart3, label: "Cost Saved", value: "₹12L+", color: "text-green-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

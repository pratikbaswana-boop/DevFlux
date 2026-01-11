import { motion } from "framer-motion";
import { CheckCircle2, Terminal } from "lucide-react";

export function HowSimpleIsIt() {
  const checklist = [
    { text: "Gathers complete context automatically" },
    { 
      text: "Traces chronological execution flow",
      sub: "User clicks → Controller → Service → DB"
    },
    { text: "Identifies race condition in OrderService.java:247" },
    { text: "Validates against actual code (no hallucination)" },
    { text: "Proposes minimal fix with evidence" },
    { text: "Generates tests for the fix" },
  ];

  const commands = [
    { label: "/quick-fix", desc: "Known bugs" },
    { label: "/complex-issue", desc: "Mystery bugs" },
    { label: "/story", desc: "New features" },
    { label: "/refactor", desc: "Big changes" },
    { label: "/tests", desc: "Full coverage" },
    { label: "/upgrade", desc: "Dependencies" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Your Developers Type This. <br className="hidden md:block" />
            <span className="text-primary">We Handle Everything Else.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            No training required. No prompt engineering. Just describe the problem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mb-24">
          {/* Left Side: Terminal */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-200">The Developer Experience</h3>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-xs text-gray-500 font-mono ml-4">Terminal — Windsurf</div>
              </div>
              <div className="p-6 font-mono text-sm md:text-base leading-relaxed">
                <div className="flex gap-3 mb-4">
                  <span className="text-gray-500 font-bold">&gt;</span>
                  <span className="text-[#a78bfa] font-bold">/complex-issue</span>
                </div>
                <div className="text-gray-400 mb-6">
                  <p className="text-gray-500 italic mb-2">Describe your issue:</p>
                  <p className="text-white">
                    "Payment sometimes fails after user clicks pay. <br />
                    No error in logs. Happens randomly, ~1 in 20 <br />
                    transactions. Started after last week's deploy."
                  </p>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-5 bg-primary ml-1 align-middle"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-bold text-white">That's it. That's the entire interaction.</p>
              <p className="text-gray-400 max-w-xl">
                No back-and-forth. No 'can you give me more context?' No prompt engineering. 
                Just describe what's broken like you'd tell a senior dev.
              </p>
            </div>
          </div>

          {/* Right Side: Checklist */}
          <div className="lg:col-span-2 space-y-8 lg:pt-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-200">What Happens Automatically</h3>
            <div className="space-y-6">
              {checklist.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.text}</p>
                    {item.sub && <p className="text-gray-500 text-sm mt-1 font-mono">{item.sub}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/5">
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-3xl">⏱️</span> 15 minutes from problem to fix
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10 opacity-70">
            <h4 className="text-xl font-bold text-red-400 mb-6">Without DevFlow</h4>
            <div className="space-y-4 font-mono text-sm">
              <p className="text-gray-300">Developer: "Fix this payment bug"</p>
              <p className="text-gray-500">AI: "Maybe check the database connection?"</p>
              <p className="text-gray-300">Developer: "That's not it..."</p>
              <p className="text-gray-500">AI: "Could be a caching issue?"</p>
              <p className="text-gray-300">Developer: "Wrong again"</p>
              <div className="pt-4 border-t border-white/5 mt-6">
                <p className="text-red-400 font-bold">⏱️ 3 hours of guessing</p>
                <p className="text-gray-500">❌ Still no root cause</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-primary/5 border border-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <h4 className="text-xl font-bold text-primary mb-6">With DevFlow</h4>
            <div className="space-y-4 font-mono text-sm">
              <p className="text-gray-300">Developer: /complex-issue + description</p>
              <p className="text-primary font-bold">AI: [Systematic 5-step analysis]</p>
              <p className="text-white">AI: "Root cause: Race condition at line 247"</p>
              <p className="text-green-400">AI: "Here's the fix + tests"</p>
              <div className="pt-4 border-t border-white/5 mt-6">
                <p className="text-primary font-bold">⏱️ 15 minutes</p>
                <p className="text-white font-bold">✅ Done. Verified. Tested.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Command Showcase */}
        <div className="text-center">
          <h4 className="text-2xl font-bold mb-8 text-gray-200">6 Commands. Every Scenario.</h4>
          <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-3 overflow-x-auto pb-8 md:pb-0 no-scrollbar">
            {commands.map((cmd, i) => (
              <div
                key={i}
                className="group flex flex-col items-center min-w-fit"
              >
                <button className="px-6 py-3 rounded-full bg-primary/15 border border-primary/40 text-primary font-bold transition-all duration-300 group-hover:bg-primary group-hover:text-white whitespace-nowrap">
                  {cmd.label}
                </button>
                <span className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {cmd.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

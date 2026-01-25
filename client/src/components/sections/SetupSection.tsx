import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Download, FolderOpen, Zap, Copy, Check } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Download,
    title: "Download ZIP",
    desc: "Get the workflow files after purchase",
  },
  {
    num: "02",
    icon: FolderOpen,
    title: "Drop in Folder",
    desc: "Copy to your IDE's workflow directory",
  },
  {
    num: "03",
    icon: Zap,
    title: "Type Command, Ship Code",
    desc: "Type /quick-fix and watch the magic",
  },
];

const ideContent = {
  cursor: {
    lines: [
      { num: 1, text: "$ cp devflux-workflows/*.md ~/.cursor/commands/", type: "command" },
      { num: 2, text: "", type: "empty" },
      { num: 3, text: "✓ Done! Type /quick-fix in chat", type: "success" },
    ],
    copyText: "cp devflux-workflows/*.md ~/.cursor/commands/",
  },
  windsurf: {
    lines: [
      { num: 1, text: "$ cp devflux-workflows/*.md ~/.codeium/windsurf/global_workflows/", type: "command" },
      { num: 2, text: "", type: "empty" },
      { num: 3, text: "✓ Done! Type /quick-fix in Cascade", type: "success" },
    ],
    copyText: "cp devflux-workflows/*.md ~/.codeium/windsurf/global_workflows/",
  },
  other: {
    lines: [
      { num: 1, text: "Claude: Upload to Project Knowledge", type: "info" },
      { num: 2, text: "Copilot: Add to @workspace prompt", type: "info" },
      { num: 3, text: "Aider: Add to .aider.conf.yml", type: "info" },
    ],
    copyText: "",
  },
};

type IDEKey = keyof typeof ideContent;

function CheckmarkIcon({ animate }: { animate: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="inline-block mr-1">
      <motion.path
        d="M4 12 L10 18 L20 6"
        stroke="#22c55e"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={animate ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      />
    </svg>
  );
}

function TerminalLine({ 
  line, 
  index, 
  isVisible,
  isComplete 
}: { 
  line: { num: number; text: string; type: string }; 
  index: number;
  isVisible: boolean;
  isComplete: boolean;
}) {
  const getTextColor = () => {
    switch (line.type) {
      case "command": return "text-[#a78bfa]";
      case "success": return "text-green-400";
      case "info": return "text-gray-300";
      default: return "text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.3, delay: index * 0.4 }}
      className="flex gap-4"
    >
      <span className="text-gray-600 select-none w-4">{line.num}</span>
      <span className={getTextColor()}>
        {line.type === "success" && <CheckmarkIcon animate={isComplete} />}
        {line.type === "success" ? line.text.replace("✓ ", "") : line.text}
        {line.type === "command" && !isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
          />
        )}
      </span>
    </motion.div>
  );
}

export function SetupSection() {
  const [activeIDE, setActiveIDE] = useState<IDEKey>("cursor");
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [terminalComplete, setTerminalComplete] = useState(false);

  const handleCopy = async () => {
    const text = ideContent[activeIDE].copyText;
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simulate terminal typing and step progression
  useState(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 2) return prev + 1;
        setTerminalComplete(true);
        clearInterval(interval);
        return prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  });

  return (
    <section className="py-24 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Drifting Background Orb */}
      <motion.div
        className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-0"
        animate={{
          x: [0, 50, 0, -30, 0],
          y: [0, -30, 20, -10, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            3 Steps. <span className="text-primary">2 Minutes.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            No training. No configuration. No API keys.
          </p>
        </motion.div>

        {/* Steps with Connecting Lines */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-16 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              {/* Step Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                viewport={{ once: true }}
                className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 w-[200px]
                  ${activeStep >= i 
                    ? "bg-white/[0.05] border-primary/40 shadow-[0_0_30px_rgba(139,92,246,0.15)]" 
                    : "bg-white/[0.03] border-white/[0.08]"
                  }`}
              >
                {/* Step Number Badge */}
                <motion.div
                  className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${activeStep >= i ? "bg-primary text-white" : "bg-zinc-800 text-gray-400"}`}
                  animate={activeStep === i ? {
                    boxShadow: [
                      "0 0 0 0 rgba(139, 92, 246, 0.4)",
                      "0 0 0 10px rgba(139, 92, 246, 0)",
                    ],
                  } : {}}
                  transition={{ duration: 1, repeat: activeStep === i ? Infinity : 0 }}
                >
                  {step.num}
                </motion.div>

                {/* Icon */}
                <motion.div
                  className={`mb-4 ${activeStep >= i ? "text-primary" : "text-gray-500"}`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <step.icon className="w-8 h-8" />
                </motion.div>

                <h3 className="text-lg font-bold mb-1 text-white">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>

              {/* Connecting Arrow with Traveling Dot */}
              {i < steps.length - 1 && (
                <div className="hidden md:block relative w-16 h-[2px] mx-2">
                  {/* Base Line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5" />
                  
                  {/* Traveling Dot */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                    initial={{ left: "0%" }}
                    animate={activeStep > i ? { left: "100%" } : { left: "0%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* IDE Tabs + Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {(["cursor", "windsurf", "other"] as IDEKey[]).map((ide) => (
              <button
                key={ide}
                onClick={() => {
                  setActiveIDE(ide);
                  setActiveStep(0);
                  setTerminalComplete(false);
                  // Restart animation
                  setTimeout(() => setActiveStep(1), 500);
                  setTimeout(() => setActiveStep(2), 1000);
                  setTimeout(() => setTerminalComplete(true), 1500);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${activeIDE === ide
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
              >
                {ide === "cursor" ? "Cursor" : ide === "windsurf" ? "Windsurf" : "Other Tools"}
              </button>
            ))}
          </div>

          {/* Terminal */}
          <div className="relative group">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
              {/* Terminal Header */}
              <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono ml-4">
                    Terminal — {activeIDE === "cursor" ? "Cursor" : activeIDE === "windsurf" ? "Windsurf" : "Setup"}
                  </span>
                </div>

                {/* Copy Button */}
                {ideContent[activeIDE].copyText && (
                  <button
                    onClick={handleCopy}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-white/10"
                    title="Copy command"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm leading-relaxed min-h-[120px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIDE}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    {ideContent[activeIDE].lines.map((line, i) => (
                      <TerminalLine
                        key={i}
                        line={line}
                        index={i}
                        isVisible={true}
                        isComplete={terminalComplete}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Terminal Bump Effect on Complete */}
            {terminalComplete && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 pointer-events-none"
              />
            )}
          </div>
        </motion.div>

        {/* Bottom Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mt-12"
        >
          {[
            { emoji: "⚡", text: "No training required" },
            { emoji: "🔧", text: "No configuration" },
            { emoji: "🔑", text: "No API keys" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
            >
              <span className="text-lg">{badge.emoji}</span>
              <span className="text-sm text-gray-300 font-medium">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

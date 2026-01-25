import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Bug, Search, FileCode, RefreshCw, TestTube, ArrowUpCircle } from "lucide-react";

interface Command {
  command: string;
  title: string;
  oneLiner: string;
  timeSaved: string;
  example: string;
  details: string[];
  color: string;
  icon: React.ElementType;
}

const commands: Command[] = [
  {
    command: "/quick-fix",
    title: "Quick Fix",
    oneLiner: "Known bugs → 15 min instead of 2 hours",
    timeSaved: "Save 1.75 hours per bug",
    example: "Login button broken after deploy",
    details: [
      "AI gathers context automatically",
      "Finds root cause with evidence",
      "Proposes minimal fix",
      "Generates tests"
    ],
    color: "#FBBF24",
    icon: Bug
  },
  {
    command: "/complex-issue",
    title: "Complex Issues",
    oneLiner: "Mystery bugs → 1 day instead of 1 week",
    timeSaved: "Save 4 senior dev days",
    example: "Payment fails randomly, 1 in 20 transactions",
    details: [
      "Maps complete call chain",
      "Traces execution flow chronologically",
      "Generates multiple hypotheses",
      "Validates against actual code"
    ],
    color: "#3B82F6",
    icon: Search
  },
  {
    command: "/story",
    title: "Story Implementation",
    oneLiner: "New features → 1 day instead of 3 days",
    timeSaved: "Save 2 days, better quality",
    example: "Add user authentication with OAuth",
    details: [
      "Gathers requirements first",
      "Learns codebase patterns",
      "Creates design document",
      "Implements in phases"
    ],
    color: "#8B5CF6",
    icon: FileCode
  },
  {
    command: "/refactor",
    title: "Big Refactors",
    oneLiner: "10+ file changes → 2 days instead of 5",
    timeSaved: "Save 3 days, less risk",
    example: "Migrate from REST to GraphQL",
    details: [
      "Analyzes impact across codebase",
      "Creates rollback points",
      "Implements incrementally",
      "Verifies no breaks"
    ],
    color: "#F97316",
    icon: RefreshCw
  },
  {
    command: "/tests",
    title: "Test Coverage",
    oneLiner: "Full coverage → 45 min instead of 4 hours",
    timeSaved: "Save 3.25 hours",
    example: "Write tests for payment module",
    details: [
      "Analyzes code paths",
      "Generates edge cases",
      "Mocks only when necessary",
      "Achieves high coverage"
    ],
    color: "#22C55E",
    icon: TestTube
  },
  {
    command: "/upgrade",
    title: "Version Upgrades",
    oneLiner: "Dependencies → 3 hours instead of 2 days",
    timeSaved: "Save 1.5 days",
    example: "Upgrade React 17 to React 18",
    details: [
      "Identifies breaking changes",
      "Updates systematically",
      "Fixes compatibility issues",
      "Validates functionality"
    ],
    color: "#EF4444",
    icon: ArrowUpCircle
  }
];

const cardVariants = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.3)",
    transition: { duration: 0.2 }
  }
};

const contentVariants = {
  collapsed: { 
    opacity: 0, 
    height: 0,
    marginTop: 0
  },
  expanded: { 
    opacity: 1, 
    height: "auto",
    marginTop: 16,
    transition: {
      height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
      opacity: { duration: 0.25, delay: 0.15 }
    }
  }
};

const chevronVariants = {
  collapsed: { rotate: 0 },
  expanded: { 
    rotate: 180,
    transition: { duration: 0.3 }
  }
};

function CommandCard({ cmd, isExpanded, onToggle }: { 
  cmd: Command; 
  isExpanded: boolean; 
  onToggle: () => void;
}) {
  const Icon = cmd.icon;
  
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className="rounded-2xl cursor-pointer overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #12121A 100%)",
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        borderTop: `3px solid ${cmd.color}`
      }}
      onClick={onToggle}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${cmd.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: cmd.color }} />
            </div>
            <span 
              className="font-mono font-bold text-lg"
              style={{ color: cmd.color }}
            >
              {cmd.command}
            </span>
          </div>
          <motion.div
            variants={chevronVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>

        <p className="text-gray-300 text-sm mb-2">{cmd.oneLiner}</p>
        <p className="text-xs text-primary font-medium">{cmd.timeSaved}</p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2">Example:</p>
                <p className="text-sm text-white mb-4 font-mono bg-black/30 px-3 py-2 rounded-lg">
                  "{cmd.example}"
                </p>
                
                <p className="text-xs text-gray-500 mb-2">What happens:</p>
                <ul className="space-y-2">
                  {cmd.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cmd.color }}
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function CommandsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 -z-10" />

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            6 Commands That <span className="text-primary">Actually Work</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stop prompting. Start commanding. Each workflow is battle-tested on real codebases.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {commands.map((cmd, index) => (
            <motion.div
              key={cmd.command}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.04, 0.62, 0.23, 0.98]
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <CommandCard
                cmd={cmd}
                isExpanded={expandedIndex === index}
                onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

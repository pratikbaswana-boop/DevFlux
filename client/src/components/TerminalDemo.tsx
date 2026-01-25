import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

interface TerminalLine {
  type: "command" | "input" | "output" | "pause" | "loop";
  text?: string;
  speed?: number;
  color?: "primary" | "white" | "muted" | "success";
  duration?: number;
}

const terminalSequence: TerminalLine[] = [
  { type: "command", text: "/quick-fix", speed: 80, color: "primary" },
  { type: "pause", duration: 200 },
  { type: "input", text: '"Login button not working after deploy"', speed: 50, color: "white" },
  { type: "pause", duration: 800 },
  { type: "output", text: "🔍 Analyzing codebase...", speed: 20, color: "muted" },
  { type: "pause", duration: 600 },
  { type: "output", text: "✓ Found: onClick handler missing", speed: 20, color: "success" },
  { type: "output", text: "  → Button.tsx:42", speed: 20, color: "muted" },
  { type: "pause", duration: 400 },
  { type: "output", text: "✓ Fix applied. Tests passing.", speed: 20, color: "success" },
  { type: "pause", duration: 300 },
  { type: "output", text: "⏱️ Total: 2 minutes", speed: 20, color: "primary" },
  { type: "pause", duration: 3000 },
  { type: "loop" }
];

const colorClasses: Record<string, string> = {
  primary: "text-primary",
  white: "text-white",
  muted: "text-gray-400",
  success: "text-green-400"
};

const lineVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

export function TerminalDemo() {
  const [displayedLines, setDisplayedLines] = useState<{ text: string; color: string }[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const runSequence = useCallback(async () => {
    setDisplayedLines([]);
    setCurrentText("");

    for (let i = 0; i < terminalSequence.length; i++) {
      const item = terminalSequence[i];

      if (item.type === "loop") {
        await new Promise(resolve => setTimeout(resolve, 500));
        runSequence();
        return;
      }

      if (item.type === "pause") {
        await new Promise(resolve => setTimeout(resolve, item.duration || 500));
        continue;
      }

      if (item.text) {
        setIsTyping(true);
        const prefix = item.type === "command" ? "> " : "";
        const fullText = prefix + item.text;
        const speed = item.speed || 50;
        const colorClass = colorClasses[item.color || "white"];

        for (let j = 0; j <= fullText.length; j++) {
          setCurrentText(fullText.slice(0, j));
          await new Promise(resolve => setTimeout(resolve, speed));
        }

        setDisplayedLines(prev => [...prev, { text: fullText, color: colorClass }]);
        setCurrentText("");
        setIsTyping(false);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, []);

  useEffect(() => {
    runSequence();
  }, [runSequence]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[320px] md:max-w-2xl mx-auto">
      <div 
        className="rounded-lg md:rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1A1A2E 0%, #12121A 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `
            0 4px 6px rgba(0, 0, 0, 0.3),
            0 10px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `
        }}
      >
        <div 
          className="px-3 md:px-4 py-2 md:py-3 flex items-center gap-1.5 md:gap-2"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)"
          }}
        >
          <div className="flex gap-1.5 md:gap-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: "#FF5F56" }} />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: "#FFBD2E" }} />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: "#27CA40" }} />
          </div>
          <span className="text-[10px] md:text-xs text-gray-500 font-mono ml-2 md:ml-3">Terminal — Cursor</span>
        </div>

        <div className="p-3 md:p-6 font-mono text-xs md:text-sm min-h-[160px] md:min-h-[200px] space-y-1">
          <AnimatePresence mode="sync">
            {displayedLines.map((line, index) => (
              <motion.div
                key={index}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className={line.color}
              >
                {line.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {(currentText || isTyping) && (
            <div className={colorClasses[terminalSequence.find(s => s.type !== "pause" && s.type !== "loop")?.color || "white"]}>
              {currentText}
              <motion.span
                animate={{ opacity: showCursor ? 1 : 0 }}
                className="inline-block w-[2px] h-[1.2em] ml-0.5 align-middle"
                style={{
                  backgroundColor: "#8B5CF6",
                  boxShadow: "0 0 8px rgba(139, 92, 246, 0.8)"
                }}
              />
            </div>
          )}

          {!currentText && !isTyping && displayedLines.length === 0 && (
            <div className="text-gray-500">
              <span className="text-primary">&gt;</span>
              <motion.span
                animate={{ opacity: showCursor ? 1 : 0 }}
                className="inline-block w-[2px] h-[1.2em] ml-1 align-middle"
                style={{
                  backgroundColor: "#8B5CF6",
                  boxShadow: "0 0 8px rgba(139, 92, 246, 0.8)"
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

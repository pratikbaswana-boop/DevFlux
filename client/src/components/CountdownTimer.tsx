import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  function calculateTimeLeft(): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className={`flex flex-col md:flex-row items-center justify-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <Clock className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-sm text-gray-400">Offer ends in:</span>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="bg-primary/10 border border-primary/30 rounded-lg w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <span className="text-base md:text-lg font-bold text-white font-mono">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 mt-1">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

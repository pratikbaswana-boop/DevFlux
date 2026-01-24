import { useEffect, useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const {
    initSession,
    trackPageView,
    trackScrollDepth,
    trackExitIntent,
    endSession,
  } = useAnalytics();
  
  const initialized = useRef(false);
  const exitIntentTracked = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize session and track page view
    initSession().then(() => {
      trackPageView();
    });

    // Scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        trackScrollDepth();
      }, 100);
    };

    // Exit intent tracking (mouse leaving viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentTracked.current) {
        exitIntentTracked.current = true;
        trackExitIntent();
      }
    };

    // Session end on page unload
    const handleBeforeUnload = () => {
      endSession();
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(scrollTimeout);
    };
  }, [initSession, trackPageView, trackScrollDepth, trackExitIntent, endSession]);

  return <>{children}</>;
}

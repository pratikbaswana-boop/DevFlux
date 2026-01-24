import { useCallback, useEffect, useRef } from "react";
import { api } from "@shared/routes";

// Generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create visitor ID from localStorage
function getVisitorId(): string {
  const key = 'devflux_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
}

// Get visit count and increment
function getAndIncrementVisitCount(): { count: number; isReturning: boolean } {
  const key = 'devflux_visit_count';
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  const newCount = current + 1;
  localStorage.setItem(key, newCount.toString());
  return { count: newCount, isReturning: current > 0 };
}

// Parse UTM parameters from URL
function getUTMParams(): Record<string, string | undefined> {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
  };
}

// Detect device type
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Parse browser info
function getBrowserInfo(): { browser: string; version: string; os: string } {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = '';
  let os = 'Unknown';

  // Detect browser
  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    version = ua.split('Firefox/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome';
    version = ua.split('Chrome/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Safari';
    version = ua.split('Version/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    version = ua.split('Edg/')[1]?.split(' ')[0] || '';
  }

  // Detect OS
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { browser, version, os };
}

// Analytics context type
interface AnalyticsContext {
  visitorId: string;
  sessionId: string;
  sessionStart: number;
}

let analyticsContext: AnalyticsContext | null = null;

export function useAnalytics() {
  const scrollDepthsTracked = useRef<Set<number>>(new Set());
  const pageLoadTime = useRef<number>(Date.now());

  // Initialize session
  const initSession = useCallback(async () => {
    if (analyticsContext) return analyticsContext;

    const visitorId = getVisitorId();
    const sessionId = generateUUID();
    const { count, isReturning } = getAndIncrementVisitCount();
    const utmParams = getUTMParams();
    const browserInfo = getBrowserInfo();

    analyticsContext = {
      visitorId,
      sessionId,
      sessionStart: Date.now(),
    };

    const sessionData = {
      visitorId,
      sessionId,
      ...utmParams,
      referrer: document.referrer || undefined,
      landingPage: window.location.href,
      deviceType: getDeviceType(),
      browser: browserInfo.browser,
      browserVersion: browserInfo.version,
      os: browserInfo.os,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      isReturning,
      visitCount: count,
      userAgent: navigator.userAgent,
    };

    try {
      await fetch(api.analytics.createSession.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
    } catch (err) {
      console.error('Failed to create analytics session:', err);
    }

    return analyticsContext;
  }, []);

  // Track event
  const trackEvent = useCallback(async (
    eventType: string,
    options?: {
      eventCategory?: string;
      eventAction?: string;
      eventLabel?: string;
      eventValue?: number;
      elementId?: string;
      elementText?: string;
      scrollDepth?: number;
      timeOnPage?: number;
    }
  ) => {
    if (!analyticsContext) {
      await initSession();
    }
    if (!analyticsContext) return;

    const eventData = {
      visitorId: analyticsContext.visitorId,
      sessionId: analyticsContext.sessionId,
      eventType,
      pageUrl: window.location.href,
      ...options,
    };

    try {
      await fetch(api.analytics.trackEvent.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
    } catch (err) {
      console.error('Failed to track event:', err);
    }
  }, [initSession]);

  // Track page view
  const trackPageView = useCallback(() => {
    pageLoadTime.current = Date.now();
    trackEvent('page_view', { eventCategory: 'navigation' });
  }, [trackEvent]);

  // Track scroll depth
  const trackScrollDepth = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    const thresholds = [25, 50, 75, 100];
    for (const threshold of thresholds) {
      if (scrollPercent >= threshold && !scrollDepthsTracked.current.has(threshold)) {
        scrollDepthsTracked.current.add(threshold);
        trackEvent(`scroll_${threshold}`, {
          eventCategory: 'behavior',
          scrollDepth: threshold,
        });
      }
    }
  }, [trackEvent]);

  // Track click
  const trackClick = useCallback((
    elementId: string,
    elementText: string,
    eventCategory: string = 'click'
  ) => {
    trackEvent('click', {
      eventCategory,
      elementId,
      elementText,
    });
  }, [trackEvent]);

  // Track conversion events
  const trackBuyButtonClick = useCallback((buttonLocation: string) => {
    trackEvent('buy_button_click', {
      eventCategory: 'conversion',
      eventLabel: buttonLocation,
    });
  }, [trackEvent]);

  const trackPricingView = useCallback(() => {
    trackEvent('pricing_view', { eventCategory: 'conversion' });
  }, [trackEvent]);

  const trackPaymentModalOpen = useCallback(() => {
    trackEvent('payment_modal_open', { eventCategory: 'conversion' });
  }, [trackEvent]);

  const trackPaymentModalClose = useCallback(() => {
    trackEvent('payment_modal_close', { eventCategory: 'conversion' });
  }, [trackEvent]);

  // Track exit intent
  const trackExitIntent = useCallback(() => {
    trackEvent('exit_intent', {
      eventCategory: 'behavior',
      timeOnPage: Math.round((Date.now() - pageLoadTime.current) / 1000),
    });
  }, [trackEvent]);

  // End session
  const endSession = useCallback(async () => {
    if (!analyticsContext) return;

    const sessionDuration = Math.round((Date.now() - analyticsContext.sessionStart) / 1000);

    try {
      await fetch(api.analytics.endSession.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: analyticsContext.sessionId,
          sessionDuration,
        }),
        keepalive: true,
      });
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  }, []);

  return {
    initSession,
    trackEvent,
    trackPageView,
    trackScrollDepth,
    trackClick,
    trackBuyButtonClick,
    trackPricingView,
    trackPaymentModalOpen,
    trackPaymentModalClose,
    trackExitIntent,
    endSession,
  };
}

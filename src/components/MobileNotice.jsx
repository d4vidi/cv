import { useSyncExternalStore } from 'react';
import { PROFILE } from '../data/cv.js';

// Phones and tablets (incl. iPads, which pose as Macs) are fixed traits, so they're resolved once
const ua = navigator.userAgent;
const isPhone = navigator.userAgentData?.mobile ?? /Mobi|Android.+Mobile|iPhone|iPod/i.test(ua);
const isTablet = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || /iPad|Android(?!.*Mobile)/i.test(ua);
// Touch-only devices miss the hover effects; this also catches phones requesting the desktop site
const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const IS_MOBILE_DEVICE = isPhone || isTablet || isTouchOnly;

// The interactive timeline layout needs at least X pixels in width (experimentation shows), on any device.
// `screen` keeps printing (narrow A4 media) -- unaffected
const query = window.matchMedia('screen and (max-width: 1180px)');
const subscribe = (cb) => {
  query.addEventListener('change', cb);
  return () => query.removeEventListener('change', cb);
};

export function useIsMobile() {
  return useSyncExternalStore(subscribe, () => IS_MOBILE_DEVICE || query.matches);
}

export default function MobileNotice() {
  return (
    <main className="mobile">
      <div className="mobile-card tile">
        <div className="mobile-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#17172B" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            <rect x="5" y="9" width="38" height="24" rx="3" />
            <path d="M18 39h12M24 33v6" />
          </svg>
        </div>
        <h1 className="fd mobile-name">{PROFILE.name}</h1>
        <p className="mobile-msg">Please view on <strong>Desktop</strong></p>
        <p className="fm muted mobile-hint">This interactive CV is built for larger screens.</p>
      </div>
    </main>
  );
}

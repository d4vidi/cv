import { PROFILE } from '../data/cv.js';
import { IS_PRINTABLE } from '../mode.js';

export default function Header() {
  return (
    <header className="header">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: '1 1 420px' }}>
        <h1 className="fd" style={{ margin: 0, fontSize: 'clamp(48px, 9vw, 104px)', lineHeight: 0.92 }}>{PROFILE.name}</h1>
        <p style={{ margin: IS_PRINTABLE ? 0 : '0 0 16px', fontSize: 18, fontWeight: 500 }}>{PROFILE.headline}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320, fontSize: 14, lineHeight: 1.5, alignItems: 'flex-end' }}>
        <div className="fm" style={{ fontSize: 13, background: '#17172B', color: '#FFFFFF', padding: '4px 12px', borderRadius: 999, marginBottom: 6, whiteSpace: 'nowrap' }}>
          {PROFILE.span}
        </div>
        <span className="fm muted" style={{ fontSize: 13 }}>{PROFILE.location}</span>
        <a href={PROFILE.linkedin} target="_blank" rel="noopener" style={{ fontWeight: 700, fontSize: 15 }}>Linkedin ↗</a>
        <a href={PROFILE.github} target="_blank" rel="noopener" style={{ fontWeight: 700, fontSize: 15 }}>Github ↗</a>
        <a className="cv-link" href={PROFILE.website} target="_blank" rel="noopener">
          <span className="fm cv-link-url">Interactive CV online ↗</span>
        </a>
      </div>
    </header>
  );
}

import { PROFILE } from '../data/cv.js';

export default function Header() {
  return (
    <header className="header">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="fm" style={{ alignSelf: 'flex-start', fontSize: 13, background: '#17172B', color: '#FFFFFF', padding: '4px 12px', borderRadius: 999 }}>
          {PROFILE.span}
        </div>
        <h1 className="fd" style={{ margin: 0, fontSize: 'clamp(48px, 9vw, 104px)', lineHeight: 0.92 }}>{PROFILE.name}</h1>
        <p className="soft" style={{ margin: 0, fontSize: 19, fontWeight: 500 }}>{PROFILE.headline}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 320, fontSize: 14, lineHeight: 1.5, alignItems: 'flex-start' }}>
        <span className="fm muted" style={{ fontSize: 13 }}>{PROFILE.location}</span>
        <a href={PROFILE.linkedin} target="_blank" rel="noopener" style={{ fontWeight: 700, fontSize: 15 }}>Linkedin ↗</a>
      </div>
    </header>
  );
}

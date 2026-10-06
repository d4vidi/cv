import { CV } from '../data/cv.js';
import Bubble from './Bubble.jsx';

// Hand-tuned layout for each timeline row: row offsets, bubble size, drift phase,
// which side the year label sits on, and per-bubble font sizes.
const ROWS = [
  { id: 'wix', size: 'min(400px, 60vw)', label: 'after',
    row: { paddingLeft: '3%' }, yr: { marginLeft: 'min(110px, 15vw)' },
    fonts: { name: 'clamp(24px, 8.4vw, 64px)', role: 'clamp(10px, 2.2vw, 15px)', duration: 'clamp(10px, 2vw, 14px)' },
    satellites: [
      { id: 'studio', left: '73.3%', top: '-0.8%', size: '21%', delay: '-1s', padding: '6%',
        fonts: { name: 'clamp(8px, 1.6vw, 12px)', duration: 'clamp(8px, 1.5vw, 10px)' } },
      { id: 'detox', left: '89.3%', top: '31.3%', size: '35.75%', delay: '-3s',
        fonts: { name: 'clamp(9px, 1.9vw, 14px)', duration: 'clamp(8px, 1.5vw, 11px)' } },
      { id: 'mobileapps', left: '72.6%', top: '68.6%', size: '30%', delay: '-2s',
        fonts: { name: 'clamp(9px, 2.2vw, 16px)', duration: 'clamp(8px, 1.6vw, 11px)' } },
    ] },
  { id: 'eme', size: 'min(164px, 24.6vw)', delay: '-4s', label: 'before',
    row: { justifyContent: 'flex-end', paddingRight: '8%', marginTop: 'calc(-1 * min(40px, 5vw))' },
    fonts: { name: 'clamp(10px, 2.7vw, 18px)', role: 'clamp(9px, 1.7vw, 12px)', duration: 'clamp(8px, 1.6vw, 11px)' } },
  { id: 'shaker', size: 'min(186px, 28vw)', delay: '-6s', label: 'after',
    row: { justifyContent: 'center', marginTop: 8, paddingRight: '12%' },
    fonts: { name: 'clamp(12px, 3.6vw, 26px)', role: 'clamp(9px, 1.7vw, 12px)', duration: 'clamp(8px, 1.6vw, 11px)' } },
  { id: 'orckit', size: 'min(237px, 35.5vw)', delay: '-2.5s', label: 'before',
    row: { justifyContent: 'flex-end', paddingRight: '4%', marginTop: 'calc(-1 * min(30px, 4vw))' },
    fonts: { name: 'clamp(11px, 3vw, 21px)', role: 'clamp(9px, 1.8vw, 13px)', duration: 'clamp(8px, 1.7vw, 12px)' } },
  { id: 'idf', size: 'min(277px, 41.5vw)', delay: '-5s', label: 'after',
    row: { paddingLeft: '10%', marginTop: 'calc(-1 * min(50px, 6vw))' },
    fonts: { name: 'clamp(16px, 5vw, 36px)', role: 'clamp(9px, 2vw, 14px)', duration: 'clamp(8px, 1.8vw, 12px)' } },
];

function YearLabel({ entry, side, style }) {
  const right = side === 'before';
  return (
    <div className={right ? 'yr r' : 'yr'} style={right ? { textAlign: 'right', alignItems: 'flex-end', ...style } : style}>
      <b>{entry.bubble.years}</b>
      <span>{entry.bubble.caption}</span>
    </div>
  );
}

export default function Timeline({ onOpen }) {
  return (
    <main className="timeline">
      {ROWS.map((r) => {
        const entry = CV[r.id];
        const label = <YearLabel entry={entry} side={r.label} style={r.yr} />;
        return (
          <div key={r.id} className="trow" style={r.row}>
            {r.label === 'before' && label}
            <div className="float" style={{ position: 'relative', width: r.size, height: r.size, flex: 'none', animationDelay: r.delay }}>
              <Bubble entry={entry} fonts={r.fonts} onOpen={() => onOpen(r.id)} />
              {r.satellites?.map((s) => (
                <div key={s.id} className="subwrap float-sm"
                  style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}>
                  <Bubble entry={CV[s.id]} fonts={s.fonts} sub padding={s.padding}
                    nameSpacing="-0.01em" onOpen={() => onOpen(s.id)} />
                </div>
              ))}
            </div>
            {r.label === 'after' && label}
          </div>
        );
      })}
    </main>
  );
}

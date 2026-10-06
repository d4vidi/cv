import { CV } from '../data/cv.js';
import Bubble from './Bubble.jsx';

// Hand-tuned layout for each timeline row: row offsets, bubble size, drift phase,
// which side the year label sits on, and per-bubble font sizes.
// Sizes are [px, vw] → min(px, vw); font sizes are [minPx, vw, maxPx] → clamp(...).
// `staticScale` sizes the bubble in the static single pager, relative to its max size.
export const ROWS = [
  { id: 'wix', size: [400, 60], label: 'after', staticScale: 0.7,
    row: { paddingLeft: '3%' }, yr: { marginLeft: 'min(110px, 15vw)' },
    fonts: { name: [24, 8.4, 64], role: [10, 2.2, 15], duration: [10, 2, 14] },
    satellites: [
      { id: 'studio', left: '73.3%', top: '-0.8%', size: '21%', delay: '-1s', padding: '6%',
        fonts: { name: [8, 1.6, 12], duration: [8, 1.5, 10] } },
      { id: 'detox', left: '89.3%', top: '31.3%', size: '35.75%', delay: '-3s',
        fonts: { name: [9, 1.9, 14], duration: [8, 1.5, 11] } },
      { id: 'mobileapps', left: '72.6%', top: '68.6%', size: '30%', delay: '-2s',
        fonts: { name: [9, 2.2, 16], duration: [8, 1.6, 11] } },
    ] },
  { id: 'eme', size: [164, 24.6], delay: '-4s', label: 'before', staticScale: 1,
    row: { justifyContent: 'flex-end', paddingRight: '8%', marginTop: 'calc(-1 * min(40px, 5vw))' },
    fonts: { name: [10, 2.7, 18], role: [9, 1.7, 12], duration: [8, 1.6, 11] } },
  { id: 'shaker', size: [186, 28], delay: '-6s', label: 'after', staticScale: 1,
    row: { justifyContent: 'center', marginTop: 8, paddingRight: '12%' },
    fonts: { name: [12, 3.6, 26], role: [9, 1.7, 12], duration: [8, 1.6, 11] } },
  { id: 'orckit', size: [237, 35.5], delay: '-2.5s', label: 'before', staticScale: 0.8,
    row: { justifyContent: 'flex-end', paddingRight: '4%', marginTop: 'calc(-1 * min(30px, 4vw))' },
    fonts: { name: [11, 3, 21], role: [9, 1.8, 13], duration: [8, 1.7, 12] } },
  { id: 'idf', size: [277, 41.5], delay: '-5s', label: 'after', staticScale: 0.7,
    row: { paddingLeft: '10%', marginTop: 'calc(-1 * min(50px, 6vw))' },
    fonts: { name: [16, 5, 36], role: [9, 2, 14], duration: [8, 1.8, 12] } },
];

const mapFonts = (fonts, fn) => Object.fromEntries(Object.entries(fonts).map(([k, v]) => [k, fn(v)]));

// Responsive sizes for the interactive timeline
export const fluidSize = ([px, vw]) => `min(${px}px, ${vw}vw)`;
export const fluidFonts = (fonts) => mapFonts(fonts, ([min, vw, max]) => `clamp(${min}px, ${vw}vw, ${max}px)`);

// Fixed sizes for the static single pager (fonts never go below the design's minimum)
export const fixedFonts = (fonts, scale) => mapFonts(fonts, ([min, , max]) => `${Math.max(min, max * scale)}px`);

export function YearLabel({ entry, side, style }) {
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
        const size = fluidSize(r.size);
        const label = <YearLabel entry={entry} side={r.label} style={r.yr} />;
        return (
          <div key={r.id} className="trow" style={r.row}>
            {r.label === 'before' && label}
            <div className="float" style={{ position: 'relative', width: size, height: size, flex: 'none', animationDelay: r.delay }}>
              <Bubble entry={entry} fonts={fluidFonts(r.fonts)} onOpen={() => onOpen(r.id)} />
              {r.satellites?.map((s) => (
                <div key={s.id} className="subwrap float-sm"
                  style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}>
                  <Bubble entry={CV[s.id]} fonts={fluidFonts(s.fonts)} sub padding={s.padding}
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

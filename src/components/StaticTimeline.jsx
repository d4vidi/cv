import { CV } from '../data/cv.js';
import Bubble from './Bubble.jsx';
import EntryDetails, { Blurb, Points } from './EntryDetails.jsx';
import { ROWS, YearLabel, fixedFonts } from './Timeline.jsx';

const union = (...lists) => [...new Set(lists.flat().filter(Boolean))];

// Keep the page short: no stats, tags or external links (blurb sources stay inline)
const compact = (entry) => ({ ...entry, stats: null, featured: null, tags: null, links: null });

// Fold the child roles' highlights into their parent entry
function mergeRoles(entry) {
  const kids = (entry.roles || []).map((rid) => CV[rid]);
  return { ...entry, highlights: union(entry.highlights, ...kids.map((k) => k.highlights)) };
}

function RoleGroups({ entry }) {
  const [hue] = entry.c;
  return (
    <div className="roles">
      {entry.roles.map((rid) => {
        const role = CV[rid];
        return (
          <div key={rid} className="role-group">
            <span className="role-dot" style={{ background: hue }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{role.title}</span>
              <span className="fm muted" style={{ fontSize: 12 }}>{role.period}</span>
            </div>
            <Points points={role.points} />
          </div>
        );
      })}
    </div>
  );
}

function StaticBubble({ row }) {
  const entry = CV[row.id];
  const px = row.size[0] * row.staticScale;
  // Satellites stick out to the right of the main bubble; reserve that room so the group stays centred
  const overhang = Math.max(0, ...(row.satellites || []).map((s) => parseFloat(s.left) + parseFloat(s.size) - 100));
  return (
    <div style={{ position: 'relative', width: px, height: px, flex: 'none', marginRight: (px * overhang) / 100 }}>
      <Bubble entry={entry} fonts={fixedFonts(row.fonts, row.staticScale)} isStatic />
      {row.satellites?.map((s) => (
        <div key={s.id} className="subwrap" style={{ left: s.left, top: s.top, width: s.size, height: s.size }}>
          <Bubble entry={CV[s.id]} fonts={fixedFonts(s.fonts, row.staticScale)} sub padding={s.padding}
            nameSpacing="-0.01em" isStatic />
        </div>
      ))}
    </div>
  );
}

export default function StaticTimeline() {
  return (
    <main className="timeline stimeline">
      {ROWS.map((row, i) => {
        const base = CV[row.id];
        const entry = compact(base.roles ? mergeRoles(base) : base);
        return (
          <section key={row.id} className={['tile', 'scard', entry.roles && 'long'].filter(Boolean).join(' ')}>
            <div className={i % 2 ? 'shead rev' : 'shead'}>
              <div className="scol">
                <StaticBubble row={row} />
                <YearLabel entry={entry} caption={false} />
              </div>
              <div className="sintro">
                <div className="dlg-heading">
                  <div className="fm muted" style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{entry.org}</div>
                  <h3 className="fd" style={{ margin: 0, fontSize: 28, lineHeight: 1.05 }}>{entry.title}</h3>
                  <div className="soft" style={{ fontSize: 15 }}>{entry.period}</div>
                </div>
                <Blurb entry={entry} />
              </div>
            </div>
            <EntryDetails entry={{ ...entry, blurb: null }} roles={entry.roles && <RoleGroups entry={entry} />} />
          </section>
        );
      })}
    </main>
  );
}

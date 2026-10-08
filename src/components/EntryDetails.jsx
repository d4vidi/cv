// The detail sections of a CV entry, shared by the dialog and the static single pager.
// `roles` is rendered between the stats and the highlights.

const STAR = 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z';

export function Blurb({ entry: d }) {
  if (!d.blurb) return null;
  return (
    <p className="muted dlg-blurb">
      {d.blurb}
      {(d.sources || []).map((src) => (
        <span key={src.href}> <a href={src.href} target="_blank" rel="noopener">{src.label} ↗</a></span>
      ))}
    </p>
  );
}

export function Points({ points }) {
  if (!points?.length) return null;
  return (
    <ul className="soft dlg-points">
      {points.map((pt) => <li key={pt}>{pt}</li>)}
    </ul>
  );
}

export function Stats({ stats, tint, mini = false }) {
  if (!stats?.length) return null;
  return (
    <div className={mini ? 'stats mini' : 'stats'}>
      {stats.map((st) => (
        <div key={st.label} className="stat" style={{ background: tint }}>
          <span className="fd" style={{ fontSize: mini ? 18 : 36, lineHeight: 1 }}>{st.num}</span>
          <span className="soft" style={{ fontSize: mini ? 11 : 13 }}>{st.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Links({ links }) {
  const shown = (links || []).filter((l) => l.href);
  if (!shown.length) return null;
  return (
    <div className="links">
      {shown.map((lk) => (
        <a key={lk.href} href={lk.href} target="_blank" rel="noopener">{lk.label} ↗</a>
      ))}
    </div>
  );
}

export default function EntryDetails({ entry: d, roles = null }) {
  const [hue, tint] = d.c;
  const featured = d.featured || [];
  const tags = d.tags || [];
  return (
    <>
      <Blurb entry={d} />

      <Points points={d.points} />
      <Stats stats={d.stats} tint={tint} />
      {roles}

      {d.highlights?.length > 0 && (
        <div className="highlights">
          {d.highlights.map((hl) => (
            <div key={hl} className="highlight">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#17172B" strokeWidth="2.2" strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }}><path d={STAR} fill={hue} /></svg>
              <span>{hl}</span>
            </div>
          ))}
        </div>
      )}

      {(featured.length > 0 || tags.length > 0) && (
        <div className="tags">
          {featured.map((ft) => (
            <span key={ft} className="chip featured" style={{ background: tint }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d={STAR} fill={hue} /></svg>
              {ft}
            </span>
          ))}
          {tags.map((tag) => (
            <span key={tag} className="chip" style={{ background: tint }}>{tag}</span>
          ))}
        </div>
      )}

      <Links links={d.links} />
    </>
  );
}

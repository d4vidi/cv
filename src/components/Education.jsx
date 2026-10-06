import { EDUCATION } from '../data/cv.js';

export default function Education() {
  return (
    <section className="sect section" style={{ marginTop: 96 }}>
      <h2 className="fd">Education</h2>
      <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {EDUCATION.map((e) => (
          <div key={e.school} className="tile tile-body" style={{ gap: 6 }}>
            <div className="fm muted" style={{ fontSize: 13 }}>{e.years}</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{e.school}</div>
            <div className="soft" style={{ fontSize: 15 }}>
              {e.degree}{e.honors && <>, <strong>{e.honors}</strong></>}
            </div>
            {e.notes && (
              <ul className="muted" style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {e.notes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

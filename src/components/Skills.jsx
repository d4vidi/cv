import { SKILLS } from '../data/cv.js';

export default function Skills() {
  return (
    <section className="sect section" style={{ marginTop: 64 }}>
      <h2 className="fd">Core skills</h2>
      <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {SKILLS.map((s) => (
          <div key={s.title} className="tile tile-body" style={{ gap: 10 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: s.dot, border: '2px solid #17172B' }} />
            <div style={{ fontWeight: 700, fontSize: 17 }}>{s.title}</div>
            <div className="soft" style={{ fontSize: 14, lineHeight: 1.5 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { HOBBIES } from '../data/cv.js';

export default function Hobbies() {
  return (
    <section className="sect section" style={{ marginTop: 32 }}>
      <h2 className="fd">Personal hobbies</h2>
      <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {HOBBIES.map((h) => (
          <div key={h.title} className="tile tile-body" style={{ gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>{h.title}</div>
            <div className="soft" style={{ fontSize: 14, lineHeight: 1.5 }}>{h.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

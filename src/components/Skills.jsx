import { useState } from 'react';
import { SKILLS } from '../data/cv.js';
import { IS_PRINTABLE } from '../mode.js';
import PlasmaShader from './PlasmaShader.jsx';
import BinaryRain from './BinaryRain.jsx';

// Hover effects rendered as an animated tile background
const BACKGROUNDS = { plasma: PlasmaShader, binary: BinaryRain };
const TEAM = ['#FFF1A8', '#FFC9DF', '#CFE5FF', '#BDF2D7', '#E6D9FF'];

export default function Skills() {
  return (
    <section className="sect section" style={{ marginTop: 64 }}>
      <h2 className="fd">Core skills</h2>
      <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {SKILLS.map((s) => <SkillTile key={s.title} skill={s} />)}
      </div>
    </section>
  );
}

function SkillTile({ skill: s }) {
  const [hovered, setHovered] = useState(false);
  const fx = IS_PRINTABLE ? null : s.fx;
  const Background = BACKGROUNDS[fx];

  return (
    <div className={`tile tile-body${fx ? ` fx-${fx}` : ''}`} style={{ gap: 10 }}
      onPointerEnter={Background ? () => setHovered(true) : undefined}
      onPointerLeave={Background ? () => setHovered(false) : undefined}>
      {Background && <Background active={hovered} />}
      {fx === 'team' && (
        <div className="team" aria-hidden="true">
          {TEAM.map((c) => <span key={c} style={{ '--c': c }} />)}
        </div>
      )}
      <div style={{ fontWeight: 700, fontSize: 17 }}>{s.title}</div>
      <div className="soft" style={{ fontSize: 14, lineHeight: 1.5 }}>{s.body}</div>
    </div>
  );
}

import { useState } from 'react';
import { CV, SKILLS } from '../data/cv.js';
import { IS_PRINTABLE } from '../mode.js';
import { Chip } from './EntryDetails.jsx';
import PlasmaShader from './PlasmaShader.jsx';
import BinaryRain from './BinaryRain.jsx';

// Companies whose tags (their own and their roles') are listed as pills on the printable version
const TAG_SOURCES = ['wix', 'eme'];

// Hover effects rendered as an animated tile background
const BACKGROUNDS = { plasma: PlasmaShader, binary: BinaryRain };
const TEAM = ['#FFF1A8', '#FFC9DF', '#CFE5FF', '#BDF2D7', '#E6D9FF'];

export default function Skills() {
  return (
    <section className="sect section" style={{ marginTop: 48 }}>
      <h2 className="fd">Core skills</h2>
      <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {SKILLS.map((s) => <SkillTile key={s.title} skill={s} />)}
      </div>
      {IS_PRINTABLE && <TagPills />}
    </section>
  );
}

// All tags of TAG_SOURCES, deduped and tinted by company; tags shared by several companies get a split tint
function TagPills() {
  const byLabel = new Map();
  for (const id of TAG_SOURCES) {
    const company = CV[id];
    for (const entry of [company, ...(company.roles || []).map((r) => CV[r])]) {
      for (const [labels, featured] of [[entry.featured, true], [entry.tags, false]]) {
        for (const label of labels || []) {
          const pill = byLabel.get(label) ?? byLabel.set(label, { label, featured, hue: company.c[0], tints: [] }).get(label);
          if (!pill.tints.includes(company.c[1])) pill.tints.push(company.c[1]);
        }
      }
    }
  }
  const pills = [...byLabel.values()].sort((a, b) => b.featured - a.featured);

  return (
    <div className="tags">
      {pills.map((p) => <Chip key={p.label} label={p.label} featured={p.featured} hue={p.hue} bg={splitTint(p.tints)} />)}
    </div>
  );
}

const splitTint = (tints) => tints.length === 1 ? tints[0]
  : `linear-gradient(90deg, ${tints.map((t, i) => `${t} ${i / tints.length * 100}% ${(i + 1) / tints.length * 100}%`).join(', ')})`;

function SkillTile({ skill: s }) {
  const [hovered, setHovered] = useState(false);
  // The printable version shows the effects' end state, statically (`still`)
  const { fx } = s;
  const Background = BACKGROUNDS[fx];
  const hoverable = Background && !IS_PRINTABLE;

  return (
    <div className={`tile tile-body${fx ? ` fx-${fx}` : ''}${fx && IS_PRINTABLE ? ' still' : ''}`} style={{ gap: 10 }}
      onPointerEnter={hoverable ? () => setHovered(true) : undefined}
      onPointerLeave={hoverable ? () => setHovered(false) : undefined}>
      {Background && <Background active={hovered} still={IS_PRINTABLE} />}
      {fx === 'notification' && <span className="badge" aria-hidden="true">1</span>}
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

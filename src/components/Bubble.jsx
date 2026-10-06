// A clickable timeline bubble. `fonts` holds the clamp() sizes for the name, role and
// duration lines, which are tuned per bubble size.
export default function Bubble({ entry, fonts, sub = false, padding, nameSpacing, onOpen }) {
  const { bubble } = entry;
  const [hue, tint] = entry.c;
  const hasRole = bubble.role || bubble.roleNote;
  return (
    <button
      className={sub ? 'bubble sub' : 'bubble'}
      aria-haspopup="dialog"
      onClick={onOpen}
      style={{ '--tint': tint, '--hue': hue, padding }}
    >
      <span className="nm" style={{ fontSize: fonts.name, letterSpacing: nameSpacing }}>{bubble.name}</span>
      {hasRole && (
        <span className="rl" style={{ fontSize: fonts.role }}>
          {bubble.role}
          {bubble.roleNote && <span style={{ fontWeight: 400 }}>{bubble.roleNote}</span>}
        </span>
      )}
      <span className="du" style={{ fontSize: fonts.duration }}>{bubble.duration}</span>
    </button>
  );
}

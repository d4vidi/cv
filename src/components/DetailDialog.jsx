import { useEffect, useRef } from 'react';
import { CV } from '../data/cv.js';
import EntryDetails from './EntryDetails.jsx';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useModalBehaviour(cardRef, onClose) {
  // Escape to close + keep Tab focus inside the dialog
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab' && cardRef.current) {
        const items = cardRef.current.querySelectorAll(FOCUSABLE);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const inside = cardRef.current.contains(document.activeElement);
        if (e.shiftKey && (!inside || document.activeElement === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || document.activeElement === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cardRef, onClose]);

  // Lock page scroll while open, compensating for the disappearing scrollbar
  useEffect(() => {
    const { style } = document.body;
    const prev = { overflow: style.overflow, paddingRight: style.paddingRight };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    style.overflow = 'hidden';
    if (scrollbar > 0) style.paddingRight = `${scrollbar}px`;
    return () => Object.assign(style, prev);
  }, []);
}

export default function DetailDialog({ id, onOpen, onClose }) {
  const d = CV[id];
  const [hue] = d.c;
  const cardRef = useRef(null);
  const closeRef = useRef(null);
  useModalBehaviour(cardRef, onClose);

  // Focus the close button on open and whenever the dialog switches entry
  useEffect(() => {
    closeRef.current?.focus();
    cardRef.current?.scrollTo(0, 0);
  }, [id]);

  const roles = (d.roles || []).map((rid) => ({ id: rid, ...CV[rid] }));

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={cardRef} className="card" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="dlg-title">
        <div className="dlg-head">
          <span className="dlg-swatch" style={{ background: hue }} />
          <div className="dlg-heading">
            <div className="fm muted" style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{d.org}</div>
            <h2 id="dlg-title" className="fd" style={{ margin: 0, fontSize: 30, lineHeight: 1.05 }}>{d.title}</h2>
            <div className="soft" style={{ fontSize: 15 }}>{d.period}</div>
          </div>
          <button ref={closeRef} className="x" aria-label="Close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="dlg-body">
          <EntryDetails entry={d} roles={roles.length > 0 && (
            <div className="roles">
              {roles.map((role) => (
                <button key={role.id} className="rolebtn" onClick={() => onOpen(role.id)}>
                  <span className="role-dot" style={{ background: hue }} />
                  <span className="rt" style={{ fontWeight: 700, fontSize: 16 }}>{role.title}</span>
                  <span className="fm muted" style={{ fontSize: 12 }}>{role.period}</span>
                  <span className="soft" style={{ fontSize: 14 }}>{role.points?.[0] || ''}</span>
                </button>
              ))}
            </div>
          )} />

          {d.parent && (
            <button className="back" onClick={() => onOpen(d.parent)}>← All {CV[d.parent].title} roles</button>
          )}
        </div>
      </div>
    </div>
  );
}

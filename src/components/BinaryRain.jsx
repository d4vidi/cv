import { useEffect, useRef } from 'react';

const SIZE = 14; // Glyph size and column width, in CSS pixels
const STEP_MS = 55; // Rain advances in discrete steps, like a terminal
const BG = 'rgba(255,255,255,.14)'; // Painted over every step, fading the trails into the tile's white
const HEAD = '#2FD68A';
const TRAIL = 'rgba(47,214,138,.5)';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

// "Matrix"-like falling columns of 0s and 1s; renders only while `active` (a single still frame under reduced motion)
export default function BinaryRain({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.font = `${SIZE}px 'DM Mono', monospace`;
    ctx.textAlign = 'center';

    const rows = Math.ceil(h / SIZE);
    // Each column's head row; start staggered above the top so columns enter at different times
    const heads = Array.from({ length: Math.ceil(w / SIZE) }, () => -Math.floor(Math.random() * rows));
    const bit = () => (Math.random() < .5 ? '0' : '1');

    const step = () => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      heads.forEach((y, i) => {
        const x = i * SIZE + SIZE / 2;
        if (y > 0) {
          // Repaint the previous head as trail, so only the leading digit is bright
          ctx.fillStyle = TRAIL;
          ctx.fillText(bit(), x, y * SIZE - 2);
        }
        if (y >= 0) {
          ctx.fillStyle = HEAD;
          ctx.fillText(bit(), x, (y + 1) * SIZE - 2);
        }
        heads[i] = y > rows && Math.random() < .08 ? -Math.floor(Math.random() * rows / 2) : y + 1;
      });
    };

    ctx.clearRect(0, 0, w, h);
    if (REDUCED_MOTION.matches) {
      for (let i = 0; i < rows * 1.5; i++) step();
      return;
    }

    let raf, last = 0;
    const frame = (now) => {
      if (now - last >= STEP_MS) {
        last = now;
        step();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return <canvas ref={canvasRef} className="fx-bg" aria-hidden="true" />;
}

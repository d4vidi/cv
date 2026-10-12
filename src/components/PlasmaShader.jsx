import { useEffect, useRef, useState } from 'react';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// Flowing pastel warp over the site's tints, with a ripple emanating from the cursor
const FRAG = `
precision mediump float;
uniform vec2 r; // canvas size
uniform float t; // timestamp
uniform vec2 m; // mouse pointer coords
uniform float rad; // allowed radius (clips beyond)

vec3 palette(float d) {  
  // The 4 base gradient colors
  // TODO turn to function/class parameters?
  vec3 c1 = vec3(1.,.945,.659); // yellow
  vec3 c2 = vec3(1.,.788,.875); // pink
  vec3 c3 = vec3(.812,.898,1.); // blue
  vec3 c4 = vec3(.741,.949,.843); // mint
  
  d = fract(d); // Clamp d > 1 for pattern repeat
  d = d * 4.; // Spread onto 4 sections, enabling logic below
  return d<1.? mix(c1,c2,d) :
    d<2. ? mix(c2,c3,d-1.) :
    d<3. ? mix(c3,c4,d-2.) :
      mix(c4,c1,d-3.);
}

// Rounded corners (anti-aliased), as a CSS clip on the canvas isn't honored reliably once it's composited
float alpha(){
  vec2 c = abs(gl_FragCoord.xy - r*.5) - r*.5 + rad;
  return clamp(.5 - (length(max(c,0.)) - rad), 0., 1.);
}

void main(){
  vec2 p = (gl_FragCoord.xy*2.-r) / r.y;
  
  vec2 dm = p - m;
  float d = length(dm); // norm(dm)
  vec2 dm_unit = dm / max(d, .001); // dm/norm(dm) = a pure direction vector (unit)
  vec2 q = p + (.9*sin(d*9. - t*4.) * exp(-d*1.6)) * dm_unit;
  for (int i=1;i<4;i++) {
    float f = float(i);
    q+=vec2(sin(q.y*1.7*f+t*.6), cos(q.x*1.3*f-t*.5))*.35 / f;
  }
  
  vec3 rgb = palette(.25 + .75*sin(q.x+q.y -.3*t) + .08*q.x);
  float a = alpha();
  gl_FragColor = vec4(rgb, a);
}`;

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

const STILL_T = 3; // Moment of the animation captured by the `still` snapshot

// Full-bleed WebGL background; renders only while `active` (a single still frame under reduced motion).
// `still` renders a single frame once, swapped for an image of it (prints reliably, unlike WebGL canvases)
export default function PlasmaShader({ active, still }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const mouseRef = useRef([0, 0]);
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (!active && !still) return;
    const canvas = canvasRef.current;
    const gl = glRef.current ?? (glRef.current = init(canvas));
    if (!gl) return;

    // Snapshots are printed, so go beyond the screen's resolution
    const dpr = still ? 3 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(gl.u.r, canvas.width, canvas.height);
    gl.uniform1f(gl.u.rad, parseFloat(getComputedStyle(canvas).borderTopLeftRadius) * dpr || 0);

    if (still) {
      gl.uniform1f(gl.u.t, STILL_T);
      gl.uniform2f(gl.u.m, 1e3, 1e3); // Cursor far away: no ripple
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      setSnapshot(canvas.toDataURL());
      return;
    }

    const onMove = (e) => {
      const b = canvas.getBoundingClientRect();
      // Same space as `p` in the fragment shader (y up, height normalized to [-1, 1])
      mouseRef.current = [
        ((e.clientX - b.left) * 2 - b.width) / b.height,
        (b.height - (e.clientY - b.top) * 2) / b.height,
      ];
    };
    const tile = canvas.parentElement;
    tile.addEventListener('pointermove', onMove);

    let raf;
    const start = performance.now();
    const frame = (now) => {
      gl.uniform1f(gl.u.t, (now - start) / 1000);
      gl.uniform2f(gl.u.m, ...mouseRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!REDUCED_MOTION.matches) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      tile.removeEventListener('pointermove', onMove);
    };
  }, [active, still]);

  return snapshot ? <img src={snapshot} className="fx-bg" alt="" /> : <canvas ref={canvasRef} className="fx-bg" aria-hidden="true" />;
}

function init(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const prog = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // A single oversized triangle covering the viewport
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.u = { r: gl.getUniformLocation(prog, 'r'), t: gl.getUniformLocation(prog, 't'), m: gl.getUniformLocation(prog, 'm'), rad: gl.getUniformLocation(prog, 'rad') };
  return gl;
}

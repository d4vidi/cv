import { useEffect, useRef, useState } from 'react';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

/**
 * Flowing pastel warp over the site's tints, with a ripple emanating from the cursor.
 *
 * Below are notes about how this shader works at bird's eye view.
 *
 * ## Fundamental grounds: A base gradient
 * - On the most fundamental level, in palette() and through sample_grad(), the shader
 *   simply generates an imaginary gradient with 4 color stops. This gradient is the base for everything.
 *   How is this done?
 *   - `palette()` smoothes the gradient out by allowing for blending adjacent colors depending
 *     on the sampled point's place in 0..1 range.
 *   - The "last" grid section blends between the last and *first* colors so the gradient
 *     is inherently circular.
 * - By sampling the gradient (in `sample_grad()`) based on coordinates and time (`t` variable),
 *   you get a static yet consistently shifting gradient.
 *   **This is the fundamental form, leaving the mouse cursor out of the equation.** Use `sample_grad()` with
 *   `p` instead of `q` and you'd see this.
 *
 * ## Mouse Cursor droplet effect
 * - The final sampled gradient color is based not on 'p' (technically the raw `FragCoord`), but an
 *   adjustment of it that we label as 'q'.
 * - 'q' is in fact 'p' with radial shifting. We start from 'p', and add an adjustment based on the distance
 *   of 'p' from mouse-cursor (size and direction). Since we send 'q' to `sample_grad()` rather than 'p', we
 *   simply end up **sampling the base gradient a bit differently around the mouse cursor.** This is the key
 *   to understanding the droplet effect.
 *   - Using `exp(-d)` (i.e. `e^-d`) decays this shifting exponentially as distance grows, getting closer
 *     and closer back to the original 'p'.
 * - Since 'q' is inherently adjusted based on the distance from mouse-cursor, keeping the original direction,
 *   we get a radial effect literally *around* the mouse cursor.
 *
 * _Note: This doesn't fully explain how the shader works, just portrays the conceptual model behind it.
 * `plasma-shader.md` explain the details fairly._
 */
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

// Return alpha as a binary 0 or 1, to enforce (anti-aliased) rounded corners (0 beyond radius).
// This is required as a mere CSS clip on the canvas isn't honored reliably once it's composited.
float alpha() {
  vec2 c = abs(gl_FragCoord.xy - r*.5) - r*.5 + rad;
  return clamp(.5 - (length(max(c,0.)) - rad), 0., 1.);
}

vec4 sample_grad(vec2 p) {
  vec3 rgb = palette(.5 + .5*sin(p.x+p.y -.3*t) + .08*p.x);
  float a = alpha();
  return vec4(rgb, a);
}

void main() {
  vec2 p = (gl_FragCoord.xy*2.-r) / r.y;
  
  // Compute q as a "distortion" of p, which is 'p' stretching out across the dynamic
  // base gradient depending on the distance from mouse cursor (creating the radial 'droplet' effect).
  vec2 dm = p - m;
  float d = length(dm); // norm(dm)
  float shift = (.9 * // Amplitude
    sin(d*9. - t*4.) * // multiplier of 'd' controls number of ripples (sine frequency)
    exp(-d*1.6)); // Expo decay of effect
  vec2 dm_unit = dm / max(d, .001); // dm/norm(dm) = a pure direction (unit) vector
  vec2 q = p + shift * dm_unit;
  for (int i=1;i<4;i++) {
    float f = float(i);
    q += (.35 / f) * vec2(sin(q.y*1.7*f+t*.6), cos(q.x*1.3*f-t*.5));
  }
  
  gl_FragColor = sample_grad(q);
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

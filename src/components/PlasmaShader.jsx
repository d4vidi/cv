import { useEffect, useRef } from 'react';

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// Flowing pastel warp over the site's tints, with a ripple emanating from the cursor
const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
vec3 pal(float x){
  vec3 a=vec3(1.,.945,.659),b=vec3(1.,.788,.875),c=vec3(.812,.898,1.),d=vec3(.741,.949,.843);
  x=fract(x)*4.;
  return x<1.?mix(a,b,x):x<2.?mix(b,c,x-1.):x<3.?mix(c,d,x-2.):mix(d,a,x-3.);
}
void main(){
  vec2 p=(gl_FragCoord.xy*2.-r)/r.y;
  vec2 dm=p-m;
  float d=length(dm);
  vec2 q=p+.18*sin(d*9.-t*4.)*dm/max(d,.001)*exp(-d*1.6);
  for(int i=1;i<4;i++){
    float f=float(i);
    q+=vec2(sin(q.y*1.7*f+t*.6),cos(q.x*1.3*f-t*.5))*.35/f;
  }
  gl_FragColor=vec4(pal(.5+.5*sin(q.x+q.y+t*.3)+q.x*.08),1.);
}`;

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

// Full-bleed WebGL background; renders only while `active` (a single still frame under reduced motion)
export default function PlasmaShader({ active }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const mouseRef = useRef([0, 0]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const gl = glRef.current ?? (glRef.current = init(canvas));
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(gl.u.r, canvas.width, canvas.height);

    const onMove = (e) => {
      const b = canvas.getBoundingClientRect();
      // Same space as `p` in the fragment shader (y up, height normalized to [-1, 1])
      mouseRef.current = [((e.clientX - b.left) * 2 - b.width) / b.height, (b.height - (e.clientY - b.top) * 2) / b.height];
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
  }, [active]);

  return <canvas ref={canvasRef} className="fx-bg" aria-hidden="true" />;
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

  gl.u = { r: gl.getUniformLocation(prog, 'r'), t: gl.getUniformLocation(prog, 't'), m: gl.getUniformLocation(prog, 'm') };
  return gl;
}

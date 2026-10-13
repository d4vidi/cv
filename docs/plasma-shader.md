# The plasma shader, step by step

A walkthrough of `src/components/PlasmaShader.jsx`: the hover background of the *Frontend* skill tile.

**What it is:** a *domain-warping* shader, producing a *plasma* (a.k.a. "liquid", "iridescent", "mesh"-gradient) look, with a cursor ripple on top and rounded corners cut out in the shader itself.

---

## 0. Background: what a fragment shader is

A fragment shader is a small program the GPU runs **once per pixel, in parallel**. It answers a single question: *what color is this pixel?* Each run knows only its own pixel's position, plus a few shared inputs called **uniforms**.

## 1. The JavaScript setup

### 1.1 One oversized triangle

```js
new Float32Array([-1, -1, 3, -1, -1, 3])
```

WebGL's drawable area spans -1…1 on both axes. A triangle with corners (-1,-1), (3,-1) and (-1,3) covers that entire square, and the overflow is cut off. Drawing it makes the GPU run the fragment shader for every pixel of the canvas. This is the standard "full-screen triangle" trick: one triangle instead of two forming a rectangle. The vertex shader (`VERT`) just passes the corners through.

### 1.2 Uniforms

| Uniform | Value | Set |
|---|---|---|
| `r` | Canvas size, in **device** pixels (CSS size × `devicePixelRatio`, capped at 2) | Once per hover |
| `rad` | The tile's corner radius, in device pixels (read from the canvas's CSS `border-radius`) | Once per hover |
| `t` | Seconds since the hover started | Every frame |
| `m` | Cursor position, already converted to the shader's coordinate space (see 2.1) | Every frame |

### 1.3 The render loop

While the tile is hovered, `requestAnimationFrame` sets `t` and `m` and draws the triangle again, about 60 times a second. When the pointer leaves, the loop stops and the last frame fades out through CSS. Under *reduced motion*, only a single frame is drawn.

### 1.4 The `still` mode (printable version)

WebGL canvases don't print reliably, so with `still` the component:
1. Renders at 3× resolution, since paper is much denser than a screen.
2. Draws a single frame at a fixed moment, `t = 3` (`STILL_T`).
3. Places the cursor at (1000, 1000), far outside the tile. The ripple's fade (step 3.4) at that distance is `exp(-1600)`, which is effectively 0, so no ripple shows.
4. Swaps the canvas for an `<img>` of that frame (`canvas.toDataURL()`).

---

## 2. Normalizing the coordinates

```glsl
vec2 p = (gl_FragCoord.xy*2.-r) / r.y;
```

**Goal:** turn pixel positions into a "world" that is **centered**, runs **-1…1 on y**, and **keeps the aspect ratio**, so x runs ±(width/height). Every constant later in the shader is then measured in half-tile-heights, so the pattern looks the same whatever the tile's size or the screen's density. A wider tile just shows more of the pattern sideways.

### Substeps, on a 400 × 200 canvas (`r = (400, 200)`)

| Step | Expression | x range | y range |
|---|---|---|---|
| a. Raw pixel position | `gl_FragCoord.xy` | 0 … 400 | 0 … 200 |
| b. Double it | `*2.` | 0 … 800 | 0 … 400 |
| c. Subtract the size | `-r` | -400 … 400 | -200 … 200 |
| d. Divide **both** axes by the height | `/r.y` | -2 … 2 | -1 … 1 |

Tracking specific pixels:

| Pixel | a | b (×2) | c (−r) | d (÷200) |
|---|---|---|---|---|
| Bottom-left corner | (0, 0) | (0, 0) | (-400, -200) | (-2, -1) |
| Center | (200, 100) | (400, 200) | **(0, 0)** | **(0, 0)** |
| Top-right corner | (400, 200) | (800, 400) | (400, 200) | (2, 1) |

Notes:
- It's the **center pixel** that lands on 0, not the corner. Doubling its position gives exactly `r`, and `r - r = 0`.
- The `*2` is what makes y come out as -1…1. Without it, the result would be -0.5…0.5. An equivalent, easier-to-read form is `(gl_FragCoord.xy - r*.5) / (r.y*.5)`: "distance from the center, measured in half-heights".
- x isn't scaled by anything of its own. Both axes are divided by the same `r.y`, so one unit is the same number of pixels both ways. Dividing x by `r.x` instead would make it -1…1 too, but would stretch the pattern sideways, turning circles into ellipses.
- `gl_FragCoord` gives the pixel's **center**, so the bottom-left pixel is really (0.5, 0.5). This doesn't change anything here.

### 2.1 The cursor gets the same treatment, in JavaScript

```js
((e.clientX - b.left) * 2 - b.width) / b.height,
(b.height - (e.clientY - b.top) * 2) / b.height,
```

It's the same formula, with one difference: in the browser y points **down**, but `gl_FragCoord` y points **up**. So the y formula is flipped (`b.height - … * 2` instead of `… * 2 - b.height`). The cursor and `p` can then be compared directly.

---

## 3. The cursor ripple

```glsl
vec2 dm = p-m;
float d = length(dm);
vec2 dm_unit = dm / max(d,.001);

vec2 q = p + (.9*sin(d*9. - t*4.) * dm_unit * exp(-d*1.6));
```

The ripple doesn't draw anything. It **moves the coordinates** the rest of the shader reads (`q` instead of `p`), so the pattern underneath looks as if it bends around the cursor, like light through water.

### 3.1 Vector from the cursor: `dm = p - m`
An arrow pointing from the cursor to this pixel.

### 3.2 Distance: `d = length(dm)`
How far this pixel is from the cursor.

### 3.3 Direction: `dm_unit = dm / max(d, .001)`
The same arrow, shortened to length 1: a **pure direction**. The push is applied along it, so pixels are pushed straight out from the cursor (or pulled in, when the sine is negative). `max(d, .001)` avoids dividing by zero for the pixel right under the cursor.

### 3.4 The push amount, as a product of three factors

| Factor | Role |
|---|---|
| `sin(d*9. - t*4.)` | A wave over **distance**, which makes rings around the cursor. `9.` sets the ring spacing. Subtracting `t*4.` moves the rings outward over time. |
| `exp(-d*1.6)` | **Fade** with distance: 1 at the cursor, dropping toward 0 farther away. `1.6` sets how quickly. |
| `.9` | Overall **strength**, in half-tile-heights. |

### 3.5 Apply: `q = p + amount * dm_unit`
Each pixel reads the pattern from a shifted position.

---

## 4. Domain warping: the core of the effect

```glsl
for (int i=1;i<4;i++) {
  float f = float(i);
  q+=vec2(sin(q.y*1.7*f+t*.6),cos(q.x*1.3*f-t*.5))*.35/f;
}
```

Three passes (`f` = 1, 2, 3), each moving `q` again.

### 4.1 Cross-axis dependence
The **x** shift depends on `q.y`, and the **y** shift depends on `q.x`. Because each axis moves based on the other, the motion swirls. If each axis depended only on itself, you'd get straight stripes.

### 4.2 Finer with each pass: `*f`
Each pass's waves are narrower (more of them across the tile), so pass 3 adds the finest detail.

### 4.3 Weaker with each pass: `/f`
Fine detail sits on top of the large shapes without overpowering them. `.35` sets the overall turbulence.

### 4.4 Drift: `+t*.6`, `-t*.5`
The waves move over time, at different speeds and in opposite directions, so the motion never settles into a neat repeating loop.

### 4.5 Feedback
Each pass reads the `q` the previous pass already moved. This feedback is what folds the shapes into each other and makes them look liquid. Without it, the result would just be a sum of waves.

---

## 5. Plasma: one number per pixel

```glsl
.5+.5*sin(q.x+q.y+t*.3)+q.x*.08
```

### 5.1 `sin(q.x + q.y)`
Diagonal stripes, bent by the warping into flowing shapes. This is the classic demoscene "plasma".

### 5.2 `.5 + .5 * …`
Rescales the sine from -1…1 to 0…1.

### 5.3 `+ t*.3`
Moves the colors slowly through the shapes, even where the shapes themselves barely move.

### 5.4 `+ q.x*.08`
A slight left-to-right shift, so the two sides of the tile don't use exactly the same colors.

---

## 6. The palette: number → color

```glsl
vec3 palette(float x){
  vec3 a = vec3(1.,.945,.659);   // yellow
  vec3 b = vec3(1.,.788,.875);   // pink
  vec3 c = vec3(.812,.898,1.);   // blue
  vec3 d = vec3(.741,.949,.843); // mint
  x = fract(x) * 4.;
  return x<1. ? mix(a,b,x) : x<2. ? mix(b,c,x-1.) : x<3. ? mix(c,d,x-2.) : mix(d,a,x-3.);
}
```

### 6.1 Colors as vectors
A `vec3` color is just **R, G, B as decimal numbers from 0 to 1**, so `.r .g .b` are aliases for `.x .y .z`. Converting from hex means dividing each channel by 255. For example, the site's Wix tint `#FFF1A8`:

| Channel | Hex | 0–255 | ÷ 255 |
|---|---|---|---|
| R | `FF` | 255 | 1.0 |
| G | `F1` | 241 | .945 |
| B | `A8` | 168 | .659 |

Using decimals makes colors plain math: `mix(a, b, .3)` blends 30% of the way from `a` to `b`, and `color * .5` halves the brightness. CSS supports the same notation: `color(srgb 1 .945 .659)`.

### 6.2 Wrap: `fract(x)`
Keeps only the fractional part, so any value, even negative or above 1, maps to 0…1. That's what makes the palette **repeat**.

### 6.3 Split into four parts: `* 4.`
Each part blends smoothly from one color to the next: yellow → pink → blue → mint → **back to yellow**. The last part ends on the first color, so the cycle has no visible seam.

---

## 7. Rounded corners

```glsl
vec2 c = abs(gl_FragCoord.xy - r*.5) - r*.5 + rad;
float a = clamp(.5 - (length(max(c,0.)) - rad), 0., 1.);
```

**Why it's in the shader:** the tile has rounded corners, but clipping the canvas with CSS isn't honored reliably once the browser composites it on the GPU. So the shader makes the corners transparent itself. This step works in **pixels** (`gl_FragCoord`), not in `p` space, because the radius is given in pixels.

This is a *signed distance function* (SDF) for a rounded rectangle: for each pixel, it computes the distance to the shape's edge.

### 7.1 Center and fold: `abs(gl_FragCoord.xy - r*.5)`
Measure from the center, then take the absolute value. This folds all four quadrants onto one, so only one corner needs handling and the other three come out the same by symmetry.

### 7.2 Move to the corner circle: `- r*.5 + rad`
`- r*.5` measures from the corner itself; `+ rad` moves inward to the **center of the corner's arc**. `c` is now this pixel's offset from that arc center:
- both components ≤ 0: the pixel is in the tile's inner area,
- one component > 0: it's beside a straight edge,
- both > 0: it's in the corner square, where the rounding happens.

### 7.3 Distance outside: `length(max(c,0.)) - rad`
`max(c, 0.)` keeps only the parts of `c` that are past the arc center. Its length is the distance from the arc center, and subtracting `rad` gives the distance **outside** the rounded edge: positive outside, zero or negative inside.

### 7.4 Soft edge: `clamp(.5 - dist, 0., 1.)`
This gives the opacity: 1 well inside, 0 well outside, and a 1-pixel-wide blend at the edge. That blend is the anti-aliasing, so the corners look smooth instead of jagged.

---

## 8. Output

```glsl
gl_FragColor=vec4(palette(...), a);
```

The color from step 6, with the corner opacity from step 7 as alpha. The GPU repeats all of this for every pixel, then the JavaScript asks for the next frame with a slightly larger `t`.

---

## Tuning reference

| Value | Step | Effect |
|---|---|---|
| `.9` | 3.4 | Ripple strength: how strongly the cursor bends the pattern |
| `9.` / `4.` | 3.4 | Ring spacing / how fast the rings spread |
| `1.6` | 3.4 | How quickly the ripple fades with distance |
| `i<4` | 4 | Number of warp passes: more passes, more detail |
| `.35` | 4.3 | Warp strength: more turbulent or calmer |
| `1.7`, `1.3` | 4 | Base wave frequencies per axis |
| `.6`, `.5`, `.3` | 4.4, 5.3 | Motion speeds |
| `.08` | 5.4 | Left-to-right color shift |
| `STILL_T` | 1.4 | Moment captured for the printable version |

**To see what each step does**, comment out the warp loop (step 4): you'll get plain diagonal color stripes, plus the ripple. Turn it back on and they turn into liquid.

import { HEADER } from "./common";

/**
 * Glass — the background made of the same material as the cards on top of it.
 *
 * Nothing here is drawn as colour. A quiet backdrop is painted first, then a
 * slab of invisible glass is laid over it, and the backdrop is read back
 * through that slab: bent where the glass curves, and read a fraction further
 * for red than for blue, which is where the coloured edges come from. What you
 * see is the backdrop, refracted.
 */
export const glass = {
  name: "Glass",
  note: "The background is glass — the same material as the floating cards.",
  fallback:
    "linear-gradient(120deg, #F7F8FC 0%, #DDE5FF 45%, #B7A7FF 68%, #5271FF 86%, #DDE5FF 100%)",
  fragment: `${HEADER}
/** What lies behind the glass: a quiet wash and a faint ruled grid. */
vec3 backdrop(vec2 uv) {
  vec3 c = mix(CANVAS, SOFT, smoothstep(0.10, 0.95, uv.x + uv.y * 0.22));
  c = mix(c, PRIMARY, smoothstep(0.72, 1.35, uv.x + uv.y * 0.30) * 0.75);
  c = mix(c, ACCENT, smoothstep(0.55, 1.05, uv.x - uv.y * 0.35) * 0.35);

  vec2 cell = abs(fract(uv * vec2(16.0, 10.0)) - 0.5);
  float rule = smoothstep(0.47, 0.5, max(cell.x, cell.y));
  return mix(c, PRIMARY, rule * 0.07);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/** The slab: a few rounded shapes melted together, drifting slowly. */
float slab(vec2 p, float t) {
  float d = length(p - vec2(0.30 + 0.05 * sin(t * 0.5), 0.05 + 0.04 * cos(t * 0.41))) - 0.34;
  d = smin(d, length(p - vec2(0.02 + 0.04 * cos(t * 0.37), -0.20 + 0.05 * sin(t * 0.44))) - 0.24, 0.30);
  d = smin(d, length(p - vec2(0.52 + 0.04 * sin(t * 0.29), 0.24 + 0.04 * cos(t * 0.33))) - 0.26, 0.28);
  d += (fbm(p * 2.4 + vec2(t * 0.12, -t * 0.09)) - 0.5) * 0.10;
  return d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  vec2 q = (p - vec2(0.22, 0.04)) * 0.92;
  q += (uPointer - 0.5) * 0.05;

  float t = uTime * 0.35;
  float d = slab(q, t);

  // Thickness: 0 at the rim of the slab, 1 in the middle of it.
  float thickness = smoothstep(0.0, -0.30, d);

  // The slope of the slab tells us which way the light is bent.
  vec2 e = vec2(0.004, 0.0);
  vec2 slope = vec2(
    slab(q + e.xy, t) - slab(q - e.xy, t),
    slab(q + e.yx, t) - slab(q - e.yx, t)
  ) / (2.0 * e.x);

  // Bending is strongest at the rim, where the glass is steepest.
  float bend = 0.055 * (1.0 - thickness) * thickness * 4.0;
  vec2 offset = slope * bend;

  // Red is bent least, blue most: that split is the coloured edge.
  vec3 col;
  col.r = backdrop(uv + offset * 0.92).r;
  col.g = backdrop(uv + offset * 1.00).g;
  col.b = backdrop(uv + offset * 1.10).b;

  vec3 plain = backdrop(uv);
  col = mix(plain, col, smoothstep(0.0, 0.06, thickness));

  // Glass is not colourless: it lightens what it covers and catches the light
  // along its rim.
  col = mix(col, mix(col, vec3(1.0), 0.18), thickness);
  vec3 normal = normalize(vec3(slope * 0.5, 1.0));
  vec3 lightDir = normalize(vec3(-0.45, 0.70, 0.55));
  float sheen = pow(clamp(dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 30.0);
  col += vec3(1.0) * sheen * smoothstep(0.02, 0.35, thickness) * 0.8;

  float rim = smoothstep(0.035, 0.0, abs(d)) * 0.35;
  col = mix(col, vec3(1.0), rim);

  col = settle(col, uv, 1.9);
  fragColor = vec4(grain(col, gl_FragCoord.xy, uTime), 1.0);
}`,
};

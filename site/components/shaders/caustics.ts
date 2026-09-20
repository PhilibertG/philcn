import { HEADER } from "./common";

/**
 * Caustics — the net of light on the floor of a swimming pool.
 *
 * Sunlight through a rippled surface bunches into thin bright curves. The
 * shape is found by folding the plane into itself a few times and keeping the
 * places where the fold is thinnest; each pass is smaller and slower than the
 * last, which is what gives the fine web inside the broad one.
 */
export const caustics = {
  name: "Caustics",
  note: "Light through moving water — a net of bright curves.",
  fallback:
    "radial-gradient(60% 60% at 66% 44%, #DDE5FF 0%, #5271FF 42%, #B7A7FF 68%, #F7F8FC 92%)",
  fragment: `${HEADER}
float web(vec2 p, float t) {
  vec2 q = p * 2.6;
  float total = 0.0;
  float amplitude = 1.0;

  for (int i = 0; i < 4; i++) {
    q = rot(0.72) * q * 1.32;
    q += sin(q.yx * 2.05 + t * (0.55 + float(i) * 0.13)) * 0.44;
    float fold = abs(sin(q.x * 1.55) * sin(q.y * 1.55));
    total += amplitude * pow(1.0 - clamp(fold, 0.0, 1.0), 7.0);
    amplitude *= 0.60;
  }

  return total;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  p = (p - vec2(0.26, 0.02)) * 0.85;
  p += (uPointer - 0.5) * 0.05;

  float t = uTime * 0.45;

  float light = web(p, t);
  // The water is deeper towards the middle of the pool, so the net is
  // brightest there and dissolves at the rim.
  float pool = smoothstep(1.05, 0.15, length(p * vec2(0.92, 1.12)));
  light *= pool;

  vec3 col = CANVAS;
  col = mix(col, SOFT, smoothstep(0.02, 0.30, light));
  col = mix(col, ACCENT, smoothstep(0.16, 0.55, light) * 0.8);
  col = mix(col, PRIMARY, smoothstep(0.38, 0.88, light));
  col += vec3(1.0) * smoothstep(0.78, 1.25, light) * 0.85;

  // The blue standing water between the bright curves.
  col = mix(col, mix(col, DEEP, 0.30), pool * smoothstep(0.22, 0.0, light) * 0.55);

  col = settle(col, uv, 1.85);
  fragColor = vec4(grain(col, gl_FragCoord.xy, uTime), 1.0);
}`,
};

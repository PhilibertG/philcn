import { HEADER } from "./common";

/**
 * Color bends — folded ribbons of light.
 *
 * A repeating ridge whose coordinate is bent by noise, so the bands fold
 * instead of running straight. The prismatic edge is the whole trick: the
 * ridge is read three times, each a hair out of step with the last, and the
 * three readings are given different colours. Where they agree you get the
 * bright crest; where they disagree you get the fringe.
 */
export const colorBends = {
  name: "Color bends",
  note: "Folded ribbons of light, splitting into colour at their edges.",
  fallback:
    "linear-gradient(115deg, #F7F8FC 0%, #DDE5FF 38%, #5271FF 62%, #B7A7FF 80%, #F7F8FC 100%)",
  fragment: `${HEADER}
float ridge(vec2 p, float t, float shift) {
  vec2 q = rot(-0.62) * p;
  float bend = fbm(q * 1.15 + vec2(t * 0.22, -t * 0.16));
  float s = q.y * 2.3 + (bend - 0.5) * 4.2 + shift;
  float v = sin(s * 2.5 + t * 0.5) * 0.5 + 0.5;
  return pow(clamp(v, 0.0, 1.0), 2.6);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  p = (p - vec2(0.18, 0.04)) * 0.92;
  p += (uPointer - 0.5) * 0.06;

  float t = uTime * 0.6;

  float a = ridge(p, t, -0.19);
  float core = ridge(p, t, 0.0);
  float b = ridge(p, t, 0.19);

  vec3 col = CANVAS;
  col = mix(col, SOFT, smoothstep(0.04, 0.42, core));
  col = mix(col, PRIMARY, smoothstep(0.44, 0.95, core));

  // The fringes: where the three readings disagree, one colour wins.
  col = mix(col, ACCENT, clamp((b - core) * 2.4, 0.0, 1.0) * 0.95);
  col = mix(col, DEEP, clamp((a - core) * 2.4, 0.0, 1.0) * 0.55);

  // The crest, so it reads as light rather than paint.
  col += vec3(1.0) * smoothstep(0.86, 1.0, core) * 0.55;

  col = settle(col, uv, 1.8);
  fragColor = vec4(grain(col, gl_FragCoord.xy, uTime), 1.0);
}`,
};

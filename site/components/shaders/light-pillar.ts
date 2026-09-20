import { HEADER } from "./common";

/**
 * Light pillar — a standing column of light.
 *
 * A soft vertical mask holds the column in place; two layers of drifting noise
 * at different scales give it the filaments that make it look like something
 * burning rather than a painted stripe. It leans slightly towards the cursor.
 */
export const lightPillar = {
  name: "Light pillar",
  note: "A standing column of light, drifting in filaments.",
  fallback:
    "radial-gradient(38% 80% at 62% 45%, #5271FF 0%, #B7A7FF 34%, #DDE5FF 62%, #F7F8FC 88%)",
  fragment: `${HEADER}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  float t = uTime * 0.5;

  // The column, leaning a little towards the cursor.
  float centre = 0.30 + (uPointer.x - 0.5) * 0.10;
  float lean = p.x - centre - p.y * 0.12;
  float column = smoothstep(0.40, 0.0, abs(lean) * 1.35);

  // Filaments: two scales drifting upward at different speeds.
  float coarse = fbm(vec2(p.x * 2.6 + 1.5, p.y * 1.25 - t * 0.55));
  float fine = fbm(vec2(p.x * 6.4 - 2.0, p.y * 2.9 - t * 0.95));
  float body = column * (0.28 + 1.05 * coarse) * (0.45 + 0.95 * fine);

  // It fades out at the top and foot rather than being cut off.
  body *= smoothstep(-0.62, -0.18, p.y) * smoothstep(0.66, 0.16, p.y);

  vec3 col = CANVAS;
  col = mix(col, SOFT, smoothstep(0.03, 0.34, body));
  col = mix(col, ACCENT, smoothstep(0.22, 0.62, body) * 0.85);
  col = mix(col, PRIMARY, smoothstep(0.46, 0.92, body));
  col += vec3(1.0) * smoothstep(0.80, 1.15, body) * 0.7;

  col = settle(col, uv, 1.9);
  fragColor = vec4(grain(col, gl_FragCoord.xy, uTime), 1.0);
}`,
};

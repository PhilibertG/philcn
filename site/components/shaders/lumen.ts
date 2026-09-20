import { HEADER } from "./common";

/**
 * Lumen — a lit, glossy mass.
 *
 * The shape comes from signed distances, a handful of circles melted into one
 * another, so its edges stay clean at any size. The slope of that field then
 * stands in for a surface normal, which is what gives the shading, the hard
 * specular and the rim light. Noise only nudges the outline.
 */
export const lumen = {
  name: "Lumen",
  note: "A lit, glossy mass — the brand book's own hero.",
  fallback:
    "radial-gradient(58% 55% at 64% 42%, #5271FF 0%, #B7A7FF 36%, #DDE5FF 62%, #F7F8FC 86%)",
  fragment: `${HEADER}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float field(vec2 p, float t) {
  float d = length(p - vec2(0.46 + 0.045 * sin(t * 0.62), 0.06 + 0.035 * cos(t * 0.51))) - 0.40;
  d = smin(d, length(p - vec2(0.17 + 0.05 * cos(t * 0.44), -0.24 + 0.045 * sin(t * 0.38))) - 0.29, 0.34);
  d = smin(d, length(p - vec2(0.66 + 0.04 * sin(t * 0.33), -0.02 + 0.05 * cos(t * 0.29))) - 0.30, 0.30);
  d = smin(d, length(p - vec2(0.28 + 0.03 * cos(t * 0.27), 0.33 + 0.045 * sin(t * 0.41))) - 0.24, 0.28);
  d += (fbm(p * 2.1 + vec2(t * 0.15, -t * 0.11)) - 0.5) * 0.14;
  return d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  float t = uTime * 0.16;
  vec2 q = (p - vec2(0.22, 0.07)) * 0.62;
  q += (uPointer - 0.5) * 0.04;

  float d = field(q, t);
  float inside = smoothstep(0.02, -0.34, d);

  vec2 e = vec2(0.0035, 0.0);
  vec2 slope = vec2(
    field(q + e.xy, t) - field(q - e.xy, t),
    field(q + e.yx, t) - field(q - e.yx, t)
  ) / (2.0 * e.x);
  vec3 normal = normalize(vec3(slope * 0.55, 1.0));

  vec3 lightDir = normalize(vec3(-0.42, 0.72, 0.58));
  float diffuse = clamp(dot(normal, lightDir) * 0.5 + 0.5, 0.0, 1.0);
  vec3 view = vec3(0.0, 0.0, 1.0);
  float specular = pow(clamp(dot(reflect(-lightDir, normal), view), 0.0, 1.0), 26.0);
  float rim = pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 2.4);

  vec3 col = CANVAS;
  col = mix(col, SOFT, smoothstep(0.02, 0.42, inside));
  col = mix(col, ACCENT, smoothstep(0.24, 0.66, inside) * 0.75);
  col = mix(col, PRIMARY, smoothstep(0.46, 0.88, inside));
  col = mix(col, DEEP, smoothstep(0.88, 1.0, inside) * (1.0 - diffuse) * 0.55);

  col *= mix(1.0, 0.86 + 0.42 * diffuse, inside);
  col += vec3(1.0) * specular * inside * 0.85;
  col += SOFT * rim * inside * 0.30;

  float ribbonArc = abs(length(p - vec2(0.42, 0.92)) - 0.86);
  float ribbon = smoothstep(0.13, 0.0, ribbonArc) * smoothstep(-0.25, 0.45, p.x);
  col = mix(col, vec3(1.0), ribbon * (0.30 + 0.45 * inside));

  float ringEdge = abs(length((p - vec2(0.44, 0.02)) * vec2(1.0, 1.06)) - 0.63);
  col = mix(col, vec3(1.0), smoothstep(0.006, 0.0, ringEdge) * 0.45);

  col = settle(col, uv, 1.8);
  fragColor = vec4(grain(col, gl_FragCoord.xy, uTime), 1.0);
}`,
};

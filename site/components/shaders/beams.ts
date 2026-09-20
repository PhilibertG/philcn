import { HEADER } from "./common";

/**
 * Beams — broad shafts of light crossing the hero on the diagonal.
 *
 * The plane is turned, then cut into strips. Each strip draws its width, its
 * brightness and its colour from its own number, so they never fall into a
 * pattern, and each fades along its length rather than being cut off. Grain is
 * laid over the lot: without it the wide gradients band, and with it the whole
 * thing reads as printed light rather than as a gradient.
 *
 * Broad and regular is the point — text sits on top of this, and it has to
 * stay legible while the beams move behind it.
 */
export const beams = {
  name: "Beams",
  fallback:
    "linear-gradient(118deg, #0A0B0F 0%, #1B2A6B 26%, #5271FF 44%, #A78BFA 58%, #14163a 74%, #0A0B0F 100%)",
  fragment: `${HEADER}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  float t = uTime * 0.06;

  // Turn the plane, then cut it into strips along one axis.
  vec2 q = rot(-0.66) * p;
  float across = q.x * 1.85 + t + (uPointer.x - 0.5) * 0.12;
  float along = q.y;

  vec3 col = INK;

  // Each strip is drawn from its own number, so no two are alike and the set
  // never settles into a rhythm.
  for (int i = -1; i <= 1; i++) {
    float id = floor(across) + float(i);
    float f = across - id;

    float width = 0.30 + 0.62 * hash(vec2(id, 3.7));
    float lift = 0.25 + 0.95 * pow(hash(vec2(id, 11.3)), 1.5);
    float hue = hash(vec2(id, 19.1));
    float drift = (hash(vec2(id, 5.2)) - 0.5) * 0.5;

    // The strip's profile: soft on one edge, sharper on the other, the way a
    // beam of light falls off.
    float edge = smoothstep(0.0, 0.30 * width, f) * smoothstep(width, width * 0.55, f);

    // It fades along its length instead of stopping dead.
    float run = smoothstep(-1.15, 0.05, along + drift) * smoothstep(1.05, -0.05, along + drift);

    float beam = edge * run * lift;

    vec3 tint = mix(PRIMARY, ACCENT, hue);
    tint = mix(tint, SOFT, pow(beam, 2.4) * 0.65);

    col += tint * beam * 1.45;
  }

  // A slow swell across the middle, so the set breathes rather than sitting
  // still at one brightness.
  float swell = 0.55 + 0.45 * sin(uTime * 0.22 + p.x * 1.4);
  col *= mix(0.82, 1.22, swell);

  // The centre is lifted a touch: the headline sits there.
  col += PRIMARY * smoothstep(0.85, 0.0, length((uv - vec2(0.5, 0.52)) * vec2(1.35, 1.0))) * 0.05;

  // It stops short of every edge rather than meeting the card with a line.
  float frame = smoothstep(1.25, 0.32, length((uv - vec2(0.5, 0.5)) * vec2(1.1, 1.0)));
  col = mix(INK, col, clamp(frame * 1.5, 0.0, 1.0));

  // Grain, and plenty of it. This is what makes the light look printed.
  float g = hash(gl_FragCoord.xy * 0.9 + fract(uTime) * 91.0) - 0.5;
  col += g * 0.048;

  fragColor = vec4(max(col, INK * 0.6), 1.0);
}`,
};

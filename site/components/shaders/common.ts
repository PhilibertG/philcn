/**
 * The pieces every hero background shares: the header, the noise, and the
 * brand palette. Kept in one place so the backgrounds differ only where they
 * actually differ.
 */
export const HEADER = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
out vec4 fragColor;

// -- brand book ---------------------------------------------------------
const vec3 CANVAS  = vec3(0.969, 0.973, 0.988); // #F7F8FC
const vec3 SOFT    = vec3(0.867, 0.898, 1.000); // #DDE5FF
const vec3 PRIMARY = vec3(0.322, 0.443, 1.000); // #5271FF
const vec3 ACCENT  = vec3(0.718, 0.655, 1.000); // #B7A7FF
const vec3 DEEP    = vec3(0.145, 0.220, 0.760);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    total += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return total;
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

/**
 * Keeps the headline on plain canvas and stops the field short of every edge,
 * so it never meets the page with a hard line. Every background ends with it.
 */
vec3 settle(vec3 col, vec2 uv, float strength) {
  float lean = smoothstep(0.14, 0.50, uv.x);
  float farRight = smoothstep(1.04, 0.86, uv.x);
  float bottom = smoothstep(0.0, 0.30, uv.y);
  float edges = smoothstep(1.40, 0.26, length((uv - vec2(0.72, 0.52)) * vec2(0.86, 1.0)));
  return mix(CANVAS, col, clamp(lean * farRight * bottom * edges * strength, 0.0, 1.0));
}

/** Without a little grain, wide gradients band on cheap panels. */
vec3 grain(vec3 col, vec2 fragCoord, float t) {
  return col + (hash(fragCoord * 0.7 + fract(t)) - 0.5) * 0.014;
}
`;

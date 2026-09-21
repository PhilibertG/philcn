/**
 * The pieces the hero background is built from. Kept apart from the shader
 * itself so the shader is only what makes it that shader.
 */
export const HEADER = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
out vec4 fragColor;

// -- brand book, on ink -------------------------------------------------
const vec3 INK     = vec3(0.039, 0.043, 0.059); // #0A0B0F
const vec3 PRIMARY = vec3(0.322, 0.443, 1.000); // #5271FF
const vec3 ACCENT  = vec3(0.655, 0.545, 0.980); // #A78BFA
const vec3 SOFT    = vec3(0.867, 0.898, 1.000); // #DDE5FF

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

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}
`;

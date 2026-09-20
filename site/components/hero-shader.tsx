"use client";

import * as React from "react";

/**
 * The moving field behind the hero.
 *
 * It is a single full-screen fragment shader, written here rather than pulled
 * from a 3D library: philcn takes no dependency it does not need, and neither
 * does its site. The colours are the brand palette, and the motion is slow
 * enough to read as light shifting rather than an animation playing.
 */

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
out vec4 fragColor;

/**
 * A lit glossy mass, not a cloud.
 *
 * The shape is built from signed distances — a handful of circles melted into
 * one another — so its edges stay clean however far you zoom. The surface is
 * then lit: the slope of the field stands in for a normal, which gives the
 * soft shading and the hard specular the brand book's hero has. Noise only
 * nudges the outline so it is never perfectly round.
 */

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

/** Melts one shape into another instead of creasing where they meet. */
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float circle(vec2 p, vec2 c, float r) {
  return length(p - c) - r;
}

float field(vec2 p, float t) {
  float d = circle(p, vec2(0.46 + 0.045 * sin(t * 0.62), 0.06 + 0.035 * cos(t * 0.51)), 0.40);
  d = smin(d, circle(p, vec2(0.17 + 0.05 * cos(t * 0.44), -0.24 + 0.045 * sin(t * 0.38)), 0.29), 0.34);
  d = smin(d, circle(p, vec2(0.66 + 0.04 * sin(t * 0.33), -0.02 + 0.05 * cos(t * 0.29)), 0.30), 0.30);
  d = smin(d, circle(p, vec2(0.28 + 0.03 * cos(t * 0.27), 0.33 + 0.045 * sin(t * 0.41)), 0.24), 0.28);
  // A slow ripple along the outline, so the mass never looks like stacked discs.
  d += (fbm(p * 2.1 + vec2(t * 0.15, -t * 0.11)) - 0.5) * 0.14;
  return d;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

  float t = uTime * 0.16;

  // Scaled down and shifted: the mass reads large and runs off the right
  // edge, the way the brand book's hero does.
  vec2 q = (p - vec2(0.22, 0.07)) * 0.62;
  float d = field(q, t);

  // How far inside the mass this pixel sits: 0 outside, 1 deep in.
  float inside = smoothstep(0.02, -0.34, d);

  // The slope of the field, read as a surface normal. This is what turns a
  // flat silhouette into something that looks lit and rounded.
  vec2 e = vec2(0.0035, 0.0);
  vec2 slope = vec2(
    field(q + e.xy, t) - field(q - e.xy, t),
    field(q + e.yx, t) - field(q - e.yx, t)
  ) / (2.0 * e.x);
  vec3 normal = normalize(vec3(slope * 0.55, 1.0));

  vec3 light = normalize(vec3(-0.42, 0.72, 0.58));
  float diffuse = clamp(dot(normal, light) * 0.5 + 0.5, 0.0, 1.0);
  vec3 view = vec3(0.0, 0.0, 1.0);
  float specular = pow(clamp(dot(reflect(-light, normal), view), 0.0, 1.0), 26.0);
  float rim = pow(1.0 - clamp(dot(normal, view), 0.0, 1.0), 2.4);

  // -- palette, straight from the brand book --------------------------------
  vec3 canvas  = vec3(0.969, 0.973, 0.988); // #F7F8FC
  vec3 soft    = vec3(0.867, 0.898, 1.000); // #DDE5FF
  vec3 primary = vec3(0.322, 0.443, 1.000); // #5271FF
  vec3 accent  = vec3(0.718, 0.655, 1.000); // #B7A7FF
  vec3 deep    = vec3(0.145, 0.220, 0.760);

  // Depth first, then light on top of it.
  vec3 col = canvas;
  col = mix(col, soft, smoothstep(0.02, 0.42, inside));
  col = mix(col, accent, smoothstep(0.24, 0.66, inside) * 0.75);
  col = mix(col, primary, smoothstep(0.46, 0.88, inside));
  col = mix(col, deep, smoothstep(0.88, 1.0, inside) * (1.0 - diffuse) * 0.55);

  col *= mix(1.0, 0.86 + 0.42 * diffuse, inside);
  col += vec3(1.0) * specular * inside * 0.85;
  col += soft * rim * inside * 0.30;

  // A light catching the top of the mass and running off it — the white
  // ribbon in the brand book's hero.
  float ribbonArc = abs(length(p - vec2(0.42, 0.92)) - 0.86);
  float ribbon = smoothstep(0.13, 0.0, ribbonArc) * smoothstep(-0.25, 0.45, p.x);
  col = mix(col, vec3(1.0), ribbon * (0.30 + 0.45 * inside));

  // The wide circle drawn behind everything, barely there.
  float ringEdge = abs(length((p - vec2(0.44, 0.02)) * vec2(1.0, 1.06)) - 0.63);
  col = mix(col, vec3(1.0), smoothstep(0.006, 0.0, ringEdge) * 0.45);

  // The headline sits on plain canvas, and the field never meets an edge of
  // the page with a hard line.
  float lean = smoothstep(0.16, 0.50, uv.x);
  float farRight = smoothstep(1.02, 0.84, uv.x);
  float bottom = smoothstep(0.02, 0.34, uv.y);
  float edges = smoothstep(1.40, 0.28, length((uv - vec2(0.72, 0.52)) * vec2(0.86, 1.0)));
  col = mix(canvas, col, clamp(lean * farRight * bottom * edges * 1.8, 0.0, 1.0));

  // A little grain: without it the wide gradients band on cheap panels.
  col += (hash(gl_FragCoord.xy * 0.7 + fract(uTime)) - 0.5) * 0.014;

  fragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader === null) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HeroShader({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (gl === null) {
      setFailed(true);
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (vertex === null || fragment === null || program === null) {
      setFailed(true);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    // One triangle large enough to cover the screen — cheaper than two, and it
    // avoids the seam a quad leaves down the diagonal.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let start = performance.now();

    const resize = () => {
      // Half resolution is plenty for a soft gradient and keeps a laptop fan
      // quiet; the browser scales it back up for free.
      const ratio = Math.min(window.devicePixelRatio, 2) * 0.5;
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const draw = (now: number) => {
      resize();
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, stillness.matches ? 8 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    // A tab in the background gets no frames, and comes back without a jump.
    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
      } else {
        start = performance.now() - 8000;
        frame = window.requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, []);

  if (failed) {
    // No WebGL: a still gradient in the same colours rather than a blank panel.
    return (
      <div
        className={className}
        style={{
          background:
            "radial-gradient(60% 55% at 62% 45%, #5271FF 0%, #A78BFA 38%, #DDE5FF 62%, #F7F8FC 85%)",
        }}
        aria-hidden
      />
    );
  }

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

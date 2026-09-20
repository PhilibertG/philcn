"use client";

import * as React from "react";

/**
 * Runs one fragment shader over a full-screen canvas.
 *
 * Every hero background shares this: the WebGL plumbing, the half-resolution
 * buffer that keeps a laptop quiet, the still frame under reduced motion, and
 * the pause when the tab goes away. Each background is then only its own
 * fragment shader and a fallback gradient.
 */

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader === null) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export interface ShaderCanvasProps {
  /** The fragment shader. It reads `uResolution`, `uTime` and `uPointer`. */
  fragment: string;
  /** Shown instead when WebGL is missing or the shader will not compile. */
  fallback: string;
  className?: string;
}

export function ShaderCanvas({ fragment, fallback, className }: ShaderCanvasProps) {
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
    const shader = compile(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (vertex === null || shader === null || program === null) {
      setFailed(true);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, shader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    // One triangle large enough to cover the screen — cheaper than two, and it
    // leaves no seam down the diagonal.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");

    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.5, y: 0.5, toX: 0.5, toY: 0.5 };
    let frame = 0;
    let start = performance.now();

    const onPointerMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer.toX = (event.clientX - box.left) / box.width;
      pointer.toY = 1 - (event.clientY - box.top) / box.height;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      // Half resolution is plenty for a soft field and keeps a laptop fan
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
      // The pointer eases towards the cursor, so the field never snaps.
      pointer.x += (pointer.toX - pointer.x) * 0.06;
      pointer.y += (pointer.toY - pointer.y) * 0.06;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uTime, stillness.matches ? 8 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    // A background tab gets no frames, and comes back without a jump.
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
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(shader);
      gl.deleteBuffer(buffer);
    };
  }, [fragment]);

  if (failed) {
    return <div className={className} style={{ background: fallback }} aria-hidden />;
  }

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

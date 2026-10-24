"use client";

import { useEffect, useRef } from "react";

interface LivingShaderProps {
  className?: string;
  speed?: number;
  opacity?: number;
}

export function LivingShader({
  className = "",
  speed = 0.0006,
  opacity = 0.75,
}: LivingShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;

    const handleMediaChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      // Fallback for browsers without WebGL
      return;
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // React Bits / Stripe-caliber Iridescent Silk Shader
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_opacity;

      // Fractional Brownian Motion for silk-like organic flow
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 4; ++i) {
          v += a * noise(p);
          p = rot * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Subtle mouse influence
        vec2 mouse = u_mouse / u_resolution.xy;
        vec2 mOffset = (mouse - 0.5) * 0.15;

        vec2 q = vec2(0.0);
        q.x = fbm(st + 0.05 * u_time + mOffset);
        q.y = fbm(st + vec2(1.0) + mOffset);

        vec2 r = vec2(0.0);
        r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.12 * u_time);
        r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.10 * u_time);

        float f = fbm(st + r);

        // Curated Warm Amber & Deep Obsidian Palette
        vec3 colorBg = vec3(0.03, 0.03, 0.04);       // Deep Obsidian
        vec3 colorAmber = vec3(0.96, 0.62, 0.07);    // Amber #f59e0b
        vec3 colorGold = vec3(0.98, 0.75, 0.14);     // Gold #fbbf24
        vec3 colorBronze = vec3(0.75, 0.40, 0.05);   // Warm Bronze

        vec3 color = mix(colorBg, colorBronze, clamp((f * f) * 2.5, 0.0, 1.0));
        color = mix(color, colorAmber, clamp(length(q) * 0.75, 0.0, 1.0));
        color = mix(color, colorGold, clamp(length(r.x) * 0.45, 0.0, 1.0));

        // Vignette effect to fade smoothly into page background
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float d = distance(uv, vec2(0.5, 0.3));
        float vignette = smoothstep(0.85, 0.15, d);

        gl_FragColor = vec4(color * 0.65, clamp(f * vignette * u_opacity, 0.0, 1.0));
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const opacityLocation = gl.getUniformLocation(program, "u_opacity");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    let animationFrameId: number;
    let startTime = performance.now();
    let mouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = rect.height - (e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const render = (now: number) => {
      resize();

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      const elapsed = isReducedMotion ? 0 : (now - startTime) * speed;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform2f(mouseLocation, mouse.x * (window.devicePixelRatio || 1), mouse.y * (window.devicePixelRatio || 1));
      gl.uniform1f(opacityLocation, opacity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      mediaQuery.removeEventListener("change", handleMediaChange);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
      if (program) gl.deleteProgram(program);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
    };
  }, [speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}

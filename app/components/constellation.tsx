import React, { useEffect, useRef } from "react";

interface ConstellationProps {
  className?: string;
}

interface Star {
  // resting position, in CSS pixels
  x: number;
  y: number;
  // slow drift per frame
  vx: number;
  vy: number;
  // depth from 0 (far) to 1 (near); drives size, brightness, parallax and links
  z: number;
  size: number;
  alpha: number;
  phase: number;
  twinkle: number;
  // smoothed offset from the cursor's pull
  ox: number;
  oy: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const PIXELS_PER_STAR = 4200;
const MAX_STARS = 320;
const LINK_DISTANCE = 125;
const CURSOR_RADIUS = 230;
const CURSOR_PULL = 30;
const PARALLAX = 28;
const INTRO_MS = 2400;
const METEOR_LENGTH = 160;
const ACCENT = "165, 180, 252"; // tailwind indigo-300
// stars are sub-pixel dots, so rendering past 2x density costs fill rate for nothing
const MAX_DPR = 2;
// alpha is quantized so each layer draws in at most this many fill/stroke calls
const ALPHA_STEPS = 16;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

const alphaBuckets = (): Path2D[] =>
  Array.from({ length: ALPHA_STEPS + 1 }, () => new Path2D());

const bucketOf = (alpha: number): number =>
  Math.round(clamp01(alpha) * ALPHA_STEPS);

function drawBuckets(
  ctx: CanvasRenderingContext2D,
  buckets: Path2D[],
  mode: "fill" | "stroke",
): void {
  for (let k = 1; k <= ALPHA_STEPS; k++) {
    ctx.globalAlpha = k / ALPHA_STEPS;
    if (mode === "fill") ctx.fill(buckets[k]);
    else ctx.stroke(buckets[k]);
  }
  ctx.globalAlpha = 1;
}
const easeOutExpo = (t: number): number => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));

function createStar(w: number, h: number): Star {
  const z = Math.random() ** 1.6;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.12 * (0.3 + z),
    vy: (Math.random() - 0.5) * 0.12 * (0.3 + z),
    z,
    size: 0.35 + z * 1.5,
    alpha: 0.25 + z * 0.65,
    phase: Math.random() * Math.PI * 2,
    twinkle: 0.0008 + Math.random() * 0.0025,
    ox: 0,
    oy: 0,
  };
}

function createMeteor(w: number, h: number): Meteor {
  const speed = 9 + Math.random() * 6;
  const angle = Math.PI * (0.78 + Math.random() * 0.1); // down and to the left
  return {
    x: w * (0.35 + Math.random() * 0.75),
    y: -20 + Math.random() * h * 0.3,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
  };
}

/**
 * Interactive starfield: stars burst out from the center on load, drift with
 * depth-based parallax, link up with nearby stars, and reach for the cursor.
 * Renders a single static frame when the user prefers reduced motion.
 */
export default function Constellation({ className = "" }: ConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    const size = { w: 0, h: 0 };
    const cursor = { x: 0, y: 0, active: false };
    const parallax = { x: 0, y: 0 };
    let stars: Star[] = [];
    // per-star screen position and opacity, reused across frames
    let sx = new Float32Array(0);
    let sy = new Float32Array(0);
    let visibility = new Float32Array(0);
    let meteors: Meteor[] = [];
    let nextMeteorAt = 3500;
    let start = performance.now();
    let frameId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      size.w = container.offsetWidth;
      size.h = container.offsetHeight;
      canvas.width = size.w * dpr;
      canvas.height = size.h * dpr;
      canvas.style.width = `${size.w}px`;
      canvas.style.height = `${size.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        MAX_STARS,
        Math.round((size.w * size.h) / PIXELS_PER_STAR),
      );
      stars = Array.from({ length: count }, () => createStar(size.w, size.h));
      sx = new Float32Array(count);
      sy = new Float32Array(count);
      visibility = new Float32Array(count);
    };

    const draw = (now: number) => {
      const { w, h } = size;
      const cx = w / 2;
      const cy = h / 2;
      const elapsed = now - start;

      // ease the parallax toward the cursor so it glides instead of snapping
      const targetX = cursor.active ? (cursor.x - cx) / cx : 0;
      const targetY = cursor.active ? (cursor.y - cy) / cy : 0;
      parallax.x += (targetX - parallax.x) * 0.04;
      parallax.y += (targetY - parallax.y) * 0.04;

      ctx.clearRect(0, 0, w, h);

      const halos = alphaBuckets();
      const dots = alphaBuckets();

      stars.forEach((star, i) => {
        if (!reducedMotion) {
          star.x += star.vx;
          star.y += star.vy;
          // wrap around the edges so the field never thins out
          if (star.x < -20) star.x += w + 40;
          if (star.x > w + 20) star.x -= w + 40;
          if (star.y < -20) star.y += h + 40;
          if (star.y > h + 20) star.y -= h + 40;
        }

        // far stars arrive a little later than near ones
        const intro = reducedMotion
          ? 1
          : easeOutExpo(clamp01((elapsed - (1 - star.z) * 500) / INTRO_MS));
        let x =
          cx + (star.x - cx) * intro - parallax.x * PARALLAX * (0.2 + star.z);
        let y =
          cy + (star.y - cy) * intro - parallax.y * PARALLAX * (0.2 + star.z);

        let pullX = 0;
        let pullY = 0;
        if (cursor.active) {
          const dx = cursor.x - x;
          const dy = cursor.y - y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_RADIUS && d > 0.001) {
            const force = (1 - d / CURSOR_RADIUS) ** 2 * CURSOR_PULL * star.z;
            pullX = (dx / d) * force;
            pullY = (dy / d) * force;
          }
        }
        star.ox += (pullX - star.ox) * 0.08;
        star.oy += (pullY - star.oy) * 0.08;
        x += star.ox;
        y += star.oy;

        const shimmer = reducedMotion
          ? 1
          : 0.6 + 0.4 * Math.sin(now * star.twinkle + star.phase);
        const a = star.alpha * shimmer * clamp01(intro * 1.4);

        sx[i] = x;
        sy[i] = y;
        visibility[i] = a;

        if (star.z > 0.75) {
          // soft halo on the nearest stars
          const halo = halos[bucketOf(a * 0.18)];
          halo.moveTo(x + star.size * 3.5, y);
          halo.arc(x, y, star.size * 3.5, 0, Math.PI * 2);
        }
        const dot = dots[bucketOf(a)];
        dot.moveTo(x + star.size, y);
        dot.arc(x, y, star.size, 0, Math.PI * 2);
      });

      ctx.fillStyle = `rgb(${ACCENT})`;
      drawBuckets(ctx, halos, "fill");
      ctx.fillStyle = "#fff";
      drawBuckets(ctx, dots, "fill");

      // constellation lines between nearby foreground stars
      const whiteLines = alphaBuckets();
      const accentLines = alphaBuckets();
      for (let i = 0; i < stars.length; i++) {
        if (stars[i].z < 0.3) continue;
        for (let j = i + 1; j < stars.length; j++) {
          if (stars[j].z < 0.3) continue;
          const dx = sx[i] - sx[j];
          const dy = sy[i] - sy[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DISTANCE * LINK_DISTANCE) continue;

          const d = Math.sqrt(d2);
          let a =
            (1 - d / LINK_DISTANCE) *
            0.4 *
            Math.min(visibility[i], visibility[j]);
          let lines = whiteLines;
          if (cursor.active) {
            const mx = (sx[i] + sx[j]) / 2 - cursor.x;
            const my = (sy[i] + sy[j]) / 2 - cursor.y;
            const near = 1 - Math.hypot(mx, my) / CURSOR_RADIUS;
            if (near > 0) {
              a += near * 0.7 * Math.min(visibility[i], visibility[j]);
              lines = accentLines;
            }
          }
          const line = lines[bucketOf(a)];
          line.moveTo(sx[i], sy[i]);
          line.lineTo(sx[j], sy[j]);
        }
      }

      // the cursor itself joins the constellation
      if (cursor.active) {
        for (let i = 0; i < stars.length; i++) {
          if (stars[i].z < 0.3) continue;
          const d = Math.hypot(sx[i] - cursor.x, sy[i] - cursor.y);
          if (d > CURSOR_RADIUS * 0.8) continue;
          const line =
            accentLines[
              bucketOf((1 - d / (CURSOR_RADIUS * 0.8)) * 0.75 * visibility[i])
            ];
          line.moveTo(cursor.x, cursor.y);
          line.lineTo(sx[i], sy[i]);
        }
      }

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "#fff";
      drawBuckets(ctx, whiteLines, "stroke");
      ctx.strokeStyle = `rgb(${ACCENT})`;
      drawBuckets(ctx, accentLines, "stroke");

      if (!reducedMotion) {
        if (elapsed > nextMeteorAt) {
          meteors.push(createMeteor(w, h));
          nextMeteorAt = elapsed + 4000 + Math.random() * 6000;
        }
        meteors = meteors.filter(
          (m) => m.x > -METEOR_LENGTH && m.y < h + METEOR_LENGTH,
        );
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        for (const m of meteors) {
          m.x += m.vx;
          m.y += m.vy;
          m.life += 1;
          const speed = Math.hypot(m.vx, m.vy);
          const tailX = m.x - (m.vx / speed) * METEOR_LENGTH;
          const tailY = m.y - (m.vy / speed) * METEOR_LENGTH;
          const fade = clamp01(m.life / 10);
          const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * fade})`);
          gradient.addColorStop(0.3, `rgba(${ACCENT}, ${0.35 * fade})`);
          gradient.addColorStop(1, `rgba(${ACCENT}, 0)`);
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.strokeStyle = gradient;
          ctx.stroke();
        }
      }
    };

    const loop = (now: number) => {
      draw(now);
      frameId = window.requestAnimationFrame(loop);
    };

    // jump past the intro burst, keeping the next shooting star as far away
    const skipIntro = () => {
      const now = performance.now();
      const untilMeteor = Math.max(0, nextMeteorAt - (now - start));
      start = now - INTRO_MS - 500;
      nextMeteorAt = now - start + untilMeteor;
    };

    const onResize = () => {
      resize();
      // don't replay the intro burst on every resize
      skipIntro();
      if (reducedMotion) draw(performance.now());
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      window.cancelAnimationFrame(frameId);
      if (reducedMotion) {
        meteors = [];
        draw(performance.now());
      } else {
        skipIntro();
        frameId = window.requestAnimationFrame(loop);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      cursor.x = event.clientX - rect.left;
      cursor.y = event.clientY - rect.top;
      cursor.active = true;
      const spotlight = spotlightRef.current;
      if (spotlight) {
        spotlight.style.setProperty("--x", `${cursor.x}px`);
        spotlight.style.setProperty("--y", `${cursor.y}px`);
        spotlight.style.opacity = "1";
      }
    };

    const deactivateCursor = () => {
      cursor.active = false;
      if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    };

    // a mouse stays on the page after a click; touch and pen lift off it
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") deactivateCursor();
    };

    resize();
    if (reducedMotion) {
      draw(performance.now());
    } else {
      start = performance.now();
      frameId = window.requestAnimationFrame(loop);
    }

    window.addEventListener("resize", onResize);
    motionQuery.addEventListener("change", onMotionChange);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    document.documentElement.addEventListener("pointerleave", deactivateCursor);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener(
        "pointerleave",
        deactivateCursor,
      );
    };
  }, []);

  return (
    <div className={className} ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-700 opacity-0 pointer-events-none"
        style={{
          background: `radial-gradient(520px circle at var(--x, 50%) var(--y, 50%), rgba(${ACCENT}, 0.13), transparent 70%)`,
        }}
      />
    </div>
  );
}

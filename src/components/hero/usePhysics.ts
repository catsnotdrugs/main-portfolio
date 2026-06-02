import { useEffect, useRef, useState, type RefObject } from "react";
import type { HeroObjectDef } from "../../data/profile";

// ---------------------------------------------------------------------------
// A tiny, dependency-free 2D physics toy. Bodies live in a ref and the rAF loop
// writes transforms imperatively, so React never re-renders during motion.
// Gravity + walls + circle collisions + drag/fling, and it sleeps when still.
// ---------------------------------------------------------------------------

type Body = {
  x: number; // center x, px
  y: number; // center y, px
  vx: number;
  vy: number;
  r: number;
  baseR: number;
  mass: number;
  angle: number; // degrees
  grabbed: boolean;
  targetX: number;
  targetY: number;
  grabOffsetX: number;
  grabOffsetY: number;
};

type Size = { w: number; h: number };

// Zero-gravity float: toys rest where you leave them in the open hero space,
// glide when flung, bounce off the edges, and bump into each other. Cleaner and
// more premium than a pile on the floor, and it keeps the bold name uncluttered.
const AIR = 0.965; // velocity damping per frame; flings glide then settle
const WALL_RESTITUTION = 0.7;
const COLLISION_RESTITUTION = 0.6;
const MAX_FLING = 36;
const SLEEP_SPEED = 0.12; // px/frame below which a resting body is considered asleep
const DRAG_FOLLOW = 0.42;
const SPIN = 1.05;

function radiusFor(baseR: number, width: number): number {
  if (width < 560) return baseR * 0.66;
  if (width < 880) return baseR * 0.82;
  return baseR;
}

export function usePhysics(opts: {
  defs: HeroObjectDef[];
  stageRef: RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<(HTMLDivElement | null)[]>;
  reducedMotion: boolean;
}): { ready: boolean } {
  const { defs, stageRef, itemRefs, reducedMotion } = opts;
  const [ready, setReady] = useState(false);

  const bodiesRef = useRef<Body[]>([]);
  const sizeRef = useRef<Size>({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = (): Size => {
      const rect = stage.getBoundingClientRect();
      return { w: rect.width, h: rect.height };
    };

    const writeTransforms = () => {
      const items = itemRefs.current ?? [];
      bodiesRef.current.forEach((b, i) => {
        const el = items[i];
        if (!el) return;
        const size = b.r * 2;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0) rotate(${b.angle}deg)`;
      });
    };

    const initBodies = () => {
      const { w, h } = sizeRef.current;
      bodiesRef.current = defs.map((def, index) => {
        const r = radiusFor(def.radius, w);
        const x = (def.start.x / 100) * w;
        const y = (def.start.y / 100) * h;
        const dir = index % 2 === 0 ? 1 : -1;
        return {
          x,
          y,
          // a whisper of initial drift so the toys ease into place on load
          vx: dir * 0.5,
          vy: -0.45,
          r,
          baseR: def.radius,
          mass: r * r,
          angle: 0,
          grabbed: false,
          targetX: x,
          targetY: y,
          grabOffsetX: 0,
          grabOffsetY: 0,
        };
      });
    };

    const clampIntoBounds = () => {
      const { w, h } = sizeRef.current;
      for (const b of bodiesRef.current) {
        b.r = radiusFor(b.baseR, w);
        b.mass = b.r * b.r;
        b.x = Math.min(Math.max(b.x, b.r), Math.max(b.r, w - b.r));
        b.y = Math.min(Math.max(b.y, b.r), Math.max(b.r, h - b.r));
      }
    };

    const resolveCollisions = () => {
      const bodies = bodiesRef.current;
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const minDist = a.r + b.r;
          if (dist >= minDist) continue;

          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;

          const aInv = a.grabbed ? 0 : 1 / a.mass;
          const bInv = b.grabbed ? 0 : 1 / b.mass;
          const invSum = aInv + bInv || 1;

          a.x -= nx * overlap * (aInv / invSum);
          a.y -= ny * overlap * (aInv / invSum);
          b.x += nx * overlap * (bInv / invSum);
          b.y += ny * overlap * (bInv / invSum);

          const rvx = b.vx - a.vx;
          const rvy = b.vy - a.vy;
          const velAlongNormal = rvx * nx + rvy * ny;
          if (velAlongNormal > 0) continue;

          const jImpulse = (-(1 + COLLISION_RESTITUTION) * velAlongNormal) / invSum;
          const ix = jImpulse * nx;
          const iy = jImpulse * ny;
          a.vx -= ix * aInv;
          a.vy -= iy * aInv;
          b.vx += ix * bInv;
          b.vy += iy * bInv;
        }
      }
    };

    const step = () => {
      const { w, h } = sizeRef.current;
      let awake = false;

      for (const b of bodiesRef.current) {
        if (b.grabbed) {
          const nx = b.x + (b.targetX - b.x) * DRAG_FOLLOW;
          const ny = b.y + (b.targetY - b.y) * DRAG_FOLLOW;
          b.vx = nx - b.x;
          b.vy = ny - b.y;
          b.x = nx;
          b.y = ny;
          b.angle += b.vx * SPIN * 0.6;
          awake = true;
        } else if (!reducedMotion) {
          b.vx *= AIR;
          b.vy *= AIR;
          b.x += b.vx;
          b.y += b.vy;

          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = -b.vx * WALL_RESTITUTION;
          } else if (b.x + b.r > w) {
            b.x = w - b.r;
            b.vx = -b.vx * WALL_RESTITUTION;
          }
          if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = -b.vy * WALL_RESTITUTION;
          } else if (b.y + b.r > h) {
            b.y = h - b.r;
            b.vy = -b.vy * WALL_RESTITUTION;
          }
          b.angle += b.vx * SPIN;

          if (Math.abs(b.vx) > SLEEP_SPEED || Math.abs(b.vy) > SLEEP_SPEED) {
            awake = true;
          }
        }
      }

      resolveCollisions();
      writeTransforms();

      if (awake) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        runningRef.current = false;
        rafRef.current = null;
      }
    };

    const wake = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(step);
    };

    // --- pointer handling -------------------------------------------------
    const bodyFromEvent = (index: number) => bodiesRef.current[index];

    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      for (const b of bodiesRef.current) {
        if (b.grabbed) {
          b.targetX = px - b.grabOffsetX;
          b.targetY = py - b.grabOffsetY;
        }
      }
    };

    const cleanups: Array<() => void> = [];
    const items = itemRefs.current ?? [];
    items.forEach((el, index) => {
      if (!el) return;
      const onDown = (event: PointerEvent) => {
        const b = bodyFromEvent(index);
        if (!b) return;
        event.preventDefault();
        el.setPointerCapture?.(event.pointerId);
        const rect = stage.getBoundingClientRect();
        const px = event.clientX - rect.left;
        const py = event.clientY - rect.top;
        b.grabbed = true;
        b.grabOffsetX = px - b.x;
        b.grabOffsetY = py - b.y;
        b.targetX = b.x;
        b.targetY = b.y;
        el.style.cursor = "grabbing";
        wake();
      };
      const onUp = (event: PointerEvent) => {
        const b = bodyFromEvent(index);
        if (!b || !b.grabbed) return;
        el.releasePointerCapture?.(event.pointerId);
        b.grabbed = false;
        if (reducedMotion) {
          b.vx = 0;
          b.vy = 0;
        } else {
          b.vx = Math.max(-MAX_FLING, Math.min(MAX_FLING, b.vx));
          b.vy = Math.max(-MAX_FLING, Math.min(MAX_FLING, b.vy));
        }
        el.style.cursor = "grab";
        wake();
      };
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      cleanups.push(() => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
      });
    });
    window.addEventListener("pointermove", onPointerMove);

    // --- init -------------------------------------------------------------
    sizeRef.current = measure();
    initBodies();
    writeTransforms();
    setReady(true);
    if (!reducedMotion) wake();

    const onResize = () => {
      sizeRef.current = measure();
      clampIntoBounds();
      writeTransforms();
      if (!reducedMotion) wake();
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      rafRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      cleanups.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defs, reducedMotion]);

  return { ready };
}

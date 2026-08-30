"use client";

import { useMemo } from "react";
import {
  Atom,
  Layers,
  FileCode2,
  Database,
  Box,
  Cloud,
  Hexagon,
  Wind,
  type LucideIcon,
} from "lucide-react";

interface ContentRect {
  left: number;
  top: number;
  w: number;
  h: number;
}

interface OrbitProps {
  heroWidth: number | null;
  heroHeight: number | null;
  contentRect: ContentRect | null;
}

// (angle degrees, radius key) per spec. angles: 0° = 3 o'clock, clockwise.
// Icons are mapped to these angles in order (mapping not specified in the
// brief, so the existing tech-icon set keeps its left/right grouping/order).
const DEFS: { icon: LucideIcon; label: string; angle: number; key: "small" | "large" }[] = [
  // Left side
  { icon: Atom, label: "React", angle: 165, key: "small" },
  { icon: Layers, label: "Next.js", angle: 185, key: "large" },
  { icon: FileCode2, label: "TypeScript", angle: 205, key: "large" },
  { icon: Database, label: "PostgreSQL", angle: 225, key: "small" },
  // Right side (mirror)
  { icon: Box, label: "Docker", angle: 15, key: "small" },
  { icon: Hexagon, label: "Node.js", angle: -15, key: "large" },
  { icon: Wind, label: "Tailwind", angle: -25, key: "large" },
  { icon: Cloud, label: "AWS", angle: -45, key: "small" },
];

const ICON_DIAMETER = 40;
const ICON_RADIUS = ICON_DIAMETER / 2;
const SAFETY_GAP = 20;
const BUCKET_STEP = 40;

// Diameter of an icon badge (the padding wrapper is 40px) — same as ICON_DIAMETER.
const BADGE_SIZE = 40;

export function HeroOrbit({ heroWidth, heroHeight, contentRect }: OrbitProps) {
  const spec = useMemo(() => {
    // If runtime measurement hasn't landed yet (effect not run / 0-size layout
    // on first paint), fall back to the hero's designed desktop proportions so
    // the orbit ALWAYS renders instead of silently disappearing.
    const w = heroWidth && heroWidth > 0 ? heroWidth : 1440;
    const h = heroHeight && heroHeight > 0 ? heroHeight : 760;
    const cw =
      contentRect && contentRect.w > 0 ? contentRect.w : 768;
    const cx = w / 2;
    const cy = h / 2;

    // Content rect for the overlap check; the column is horizontally centered
    // in the hero, so derive a fallback rect when measurement hasn't landed.
    const cr = contentRect && contentRect.w > 0
      ? contentRect
      : { left: (w - cw) / 2, top: (h - 760) / 2, w: cw, h: 760 };

    // 3 concentric radii: smallest = half content width + 140px clearances.
    const smallest = cw / 2 + 140;
    const middle = smallest + 140;
    const largest = middle + 140;
    const ringRadii = [smallest, middle, largest];

    const baseRadius = (key: "small" | "large") => (key === "small" ? smallest : largest);

    // Place each icon on its ring; if its 40px circle would touch the content
    // column (center within SAFETY_GAP of the rect), bump radius by 40px.
    const icons = DEFS.map((def) => {
      let r = baseRadius(def.key);
      let x = 0;
      let y = 0;
      for (let i = 0; i < 8; i++) {
        const rad = (def.angle * Math.PI) / 180;
        x = cx + r * Math.cos(rad);
        y = cy + r * Math.sin(rad);

        // Distance from icon center to the nearest point on the content rect
        // (treating the icon as its 40px-diameter circle).
        const dx = Math.max(
          cr.left - (x - ICON_RADIUS),
          0,
          x + ICON_RADIUS - (cr.left + cr.w)
        );
        const dy = Math.max(
          cr.top - (y - ICON_RADIUS),
          0,
          y + ICON_RADIUS - (cr.top + cr.h)
        );
        const dist = Math.hypot(dx, dy);
        if (dist < SAFETY_GAP) {
          r += BUCKET_STEP;
          continue;
        }
        break;
      }
      return {
        icon: def.icon,
        label: def.label,
        angle: def.angle,
        radius: r,
        left: (x / w) * 100,
        top: (y / h) * 100,
        x,
        y,
      };
    });

    // Tick marks for the two innermost icons (165° and 15°): a short 20px
    // diagonal line centered on the icon, angled 45° off the radial.
    const ticks = icons
      .filter((icon) => icon.angle === 165 || icon.angle === 15)
      .map((icon) => {
        const a = ((icon.angle + 45) * Math.PI) / 180;
        const nx = Math.cos(a);
        const ny = Math.sin(a);
        return {
          x1: icon.x - 10 * nx,
          y1: icon.y - 10 * ny,
          x2: icon.x + 10 * nx,
          y2: icon.y + 10 * ny,
        };
      });

    return { w, h, cx, cy, ringRadii, icons, ticks };
  }, [heroWidth, heroHeight, contentRect]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${spec.w} ${spec.h}`}
        className="text-black/10 dark:text-white/10"
      >
        {spec.ringRadii.map((r) => (
          <circle
            key={r}
            cx={spec.cx}
            cy={spec.cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        {spec.ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>

      {spec.icons.map((icon) => {
        const Icon = icon.icon;
        return (
          <div
            key={icon.label}
            className="absolute"
            style={{
              top: `${icon.top}%`,
              left: `${icon.left}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="hero-float flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-muted-foreground shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-card"
              style={{ width: BADGE_SIZE, height: BADGE_SIZE }}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

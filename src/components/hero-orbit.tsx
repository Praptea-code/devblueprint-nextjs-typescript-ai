"use client";

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

interface OrbitBadge {
  icon: LucideIcon;
  label: string;
  radius: number;
  angle: number;
  duration: number;
  delay: number;
}

const BADGES: OrbitBadge[] = [
  { icon: Atom, label: "React", radius: 420, angle: 0, duration: 7, delay: 0 },
  { icon: Layers, label: "Next.js", radius: 420, angle: 200, duration: 6, delay: 0.4 },
  { icon: FileCode2, label: "TypeScript", radius: 310, angle: 40, duration: 8, delay: 1.1 },
  { icon: Database, label: "PostgreSQL", radius: 310, angle: 160, duration: 6.5, delay: 0.2 },
  { icon: Box, label: "Docker", radius: 250, angle: 250, duration: 7.5, delay: 1.6 },
  { icon: Cloud, label: "AWS", radius: 250, angle: 340, duration: 6.8, delay: 0.8 },
  { icon: Hexagon, label: "Node.js", radius: 175, angle: 120, duration: 8.5, delay: 2 },
  { icon: Wind, label: "Tailwind", radius: 175, angle: 300, duration: 7.2, delay: 0.5 },
];

const RINGS = [840, 560, 350];

export function HeroOrbit() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Concentric rings centered behind the headline */}
      {RINGS.map((size) => (
        <div
          key={size}
          className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-400/25 dark:border-white/10"
          style={{ width: size, height: size }}
        />
      ))}

      {/* Floating tech badges along the rings */}
      {BADGES.map((badge) => {
        const Icon = badge.icon;
        const rad = (badge.angle * Math.PI) / 180;
        const x = Math.round(badge.radius * Math.cos(rad));
        const y = Math.round(-badge.radius * Math.sin(rad));
        return (
          <div
            key={badge.label}
            className="absolute left-1/2 top-[38%]"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <div
              className="hero-float flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-card/90 text-muted-foreground shadow-lg dark:border-white/10 dark:bg-card/80"
              style={{
                animationDuration: `${badge.duration}s`,
                animationDelay: `${badge.delay}s`,
              }}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

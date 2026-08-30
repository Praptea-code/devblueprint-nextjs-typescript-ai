"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useTheme } from "next-themes";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface SiteNavProps {
  children?: ReactNode;
}

export function SiteNav({ children }: SiteNavProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  const logoSrc =
    !mounted || resolvedTheme !== "dark" ? "/logo.png" : "/logo2.png";

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt="ArchAI logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="font-semibold text-lg">ArchAI</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {children}
        </div>
      </div>
    </header>
  );
}

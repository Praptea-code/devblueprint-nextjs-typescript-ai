"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Toggle theme"
        className="hover:bg-transparent"
      >
        <Sun className="size-4 text-muted-foreground" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="hover:bg-transparent"
    >
      {isDark ? (
        <Sun className="size-4 text-muted-foreground" />
      ) : (
        <Moon className="size-4 text-muted-foreground" />
      )}
    </Button>
  );
}

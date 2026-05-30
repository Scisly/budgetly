"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5">
        <Label htmlFor="dark-mode">Tryb ciemny</Label>
        <p className="text-sm text-muted-foreground">
          {mounted
            ? "Przełącz między jasnym a ciemnym motywem interfejsu."
            : "Ładowanie…"}
        </p>
      </div>
      <Switch
        id="dark-mode"
        checked={isDark}
        disabled={!mounted}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Tryb ciemny"
      />
    </div>
  );
}

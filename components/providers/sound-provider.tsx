"use client";

import { useEffect } from "react";
import { unlockAudio } from "@/lib/ui-sounds";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleInteraction = () => {
      unlockAudio();
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  return children;
}

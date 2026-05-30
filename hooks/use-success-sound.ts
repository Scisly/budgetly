"use client";

import { useEffect, useRef } from "react";
import { playSuccessSound } from "@/lib/ui-sounds";

export function useSuccessSound(success: boolean | undefined): void {
  const playedRef = useRef(false);

  useEffect(() => {
    if (success && !playedRef.current) {
      playedRef.current = true;
      playSuccessSound();
    }

    if (!success) {
      playedRef.current = false;
    }
  }, [success]);
}

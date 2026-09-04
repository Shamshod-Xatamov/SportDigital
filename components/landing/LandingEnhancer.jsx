"use client";

import { useEffect } from "react";

export default function LandingEnhancer() {
  useEffect(() => {
    let cleanup;
    import("./landingInteractions").then((mod) => {
      cleanup = mod.initLandingInteractions();
    });
    return () => cleanup?.();
  }, []);

  return null;
}

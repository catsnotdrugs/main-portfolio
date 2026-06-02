import { createContext, useContext, useEffect, useState } from "react";

export type Palette = "sun" | "candy" | "night";

export const PALETTES: Palette[] = ["sun", "candy", "night"];

type PaletteContextValue = {
  palette: Palette;
  setPalette: (palette: Palette) => void;
  reducedMotion: boolean;
};

const PaletteContext = createContext<PaletteContextValue | null>(null);

export const PaletteProvider = PaletteContext.Provider;

export function usePalette(): PaletteContextValue {
  const value = useContext(PaletteContext);
  if (!value) {
    throw new Error("usePalette must be used within a PaletteProvider");
  }
  return value;
}

// Tracks the user's reduced-motion preference and stays in sync if it changes.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

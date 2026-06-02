import { PALETTES, usePalette } from "./PaletteContext";

type PaletteToggleProps = {
  className?: string;
};

// The three-dot color switcher. Reads and writes palette via context so it can
// live in the hero, the taskbar, or anywhere else without prop drilling.
export default function PaletteToggle({ className }: PaletteToggleProps) {
  const { palette, setPalette } = usePalette();

  return (
    <div className={`palette-row${className ? ` ${className}` : ""}`} aria-label="Color modes">
      {PALETTES.map((mode) => (
        <button
          key={mode}
          className={`palette-dot palette-dot-${mode}`}
          type="button"
          aria-label={`${mode} color mode`}
          aria-pressed={palette === mode}
          onClick={() => setPalette(mode)}
        />
      ))}
    </div>
  );
}

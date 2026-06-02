import type { DesktopApp } from "../../data/profile";

type DesktopIconProps = {
  app: DesktopApp;
  active: boolean;
  onOpen: () => void;
};

// A double-clickable desktop shortcut. Single Enter/Space or double-click opens.
export default function DesktopIcon({ app, active, onOpen }: DesktopIconProps) {
  return (
    <button
      type="button"
      className={`desktop-icon${active ? " is-active" : ""}`}
      aria-label={`Open ${app.name}`}
      aria-pressed={active}
      onDoubleClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <span className="desktop-icon-glyph" aria-hidden="true">
        {app.icon}
      </span>
      <span className="desktop-icon-label">{app.name}</span>
    </button>
  );
}

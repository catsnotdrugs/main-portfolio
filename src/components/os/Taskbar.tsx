import { forwardRef } from "react";
import type { AppId, DesktopApp } from "../../data/profile";
import PaletteToggle from "../shared/PaletteToggle";
import type { OSState } from "./useWindowManager";

type TaskbarProps = {
  apps: DesktopApp[];
  state: OSState;
  isMobile: boolean;
  onToggle: (id: AppId) => void;
  buttonRefs: React.RefObject<Partial<Record<AppId, HTMLButtonElement | null>>>;
};

const Taskbar = forwardRef<HTMLDivElement, TaskbarProps>(
  ({ apps, state, isMobile, onToggle, buttonRefs }, ref) => {
    return (
      <div className="taskbar" ref={ref}>
        <span className="taskbar-brand" aria-hidden="true">
          CW
        </span>
        <nav className="taskbar-apps" aria-label={isMobile ? "Jump to section" : "Open windows"}>
          {apps.map((app) => {
            const win = state.windows[app.id];
            const active = isMobile ? false : win.open && !win.minimized && state.focused === app.id;
            return (
              <button
                key={app.id}
                type="button"
                className={`taskbar-button${win.open && !win.minimized && !isMobile ? " is-open" : ""}`}
                aria-pressed={active}
                onClick={() => onToggle(app.id)}
                ref={(el) => {
                  buttonRefs.current[app.id] = el;
                }}
              >
                <span className="taskbar-icon" aria-hidden="true">
                  {app.icon}
                </span>
                <span className="taskbar-label">{app.name}</span>
              </button>
            );
          })}
        </nav>
        <PaletteToggle className="taskbar-palette" />
      </div>
    );
  },
);

Taskbar.displayName = "Taskbar";

export default Taskbar;

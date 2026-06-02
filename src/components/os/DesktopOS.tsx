import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AppId, DesktopApp, SiteContent } from "../../data/profile";
import { usePalette } from "../shared/PaletteContext";
import { useWindowManager } from "./useWindowManager";
import Window from "./Window";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import AboutApp from "./apps/AboutApp";
import IntoApp from "./apps/IntoApp";
import MadeApp from "./apps/MadeApp";
import NowApp from "./apps/NowApp";
import PhotosApp from "./apps/PhotosApp";
import ContactApp from "./apps/ContactApp";

type DesktopOSProps = {
  apps: DesktopApp[];
  content: SiteContent;
  footer: string;
};

export default function DesktopOS({ apps, content, footer }: DesktopOSProps) {
  const { state, actions } = useWindowManager(apps);
  const { reducedMotion } = usePalette();
  const [isMobile, setIsMobile] = useState(false);
  const taskbarButtons = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({});
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(max-width: 720px)");
    setIsMobile(query.matches);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Keep every window's default position inside the desktop on narrow screens.
  useEffect(() => {
    if (isMobile) return;
    const clampAll = () => {
      const el = surfaceRef.current;
      if (!el) return;
      const width = el.clientWidth;
      const height = el.clientHeight;
      apps.forEach((app) => {
        const maxX = Math.max(8, width - Math.min(app.size.w, width) - 8);
        const maxY = Math.max(8, height - 80);
        const nx = Math.min(app.pos.x, maxX);
        const ny = Math.min(app.pos.y, maxY);
        actions.move(app.id, nx, ny);
      });
    };
    clampAll();
    window.addEventListener("resize", clampAll);
    return () => window.removeEventListener("resize", clampAll);
  }, [isMobile, apps, actions]);

  const renderContent = (id: AppId): ReactNode => {
    switch (id) {
      case "about":
        return <AboutApp about={content.about} />;
      case "into":
        return <IntoApp into={content.into} />;
      case "made":
        return <MadeApp made={content.made} />;
      case "now":
        return <NowApp now={content.now} />;
      case "photos":
        return <PhotosApp photos={content.photos} />;
      case "contact":
        return <ContactApp contact={content.contact} />;
      default:
        return null;
    }
  };

  const handleClose = (id: AppId) => {
    actions.close(id);
    // Return focus to the launcher after the window unmounts.
    window.setTimeout(() => taskbarButtons.current[id]?.focus(), 0);
  };

  const handleToggle = (id: AppId) => {
    if (isMobile) {
      const el = document.getElementById(`window-${id}`);
      el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      return;
    }
    actions.toggle(id);
  };

  return (
    <section className="desktop-os" id="explore">
      <div className="desktop-intro">
        <p className="kicker desktop-kicker">The desktop</p>
        <h2 className="section-title">Open a window.</h2>
        <p className="desktop-sub">
          {isMobile ? "Scroll the windows, or jump around from the bar below." : "Double-click an icon, drag the windows, make a mess."}
        </p>
      </div>

      <div ref={surfaceRef} className={`desktop-surface${isMobile ? " is-mobile" : ""}`}>
        {!isMobile ? (
          <div className="desktop-icons">
            {apps.map((app) => {
              const win = state.windows[app.id];
              return (
                <DesktopIcon
                  key={app.id}
                  app={app}
                  active={win.open && !win.minimized}
                  onOpen={() => actions.open(app.id)}
                />
              );
            })}
          </div>
        ) : null}

        <div className="desktop-windows">
          {apps.map((app) => (
            <Window
              key={app.id}
              app={app}
              win={state.windows[app.id]}
              focused={state.focused === app.id}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
              onFocus={() => actions.focus(app.id)}
              onClose={() => handleClose(app.id)}
              onMinimize={() => actions.minimize(app.id)}
              onMove={(x, y) => actions.move(app.id, x, y)}
            >
              {renderContent(app.id)}
            </Window>
          ))}
        </div>
      </div>

      <Taskbar
        apps={apps}
        state={state}
        isMobile={isMobile}
        onToggle={handleToggle}
        buttonRefs={taskbarButtons}
      />

      <p className="desktop-footer">{footer}</p>
    </section>
  );
}

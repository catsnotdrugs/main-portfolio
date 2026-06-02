import { useEffect, useRef, type ReactNode } from "react";
import type { DesktopApp } from "../../data/profile";
import type { WindowState } from "./useWindowManager";

type WindowProps = {
  app: DesktopApp;
  win: WindowState;
  focused: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
};

type DragState = {
  dragging: boolean;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
  lastX: number;
  lastY: number;
};

export default function Window({
  app,
  win,
  focused,
  isMobile,
  reducedMotion,
  onFocus,
  onClose,
  onMinimize,
  onMove,
  children,
}: WindowProps) {
  const winRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const wasActive = useRef(false);
  const mounted = useRef(false);
  const titleId = `win-title-${app.id}`;

  const isActive = win.open && !win.minimized;

  // Move focus into a window when the user opens it, but never on the initial
  // mount (that would scroll a default-open window into view on page load).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      wasActive.current = isActive;
      return;
    }
    if (isActive && !wasActive.current) {
      winRef.current?.focus({ preventScroll: true });
    }
    wasActive.current = isActive;
  }, [isActive]);

  if (!isActive && !isMobile) return null;

  const onTitlePointerDown = (event: React.PointerEvent) => {
    onFocus();
    if (isMobile) return;
    const el = winRef.current;
    if (!el) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      dragging: true,
      startX: event.clientX,
      startY: event.clientY,
      baseX: win.x,
      baseY: win.y,
      lastX: win.x,
      lastY: win.y,
    };
  };

  const onTitlePointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    const el = winRef.current;
    if (!drag?.dragging || !el) return;
    const parent = el.parentElement;
    const bounds = parent?.getBoundingClientRect();
    let nx = drag.baseX + (event.clientX - drag.startX);
    let ny = drag.baseY + (event.clientY - drag.startY);
    if (bounds) {
      nx = Math.max(0, Math.min(nx, bounds.width - 80));
      ny = Math.max(0, Math.min(ny, bounds.height - 48));
    } else {
      nx = Math.max(0, nx);
      ny = Math.max(0, ny);
    }
    el.style.left = `${nx}px`;
    el.style.top = `${ny}px`;
    drag.lastX = nx;
    drag.lastY = ny;
  };

  const onTitlePointerUp = () => {
    const drag = dragRef.current;
    if (!drag?.dragging) return;
    drag.dragging = false;
    onMove(drag.lastX, drag.lastY);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    }
  };

  const style = isMobile
    ? undefined
    : { left: `${win.x}px`, top: `${win.y}px`, width: `${win.w}px`, zIndex: win.z };

  const className = [
    "os-window",
    focused && !isMobile ? "is-focused" : "",
    reducedMotion ? "" : "os-window-anim",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={winRef}
      id={`window-${app.id}`}
      className={className}
      style={style}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      onPointerDown={isMobile ? undefined : onFocus}
      onKeyDown={onKeyDown}
    >
      <header
        className="os-titlebar"
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onPointerCancel={onTitlePointerUp}
      >
        <span className="os-title" id={titleId}>
          <span className="os-title-icon" aria-hidden="true">
            {app.icon}
          </span>
          {app.name}
        </span>
        {!isMobile ? (
          <span className="os-window-buttons">
            <button
              type="button"
              className="os-window-button os-minimize"
              aria-label={`Minimize ${app.name}`}
              onClick={onMinimize}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span aria-hidden="true">–</span>
            </button>
            <button
              type="button"
              className="os-window-button os-close"
              aria-label={`Close ${app.name}`}
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <span aria-hidden="true">×</span>
            </button>
          </span>
        ) : null}
      </header>
      <div className="os-window-body">{children}</div>
    </section>
  );
}

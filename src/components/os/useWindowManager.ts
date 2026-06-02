import { useMemo, useReducer } from "react";
import type { AppId, DesktopApp } from "../../data/profile";

export type WindowState = {
  id: AppId;
  open: boolean;
  minimized: boolean;
  z: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type OSState = {
  windows: Record<AppId, WindowState>;
  zCounter: number;
  focused: AppId | null;
};

type Action =
  | { type: "OPEN"; id: AppId }
  | { type: "CLOSE"; id: AppId }
  | { type: "FOCUS"; id: AppId }
  | { type: "MINIMIZE"; id: AppId }
  | { type: "MOVE"; id: AppId; x: number; y: number }
  | { type: "TOGGLE"; id: AppId };

function buildInitialState(apps: DesktopApp[]): OSState {
  const windows = {} as Record<AppId, WindowState>;
  let z = 0;
  let focused: AppId | null = null;
  for (const app of apps) {
    const open = Boolean(app.defaultOpen);
    if (open) {
      z += 1;
      focused = app.id;
    }
    windows[app.id] = {
      id: app.id,
      open,
      minimized: false,
      z: open ? z : 0,
      x: app.pos.x,
      y: app.pos.y,
      w: app.size.w,
      h: app.size.h,
    };
  }
  return { windows, zCounter: z, focused };
}

function reducer(state: OSState, action: Action): OSState {
  const win = "id" in action ? state.windows[action.id] : undefined;
  if (!win) return state;

  switch (action.type) {
    case "OPEN":
    case "FOCUS": {
      const z = state.zCounter + 1;
      return {
        ...state,
        zCounter: z,
        focused: action.id,
        windows: {
          ...state.windows,
          [action.id]: { ...win, open: true, minimized: false, z },
        },
      };
    }
    case "CLOSE":
      return {
        ...state,
        focused: state.focused === action.id ? null : state.focused,
        windows: { ...state.windows, [action.id]: { ...win, open: false, minimized: false } },
      };
    case "MINIMIZE":
      return {
        ...state,
        focused: state.focused === action.id ? null : state.focused,
        windows: { ...state.windows, [action.id]: { ...win, minimized: true } },
      };
    case "MOVE":
      return {
        ...state,
        windows: { ...state.windows, [action.id]: { ...win, x: action.x, y: action.y } },
      };
    case "TOGGLE": {
      const isActive = win.open && !win.minimized && state.focused === action.id;
      if (isActive) {
        return {
          ...state,
          focused: null,
          windows: { ...state.windows, [action.id]: { ...win, minimized: true } },
        };
      }
      const z = state.zCounter + 1;
      return {
        ...state,
        zCounter: z,
        focused: action.id,
        windows: { ...state.windows, [action.id]: { ...win, open: true, minimized: false, z } },
      };
    }
    default:
      return state;
  }
}

export function useWindowManager(apps: DesktopApp[]) {
  const initial = useMemo(() => buildInitialState(apps), [apps]);
  const [state, dispatch] = useReducer(reducer, initial);

  const actions = useMemo(
    () => ({
      open: (id: AppId) => dispatch({ type: "OPEN", id }),
      close: (id: AppId) => dispatch({ type: "CLOSE", id }),
      focus: (id: AppId) => dispatch({ type: "FOCUS", id }),
      minimize: (id: AppId) => dispatch({ type: "MINIMIZE", id }),
      move: (id: AppId, x: number, y: number) => dispatch({ type: "MOVE", id, x, y }),
      toggle: (id: AppId) => dispatch({ type: "TOGGLE", id }),
    }),
    [],
  );

  return { state, actions };
}

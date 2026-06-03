# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`imchriswilliams.com` — Chris Williams' personal homepage. Astro 6 + React 19, deployed as a static site. Not a portfolio or dev-focused page: the content is about Frenchies, golf, whiskey, and small projects, written in a bold/punchy voice.

## Commands

```bash
npm run dev      # astro dev server on :4321
npm run build    # astro check (strict TS) + astro build → ./dist
npm run check    # type-check only, no build
npm run preview  # serve ./dist locally
```

`npm run build` runs `astro check` first, so **strict TS errors fail the build**. There is no test suite, no linter, and no formatter wired in.

## Architecture

**One page, one island.** `src/pages/index.astro` renders a single `<Playground client:load />`. Everything interactive lives inside that one React tree — the hero physics loop and the desktop OS window manager share continuous client state and would coordinate badly across separate islands.

`Playground.tsx` is a thin shell that:
1. Owns the palette state (`sun` / `candy` / `night`) and provides it plus a `reducedMotion` flag via `PaletteContext`.
2. Renders the hero copy + `<HeroToy />` in the fixed `.scene-layer` / `.overlay-layer` stack.
3. Renders `<DesktopOS />` underneath.

### Hero physics (`src/components/hero/`)

A bespoke zero-gravity 2D solver. **Zero dependencies.**

- `usePhysics.ts` is the engine. Bodies live in a **ref array**, not React state; the rAF loop mutates refs and writes `transform: translate3d(...)` imperatively, so React doesn't re-render during motion.
- The loop sleeps (`cancelAnimationFrame`) when total kinetic energy drops below epsilon, and wakes on pointerdown. This is the perf / battery win — don't replace it with a state-driven render loop.
- Drag uses Pointer Events + `setPointerCapture` with a spring-follow target; release velocity becomes the fling.
- Objects are SVG components in `objects/` (Frenchie, GolfBall, WhiskeyGlass, CodeBlock). They recolor via CSS palette variables (`fill: var(--pink)`, etc.) — no per-palette logic needed in JS.
- **Reduced-motion** mode renders the toys at their starting positions and allows drag but kills momentum. The hook checks the flag itself; don't rely on the CSS-only reduced-motion block to suppress motion here.
- **Never use `Math.random()` at render.** Starting positions come from `heroObjects[].start` as deterministic percent coords so SSR and client render identically.

### Desktop OS (`src/components/os/`)

A retro fake OS where each content zone is a draggable window.

- `useWindowManager.ts` is a `useReducer` over `Record<AppId, WindowState>` with actions `OPEN / CLOSE / FOCUS / MINIMIZE / MOVE / TOGGLE`. `OPEN`/`FOCUS` bump a monotonic `zCounter`, which becomes the window's `z-index`.
- `Window.tsx` handles drag the same way the hero does — Pointer Events with `setPointerCapture`, imperative transform writes during `pointermove`, dispatch `MOVE` only on `pointerup`.
- `DesktopOS.tsx` watches `(max-width: 720px)` via `matchMedia`. On mobile, windows render as **stacked full-width cards in document flow** (no absolute positioning, no drag); the taskbar becomes a scroll-to app-switcher.
- App content lives in `apps/` (one component per `AppId`). All copy reads from the `content` object in `src/data/profile.ts`.
- **Default-open windows must not auto-focus on mount** (it scrolls them into view on load). `Window.tsx` skips the focus call on the initial mount and uses `preventScroll: true` thereafter. The focus-return on close uses a `setTimeout(0)` rather than `rAF` — `rAF` is throttled when the tab isn't foregrounded, which broke the focus return.

### Palette system (`src/components/shared/`)

The three palettes are CSS-variable swaps on a single root class: `.playground-shell.palette-sun` / `.palette-candy` / `.palette-night`. The variables (`--sun`, `--ink`, `--pink`, `--aqua`, etc.) are consumed everywhere downstream, including by the SVG hero objects. To add a palette, define the variable block and add the class — no JS or component changes needed.

`PaletteContext` exposes `{ palette, setPalette, reducedMotion }`. The `useReducedMotion` hook listens to `prefers-reduced-motion` and stays in sync if the user toggles it.

### Content (`src/data/profile.ts`)

All site copy is one typed module. Real specifics that may still be placeholders are marked `// TODO(real):`. Keep this file **the only source of strings** — components should never hardcode copy.

**Copy rule:** no em-dashes (—) anywhere in user-facing strings. They read as AI-written. Use periods, commas, parentheses, or sentence breaks instead. This applies to all `profile.ts` content (and any future user-visible string), not to code comments. The voice is **bold and punchy**: short, confident, declarative.

### Live GHIN handicap

`src/data/handicap.json` is the source of truth for the handicap shown in the About card. It's regenerated by `scripts/update-handicap.mjs` every Monday 9am ET via `.github/workflows/update-handicap.yml`, which commits the change back to `master`.

The script logs in to `api2.ghin.com` with a static-key AES-128-ECB request token (the same token format the GHIN web app uses; key extracted from their bundle). It reads `display` from `golfer_user.golfers[0]` — that's the formatted current handicap. **Any failure (auth, WAF, schema change) calls `softExit(0)`** so `handicap.json` is left untouched and the build never breaks.

Required GitHub Action secrets: `GHIN_EMAIL`, `GHIN_PASSWORD`. The GHIN# is hardcoded in the workflow but can be overridden with a `GHIN_NUMBER` secret.

If the GHIN client breaks, check `api2.ghin.com`'s JS bundle for any key/endpoint rotation — the script lifts both from there.

## Conventions

- **SSR safety:** never read `window`/`document`/`Math.random()`/`Date.now()` during render. Defer to `useLayoutEffect` for viewport measurement and use deterministic values for SSR-rendered attributes.
- **Imperative for performance:** the hero loop and window drag both write `transform` to DOM nodes directly rather than through React state. Don't "fix" this by lifting positions into state.
- **CSS shadow language:** tactile chunky offset shadows (`Npx Npx 0 var(--ink)`), 2–3px ink borders, weight 950 for chunky text, 8px radius for most controls. Match this aesthetic when adding new chrome.
- **Mobile breakpoint is 720px**, matched in both CSS (`@media (max-width: 720px)`) and JS (`matchMedia('(max-width: 720px)')` in `DesktopOS`).

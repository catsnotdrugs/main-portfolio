import { useState } from "react";
import type { DesktopApp, HeroObjectDef, SiteContent } from "../data/profile";
import { PaletteProvider, useReducedMotion, type Palette } from "./shared/PaletteContext";
import PaletteToggle from "./shared/PaletteToggle";
import HeroToy from "./hero/HeroToy";
import DesktopOS from "./os/DesktopOS";

type Profile = {
  name: string;
  handle: string;
  email: string;
  tagline: string;
  jobTitle: string;
  city: string;
  intro: string;
  footer: string;
};

type PlaygroundProps = {
  profile: Profile;
  heroObjects: HeroObjectDef[];
  desktopApps: DesktopApp[];
  content: SiteContent;
};

export default function Playground({ profile, heroObjects, desktopApps, content }: PlaygroundProps) {
  const [palette, setPalette] = useState<Palette>("sun");
  const reducedMotion = useReducedMotion();

  return (
    <PaletteProvider value={{ palette, setPalette, reducedMotion }}>
      <main className={`playground-shell palette-${palette}`}>
        <div className="scene-layer">
          <HeroToy defs={heroObjects} />
        </div>

        <div className="overlay-layer">
          <header className="top-bar">
            <a className="brand-mark" href="/" aria-label={`${profile.name} home`}>
              <span>CW</span>
            </a>
            <a className="top-cta" href="#explore">
              Explore ↓
            </a>
          </header>

          <section className="hero-grid">
            <div className="hero-copy">
              <p className="kicker">@{profile.handle}</p>
              <h1 className="title-text">{profile.name}</h1>
              <p className="tagline-text">{profile.tagline}</p>
              <p className="intro-text">{profile.intro}</p>
              <div className="hero-actions">
                <a className="console-button console-button-primary" href="#explore">
                  Open the desktop
                </a>
                <PaletteToggle />
              </div>
              <p className="hero-hint">Psst. Drag the toys around.</p>
            </div>
          </section>
        </div>

        <DesktopOS apps={desktopApps} content={content} footer={profile.footer} />
      </main>
    </PaletteProvider>
  );
}

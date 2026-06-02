import { useState } from "react";
import type { HeroFacet, personalHome } from "../data/profile";
import PersonalSections from "./PersonalSections";

type Profile = {
  name: string;
  handle: string;
  email: string;
  intro: string;
  about: string;
  footer: string;
};

type PlaygroundProps = {
  profile: Profile;
  facets: HeroFacet[];
  personalHome: typeof personalHome;
};

export default function Playground({ profile, facets, personalHome }: PlaygroundProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [palette, setPalette] = useState<"sun" | "candy" | "night">("sun");
  const selected = facets[selectedIndex] ?? facets[0];

  const selectObject = (id: string) => {
    const nextIndex = facets.findIndex((facet) => facet.id === id);
    setSelectedIndex(nextIndex >= 0 ? nextIndex : 0);
  };

  const shuffleObject = () => {
    setSelectedIndex((currentIndex) => (currentIndex + 1) % facets.length);
  };

  return (
    <main className={`playground-shell palette-${palette}`}>
      <div className="scene-layer">
        <StaticBackdrop selected={selected} />
      </div>

      <div className="overlay-layer">
        <header className="top-bar">
          <a className="brand-mark" href="/" aria-label={`${profile.name} home`}>
            <span>CW</span>
          </a>
          <nav className="glass-panel" aria-label="Primary">
            <a className="nav-chip" href="#now">
              Now
            </a>
            <a className="nav-chip" href="#likes">
              Likes
            </a>
            <a className="nav-chip" href="#made">
              Made
            </a>
            <a className="nav-chip" href="#contact">
              Contact
            </a>
          </nav>
        </header>

        <section className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">@{profile.handle}</p>
            <h1 className="title-text">{profile.name}</h1>
            <p className="intro-text">{profile.intro}</p>
            <div className="toy-console" aria-label="Toybox controls">
              <button className="console-button console-button-primary" type="button" onClick={shuffleObject}>
                Surprise me
              </button>
              <button className="console-button" type="button" onClick={shuffleObject}>
                Next thing
              </button>
            </div>
            <div className="palette-row" aria-label="Color modes">
              {(["sun", "candy", "night"] as const).map((mode) => (
                <button
                  key={mode}
                  className={`palette-dot palette-dot-${mode}`}
                  type="button"
                  aria-label={`${mode} color mode`}
                  aria-pressed={palette === mode}
                  onClick={() => {
                    setPalette(mode);
                  }}
                />
              ))}
            </div>
          </div>

          <aside className="object-card" aria-live="polite">
            <div className="object-card-top">
              <p className="kicker object-kicker">Currently showing</p>
              <span
                className="object-swatch"
                style={{ background: selected?.color }}
                aria-hidden="true"
              />
            </div>
            <h2>{selected?.title}</h2>
            <p>{selected?.body}</p>
            {selected?.cta ? (
              <a className="primary-link" href={selected.cta.href}>
                {selected.cta.label}
              </a>
            ) : null}
            <div className="object-button-grid">
              {facets.map((object) => (
                <button
                  key={object.id}
                  className="object-button"
                  type="button"
                  aria-pressed={object.id === selected?.id}
                  onClick={() => selectObject(object.id)}
                >
                  {object.label}
                </button>
              ))}
            </div>
          </aside>
        </section>
      </div>

      <PersonalSections profile={profile} personalHome={personalHome} />
    </main>
  );
}

function StaticBackdrop({ selected }: { selected?: HeroFacet }) {
  return (
    <div className="static-backdrop" aria-hidden="true">
      <div className="backdrop-orbit backdrop-orbit-one" />
      <div className="backdrop-orbit backdrop-orbit-two" />
      <div className="backdrop-plinth">
        <span className="backdrop-token token-loop" />
        <span className="backdrop-token token-meteor" style={{ background: selected?.color }} />
        <span className="backdrop-token token-cube" />
        <span className="backdrop-token token-sphere" />
        <span className="backdrop-token token-switch" />
      </div>
    </div>
  );
}

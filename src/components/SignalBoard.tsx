import { useMemo, useState } from "react";
import type { Artifact, Belief, Frequency, OperatingNote } from "../data/profile";

type Profile = {
  name: string;
  email: string;
  footer: string;
};

type Dashboard = {
  operatingNotes: OperatingNote[];
  frequencies: Frequency[];
  beliefs: Belief[];
  artifacts: Artifact[];
  contactPrompts: string[];
};

type SignalBoardProps = {
  profile: Profile;
  dashboard: Dashboard;
};

export default function SignalBoard({ profile, dashboard }: SignalBoardProps) {
  const [frequencyId, setFrequencyId] = useState(dashboard.frequencies[0]?.id ?? "");
  const [artifactId, setArtifactId] = useState(dashboard.artifacts[0]?.id ?? "");
  const [beliefIndex, setBeliefIndex] = useState(0);

  const selectedFrequency = useMemo(
    () => dashboard.frequencies.find((frequency) => frequency.id === frequencyId) ?? dashboard.frequencies[0],
    [dashboard.frequencies, frequencyId],
  );
  const selectedArtifact = useMemo(
    () => dashboard.artifacts.find((artifact) => artifact.id === artifactId) ?? dashboard.artifacts[0],
    [dashboard.artifacts, artifactId],
  );
  const selectedBelief = dashboard.beliefs[beliefIndex] ?? dashboard.beliefs[0];

  const cycleBelief = () => {
    setBeliefIndex((index) => (index + 1) % dashboard.beliefs.length);
  };

  return (
    <section id="signal-board" className="signal-board">
      <div className="signal-board-header">
        <p className="kicker signal-kicker">Signal board</p>
        <h2 className="section-title">A control room for the inside of the work</h2>
        <p>
          Not a resume. More like a map of habits, tastes, small convictions, and half-lit objects
          that explain the kind of software Chris likes making.
        </p>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel operating-panel">
          <div className="panel-heading">
            <p className="kicker">Operating notes</p>
            <span>03 active</span>
          </div>
          <div className="note-stack">
            {dashboard.operatingNotes.map((note) => (
              <article className="operating-note" key={note.label}>
                <span>{note.label}</span>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-panel frequency-panel">
          <div className="panel-heading">
            <p className="kicker">Current frequencies</p>
            <span>{selectedFrequency?.readout}</span>
          </div>
          <div className="frequency-chips" role="tablist" aria-label="Current frequencies">
            {dashboard.frequencies.map((frequency) => (
              <button
                key={frequency.id}
                type="button"
                role="tab"
                className="signal-chip"
                aria-selected={frequency.id === selectedFrequency?.id}
                onClick={() => setFrequencyId(frequency.id)}
              >
                {frequency.label}
              </button>
            ))}
          </div>
          <div className="frequency-readout">
            <h3>{selectedFrequency?.title}</h3>
            <p>{selectedFrequency?.body}</p>
          </div>
        </section>

        <section className="dashboard-panel belief-panel">
          <div className="panel-heading">
            <p className="kicker">Tiny belief</p>
            <button type="button" className="mini-button" onClick={cycleBelief}>
              Next belief
            </button>
          </div>
          <div className="belief-display">
            <span>{String(beliefIndex + 1).padStart(2, "0")}</span>
            <h3>{selectedBelief?.title}</h3>
            <p>{selectedBelief?.body}</p>
          </div>
        </section>

        <section className="dashboard-panel artifact-panel">
          <div className="panel-heading">
            <p className="kicker">Artifact shelf</p>
            <span>{selectedArtifact?.type}</span>
          </div>
          <div className="artifact-layout">
            <div className="artifact-list">
              {dashboard.artifacts.map((artifact) => (
                <button
                  key={artifact.id}
                  type="button"
                  className="artifact-button"
                  aria-pressed={artifact.id === selectedArtifact?.id}
                  onClick={() => setArtifactId(artifact.id)}
                >
                  <span style={{ background: artifact.color }} />
                  {artifact.title}
                </button>
              ))}
            </div>
            <article className="artifact-card">
              <span className="artifact-light" style={{ background: selectedArtifact?.color }} />
              <h3>{selectedArtifact?.title}</h3>
              <p>{selectedArtifact?.body}</p>
            </article>
          </div>
        </section>

        <section id="contact-transmitter" className="dashboard-panel contact-panel">
          <div className="panel-heading">
            <p className="kicker">Contact transmitter</p>
            <span>ready</span>
          </div>
          <h3>Send a signal if something here made a little click.</h3>
          <div className="prompt-grid">
            {dashboard.contactPrompts.map((prompt) => (
              <span key={prompt}>{prompt}</span>
            ))}
          </div>
          <a className="transmitter-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </section>
      </div>

      <p className="signal-footer">{profile.footer}</p>
    </section>
  );
}

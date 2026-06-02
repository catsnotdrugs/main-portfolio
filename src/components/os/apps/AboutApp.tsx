import type { SiteContent } from "../../../data/profile";

export default function AboutApp({ about }: { about: SiteContent["about"] }) {
  return (
    <div className="app app-about">
      <p className="app-greeting">{about.greeting}</p>
      <p className="app-lead">{about.lead}</p>
      {about.body.map((line, i) => (
        <p className="app-text" key={i}>
          {line}
        </p>
      ))}
      <dl className="vitals">
        {about.vitals.map((vital) => (
          <div className="vital" key={vital.label}>
            <dt>{vital.label}</dt>
            <dd>{vital.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

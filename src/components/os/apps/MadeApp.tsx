import type { SiteContent } from "../../../data/profile";

export default function MadeApp({ made }: { made: SiteContent["made"] }) {
  return (
    <div className="app app-made">
      <p className="app-lead">{made.intro}</p>
      <div className="made-list">
        {made.things.map((thing) => (
          <article className="made-card" key={thing.title}>
            <span className="made-type">{thing.type}</span>
            <h3>{thing.title}</h3>
            <p>{thing.body}</p>
            {thing.href ? (
              <a className="made-link" href={thing.href}>
                Open
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

import type { ToyObject } from "../data/profile";

type Profile = {
  name: string;
  email: string;
  about: string;
  footer: string;
};

type FallbackWorldProps = {
  profile: Profile;
  objects: ToyObject[];
};

export default function FallbackWorld({ profile, objects }: FallbackWorldProps) {
  return (
    <section id="about" className="fallback-world">
      <div className="fallback-grid">
        <div>
          <p className="kicker fallback-kicker">HTML fallback world</p>
          <h2 className="section-title">{profile.name}, in plain text</h2>
          <p className="about-copy">{profile.about}</p>
          <a className="fallback-mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
        <div className="fallback-card-grid">
          {objects.map((object) => (
            <article className="fallback-card" key={object.id}>
              <span style={{ background: object.color }} />
              <h3>{object.title}</h3>
              <p>{object.body}</p>
              {object.cta ? <a href={object.cta.href}>{object.cta.label}</a> : null}
            </article>
          ))}
        </div>
      </div>
      <p className="fallback-footer">{profile.footer}</p>
    </section>
  );
}

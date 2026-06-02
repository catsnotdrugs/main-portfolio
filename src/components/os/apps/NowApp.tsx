import type { SiteContent } from "../../../data/profile";

export default function NowApp({ now }: { now: SiteContent["now"] }) {
  return (
    <div className="app app-now">
      <p className="now-stamp">{now.updated}</p>
      <div className="now-list">
        {now.items.map((item) => (
          <article className="now-item" key={item.label}>
            <p className="now-label">{item.label}</p>
            <h3>{item.title}</h3>
            <span>{item.body}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

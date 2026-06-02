import { useState } from "react";
import type { SiteContent } from "../../../data/profile";

export default function IntoApp({ into }: { into: SiteContent["into"] }) {
  const [active, setActive] = useState(into.categories[0]?.category ?? "");
  const current = into.categories.find((c) => c.category === active) ?? into.categories[0];

  return (
    <div className="app app-into">
      <p className="app-lead">{into.intro}</p>
      <div className="into-tabs" role="tablist" aria-label="Things I am into">
        {into.categories.map((category) => (
          <button
            key={category.category}
            type="button"
            role="tab"
            className="into-tab"
            aria-selected={category.category === current?.category}
            onClick={() => setActive(category.category)}
          >
            {category.category}
          </button>
        ))}
      </div>
      <div className="into-panel">
        <p className="into-blurb">{current?.blurb}</p>
        <div className="into-chips">
          {current?.items.map((item) => (
            <span className="into-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

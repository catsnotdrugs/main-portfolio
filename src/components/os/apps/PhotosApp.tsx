import type { SiteContent } from "../../../data/profile";

export default function PhotosApp({ photos }: { photos: SiteContent["photos"] }) {
  return (
    <div className="app app-photos">
      <p className="app-lead">{photos.intro}</p>
      <div className="photo-grid">
        {photos.slots.map((slot) => (
          <article className="photo-slot" key={slot.title}>
            <div className="photo-frame" style={slot.src ? undefined : { background: slot.color }}>
              {slot.src ? <img src={slot.src} alt={slot.title} /> : <span>photo</span>}
            </div>
            <h3>{slot.title}</h3>
            <p>{slot.caption}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import type { LikeItem, MadeThing, NowItem, PersonalLink, PhotoSlot } from "../data/profile";

type Profile = {
  email: string;
  footer: string;
};

type PersonalHome = {
  nowItems: NowItem[];
  likes: LikeItem[];
  madeThings: MadeThing[];
  links: PersonalLink[];
  photoSlots: PhotoSlot[];
};

type PersonalSectionsProps = {
  profile: Profile;
  personalHome: PersonalHome;
};

export default function PersonalSections({ profile, personalHome }: PersonalSectionsProps) {
  const [selectedLike, setSelectedLike] = useState(personalHome.likes[0]?.category ?? "");
  const activeLike =
    personalHome.likes.find((like) => like.category === selectedLike) ?? personalHome.likes[0];

  return (
    <section id="now" className="personal-home">
      <div className="personal-header">
        <p className="kicker personal-kicker">Personal homepage</p>
        <h2 className="section-title">A place for the actual stuff</h2>
        <p>
          Less pitch deck, more fridge door. This is where current interests, favorite things,
          projects, links, and future photos can live without pretending to be a resume.
        </p>
      </div>

      <div className="personal-grid">
        <section className="personal-panel now-panel">
          <div className="panel-heading">
            <p className="kicker">Now</p>
            <span>replace anytime</span>
          </div>
          <div className="now-list">
            {personalHome.nowItems.map((item) => (
              <article className="now-item" key={item.label}>
                <p>{item.label}</p>
                <h3>{item.title}</h3>
                <span>{item.body}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="likes" className="personal-panel likes-panel">
          <div className="panel-heading">
            <p className="kicker">Things I like</p>
            <span>{activeLike?.category}</span>
          </div>
          <div className="like-tabs" role="tablist" aria-label="Things I like">
            {personalHome.likes.map((like) => (
              <button
                key={like.category}
                type="button"
                role="tab"
                className="signal-chip"
                aria-selected={like.category === activeLike?.category}
                onClick={() => setSelectedLike(like.category)}
              >
                {like.category}
              </button>
            ))}
          </div>
          <div className="like-card">
            {activeLike?.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section id="made" className="personal-panel made-panel">
          <div className="panel-heading">
            <p className="kicker">Things I make</p>
            <span>one facet</span>
          </div>
          <div className="made-list">
            {personalHome.madeThings.map((thing) => (
              <article className="made-card" key={thing.title}>
                <span>{thing.type}</span>
                <h3>{thing.title}</h3>
                <p>{thing.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="personal-panel photo-panel">
          <div className="panel-heading">
            <p className="kicker">Photos later</p>
            <span>slots ready</span>
          </div>
          <div className="photo-grid">
            {personalHome.photoSlots.map((slot) => (
              <article className="photo-slot" key={slot.title}>
                <div style={{ background: slot.color }}>
                  <span>photo</span>
                </div>
                <h3>{slot.title}</h3>
                <p>{slot.caption}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="personal-panel links-panel">
          <div className="panel-heading">
            <p className="kicker">Links and contact</p>
            <span>simple doors</span>
          </div>
          <div className="link-list">
            {personalHome.links.map((link) => (
              <a key={link.label} href={link.href}>
                <strong>{link.label}</strong>
                <span>{link.note}</span>
              </a>
            ))}
          </div>
          <a className="contact-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </section>
      </div>

      <p className="signal-footer">{profile.footer}</p>
    </section>
  );
}

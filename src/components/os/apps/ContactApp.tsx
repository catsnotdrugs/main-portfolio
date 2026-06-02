import type { SiteContent } from "../../../data/profile";

export default function ContactApp({ contact }: { contact: SiteContent["contact"] }) {
  return (
    <div className="app app-contact">
      <p className="app-lead">{contact.intro}</p>
      <div className="link-list">
        {contact.links.map((link) => (
          <a key={link.label} href={link.href}>
            <strong>{link.label}</strong>
            <span>{link.note}</span>
          </a>
        ))}
      </div>
      <a className="contact-cta" href={`mailto:${contact.email}`}>
        Email me
      </a>
    </div>
  );
}
